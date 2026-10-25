// Donations through Stripe Checkout (replaces react-stripe-checkout, i.e. the retired
// legacy Checkout.js, and the Charges-API-with-a-token flow).
//
// POST /api/payment { amount, trip_id? } creates a Checkout Session (mode "payment",
// price_data in USD) and returns { url }; the browser redirects there. Stripe sends the
// customer back to /?donation=success (or =cancelled) and the app shows a confirmation.
//
// amount is in cents, as before (the old widget posted amount: 500 for $5.00).
// STRIPE_SECRET_KEY unset -> 503; Stripe errors (bad key, network) -> 502.
import Stripe from 'stripe';
import { badRequest, readJson, toId } from '../http.js';

export const MIN_CENTS = 50; // Stripe's minimum charge in USD
export const MAX_CENTS = 1_000_000; // $10,000: a sanity cap for a donation button
export const DEFAULT_CENTS = 500;

// Where Stripe sends the customer back: the page that made the request.
export function appOrigin(c) {
  for (const candidate of [c.req.header('origin'), c.req.url]) {
    try {
      const url = new URL(candidate);
      if (url.protocol === 'http:' || url.protocol === 'https:') return url.origin;
    } catch {
      // missing or not a URL; try the next one
    }
  }
  return 'http://localhost:3108';
}

export function checkoutSessionParams({ amount, origin, tripId, userId }) {
  const back = tripId ? `&trip=${tripId}` : '';
  return {
    mode: 'payment',
    submit_type: 'donate',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: amount,
          product_data: { name: 'Donation to the Scheduler developer' },
        },
      },
    ],
    success_url: `${origin}/?donation=success${back}`,
    cancel_url: `${origin}/?donation=cancelled${back}`,
    metadata: { app: 'scheduler', user_id: String(userId) },
  };
}

export function parseAmount(value) {
  if (value === undefined || value === null || value === '') return DEFAULT_CENTS;
  const cents = typeof value === 'string' && /^\d+$/.test(value.trim()) ? Number(value) : value;
  if (!Number.isInteger(cents) || cents < MIN_CENTS || cents > MAX_CENTS) {
    throw badRequest(
      `amount must be a whole number of cents between ${MIN_CENTS} and ${MAX_CENTS}.`,
    );
  }
  return cents;
}

const isStripeError = (err) => typeof err?.type === 'string' && err.type.startsWith('Stripe');

// getSecretKey / createClient are injectable so tests never touch the real key or network.
export function createStripeController({
  getSecretKey = () => process.env.STRIPE_SECRET_KEY,
  createClient = (key) => new Stripe(key, { maxNetworkRetries: 1, timeout: 20_000 }),
} = {}) {
  let cached = null;
  const clientFor = (key) => {
    if (cached?.key !== key) cached = { key, client: createClient(key) };
    return cached.client;
  };

  return {
    stripe: async (c) => {
      const key = (getSecretKey() ?? '').trim();
      if (!key) return c.json({ error: "Payments aren't configured." }, 503);

      const body = await readJson(c);
      const amount = parseAmount(body.amount);
      const tripId =
        body.trip_id === undefined || body.trip_id === null ? null : toId(body.trip_id, 'trip_id');
      const params = checkoutSessionParams({
        amount,
        origin: appOrigin(c),
        tripId,
        userId: c.get('userId'),
      });

      let session;
      try {
        session = await clientFor(key).checkout.sessions.create(params);
      } catch (err) {
        if (!isStripeError(err)) throw err;
        // Log the error class only; Stripe messages can echo (masked) key fragments.
        console.error(
          `Stripe Checkout Session failed: ${err.type}${err.statusCode ? ` (HTTP ${err.statusCode})` : ''}`,
        );
        return c.json({ error: "Couldn't start the Stripe checkout. Try again later." }, 502);
      }
      if (!session?.url) return c.json({ error: 'Stripe did not return a checkout URL.' }, 502);
      return c.json({ url: session.url });
    },
  };
}

export default createStripeController();
