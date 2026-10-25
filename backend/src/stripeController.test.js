// The Stripe client is always mocked here: these tests never read STRIPE_SECRET_KEY
// from .env and never talk to Stripe.
import { describe, expect, test } from 'bun:test';
import { Hono } from 'hono';
import { createApp } from './app.js';
import { checkoutSessionParams, createStripeController } from './controllers/stripeController.js';

// A tiny app with the payment route and a fake logged-in user.
function appWith(controller) {
  const app = new Hono();
  app.use('*', async (c, next) => {
    c.set('userId', 7);
    await next();
  });
  app.post('/api/payment', controller.stripe);
  app.onError((err, c) => c.json({ error: err.message }, err.status ?? 500));
  return app;
}

const post = (app, body, headers = {}) =>
  app.request('http://localhost:3108/api/payment', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'http://localhost:3108', ...headers },
    body: JSON.stringify(body),
  });

function mockStripe(impl) {
  const calls = { keys: [], params: [] };
  const createClient = (key) => {
    calls.keys.push(key);
    return {
      checkout: {
        sessions: {
          create: async (params) => {
            calls.params.push(params);
            return impl(params);
          },
        },
      },
    };
  };
  return { calls, createClient };
}

describe('POST /api/payment', () => {
  test('creates a USD Checkout Session for the amount and returns its url', async () => {
    const { calls, createClient } = mockStripe(() => ({
      id: 'cs_test_123',
      url: 'https://checkout.stripe.com/c/pay/cs_test_123',
    }));
    const app = appWith(
      createStripeController({ getSecretKey: () => 'sk_test_mocked', createClient }),
    );

    const res = await post(app, { amount: 500, trip_id: 3 });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ url: 'https://checkout.stripe.com/c/pay/cs_test_123' });

    expect(calls.keys).toEqual(['sk_test_mocked']);
    expect(calls.params).toHaveLength(1);
    const [params] = calls.params;
    expect(params.mode).toBe('payment');
    expect(params.line_items).toEqual([
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: 500,
          product_data: { name: 'Donation to the Planner developer' },
        },
      },
    ]);
    expect(params.success_url).toBe('http://localhost:3108/?donation=success&trip=3');
    expect(params.cancel_url).toBe('http://localhost:3108/?donation=cancelled&trip=3');
    expect(params.metadata).toEqual({ app: 'planner', user_id: '7' });
  });

  test('defaults to $5.00 and reuses the client', async () => {
    const { calls, createClient } = mockStripe(() => ({ url: 'https://checkout.stripe.com/x' }));
    const app = appWith(
      createStripeController({ getSecretKey: () => 'sk_test_mocked', createClient }),
    );
    await post(app, {});
    await post(app, {});
    expect(calls.params.map((p) => p.line_items[0].price_data.unit_amount)).toEqual([500, 500]);
    expect(calls.keys).toHaveLength(1);
  });

  test('503 when STRIPE_SECRET_KEY is unset, without creating a client', async () => {
    const { calls, createClient } = mockStripe(() => ({ url: 'x' }));
    for (const key of [undefined, '', '   ']) {
      const app = appWith(createStripeController({ getSecretKey: () => key, createClient }));
      const res = await post(app, { amount: 500 });
      expect(res.status).toBe(503);
      expect(await res.json()).toEqual({ error: "Payments aren't configured." });
    }
    expect(calls.keys).toHaveLength(0);
  });

  test('a Stripe error (e.g. an invalid key) becomes a clean 502', async () => {
    const { createClient } = mockStripe(() => {
      const err = new Error('Invalid API Key provided: sk_test_****alid');
      err.type = 'StripeAuthenticationError';
      err.statusCode = 401;
      throw err;
    });
    const app = appWith(
      createStripeController({ getSecretKey: () => 'sk_test_invalid', createClient }),
    );
    const originalError = console.error;
    const logged = [];
    console.error = (...args) => logged.push(args.join(' '));
    try {
      const res = await post(app, { amount: 500 });
      expect(res.status).toBe(502);
      const body = await res.json();
      expect(body.error).toContain('Stripe');
      expect(JSON.stringify(body)).not.toContain('sk_test');
      expect(logged.join('\n')).not.toContain('sk_test');
    } finally {
      console.error = originalError;
    }
  });

  test('rejects bad amounts with 400', async () => {
    const { calls, createClient } = mockStripe(() => ({ url: 'x' }));
    const app = appWith(
      createStripeController({ getSecretKey: () => 'sk_test_mocked', createClient }),
    );
    for (const amount of [10, 5.5, -500, 'abc', 10_000_000]) {
      expect((await post(app, { amount })).status).toBe(400);
    }
    expect(calls.params).toHaveLength(0);
  });

  test('requires a logged-in user in the real app', async () => {
    const app = createApp({
      db: {},
      stripeController: createStripeController({
        getSecretKey: () => 'sk_test_mocked',
        createClient: () => {
          throw new Error('must not be called');
        },
      }),
    });
    const res = await post(app, { amount: 500 });
    expect(res.status).toBe(401);
  });
});

test('checkoutSessionParams without a trip', () => {
  const params = checkoutSessionParams({
    amount: 1234,
    origin: 'http://localhost:4108',
    tripId: null,
    userId: 1,
  });
  expect(params.success_url).toBe('http://localhost:4108/?donation=success');
  expect(params.line_items[0].price_data.unit_amount).toBe(1234);
});
