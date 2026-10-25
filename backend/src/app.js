// The Scheduler API as a Hono app (replaces Express + express-session + body-parser + cors).
// server/server.js connects to Postgres and serves it with Bun.serve; tests build it
// with a fake db. Every path, method and response shape the frontend uses is unchanged.
import { existsSync } from 'node:fs';
import path from 'node:path';
import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { serveStatic } from 'hono/bun';
import { HTTPException } from 'hono/http-exception';

//CONTROLLERS
import authController, { requireSelf, requireUser } from './controllers/authController.js';
import listController from './controllers/listController.js';
import scheduleController from './controllers/scheduleController.js';
import defaultStripeController from './controllers/stripeController.js';
import tripController from './controllers/tripController.js';
import userController from './controllers/userController.js';
import { describeError } from './db.js';

// Postgres errors caused by bad input rather than a server fault.
const CLIENT_ERRORS = {
  22001: 'A value is too long.',
  22003: 'A number is out of range.',
  '22P02': 'Invalid value.',
  23503: 'That record does not exist.',
};

export function createApp({
  db,
  isProduction = process.env.NODE_ENV === 'production',
  stripeController = defaultStripeController,
  buildDir = path.join(import.meta.dirname, '..', '..', 'frontend', 'dist'),
} = {}) {
  const app = new Hono();

  // for the healthcheck scripts and the frontend's `bun run dev`
  app.get('/health', (c) => c.json({ status: 'ok' }));

  //MIDDLEWARE
  app.use('*', async (c, next) => {
    c.set('db', db);
    await next();
  });
  app.use(
    '/api/*',
    bodyLimit({
      maxSize: 1024 * 1024,
      onError: (c) => c.json({ error: 'Request body too large.' }, 413),
    }),
  );

  //AUTH ENDPOINTS (local login; Auth0 and /auth/callback are gone)
  app.post('/api/signup', authController.signup);
  app.post('/api/login', authController.login);
  app.get('/api/logout', authController.logout);
  app.post('/api/logout', authController.logout);
  app.get('/api/user-data', authController.user);

  // DEV-ONLY BACK DOOR: GET /api/dev/login logs in as the seeded "dev" user with no
  // password and redirects into the app. Never registered when NODE_ENV=production.
  if (!isProduction) {
    app.get('/api/dev/login', authController.devLogin);
  }

  //USER ENDPOINTS (own account only)
  const userOrigin = '/api/users';
  app.get(`${userOrigin}`, requireUser, userController.read);
  app.post(`${userOrigin}`, authController.signup);
  app.put(`${userOrigin}/:id`, requireUser, requireSelf('id'), userController.update);
  app.delete(`${userOrigin}/:id`, requireUser, requireSelf('id'), userController.delete);

  //TRIP ENDPOINTS (scoped to the logged-in user)
  const tripOrigin = '/api/trips';
  app.use(`${tripOrigin}`, requireUser);
  app.use(`${tripOrigin}/*`, requireUser);
  app.get(`${tripOrigin}/trip/:id`, tripController.find);
  app.get(`${tripOrigin}/total/:id`, tripController.total);
  app.get(`${tripOrigin}/:user`, requireSelf('user'), tripController.read);
  app.get(`${tripOrigin}`, tripController.readLast);
  app.post(`${tripOrigin}`, tripController.create);
  app.put(`${tripOrigin}/budget/:id`, tripController.budget);
  app.put(`${tripOrigin}/location/:id`, tripController.location);
  app.put(`${tripOrigin}/startDate/:id`, tripController.startDate);
  app.put(`${tripOrigin}/endDate/:id`, tripController.endDate);
  app.put(`${tripOrigin}/:id`, tripController.update);
  app.delete(`${tripOrigin}/:id`, tripController.delete);

  //PACKING LIST ENDPOINTS
  const listOrigin = '/api/list';
  app.use(`${listOrigin}`, requireUser);
  app.use(`${listOrigin}/*`, requireUser);
  app.get(`${listOrigin}/:id`, listController.read);
  app.post(`${listOrigin}`, listController.create);
  app.put(`${listOrigin}/check/:id`, listController.check);
  app.put(`${listOrigin}/:id`, listController.update);
  app.delete(`${listOrigin}/purge/:id`, listController.purge);
  app.delete(`${listOrigin}/:id`, listController.delete);

  //SCHEDULE ENDPOINTS
  const scheduleOrigin = '/api/schedule';
  app.use(`${scheduleOrigin}`, requireUser);
  app.use(`${scheduleOrigin}/*`, requireUser);
  app.get(`${scheduleOrigin}/schedule/:id`, scheduleController.find);
  app.get(`${scheduleOrigin}/item/:id`, scheduleController.readItem);
  app.get(`${scheduleOrigin}/:id`, scheduleController.read);
  app.post(`${scheduleOrigin}`, scheduleController.create);
  app.post(`${scheduleOrigin}/item`, scheduleController.createItem);
  app.put(`${scheduleOrigin}/item/title/:id`, scheduleController.titleItem);
  app.put(`${scheduleOrigin}/item/price/:id`, scheduleController.priceItem);
  app.put(`${scheduleOrigin}/item/check/:id`, scheduleController.checkItem);
  app.delete(`${scheduleOrigin}/item/:id`, scheduleController.deleteItem);

  //STRIPE ENDPOINT (Checkout Session; see controllers/stripeController.js)
  app.post('/api/payment', requireUser, stripeController.stripe);

  app.all('/api/*', (c) => c.json({ error: 'Not found.' }, 404));

  //PRODUCTION BUILD (`bun run build`, then `bun run start`), like the old express.static(build)
  app.use('*', serveStatic({ root: buildDir }));
  if (existsSync(path.join(buildDir, 'index.html'))) {
    app.get('*', serveStatic({ root: buildDir, path: 'index.html' }));
  }

  //ERRORS
  app.onError((err, c) => {
    if (err instanceof HTTPException) return c.json({ error: err.message }, err.status);
    const code = err?.errno ?? err?.code;
    if (CLIENT_ERRORS[code]) return c.json({ error: CLIENT_ERRORS[code] }, 400);
    console.error(
      `${c.req.method} ${c.req.path} failed: ${code ? `[${code}] ` : ''}${describeError(err)}`,
    );
    return c.json({ error: 'Server error.' }, 500);
  });

  return app;
}
