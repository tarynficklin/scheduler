// Planner API: Hono on Bun, Postgres via Bun.sql. Run with `bun run dev` at the repo
// root (Turborepo starts this and the frontend), or `bun run start` in backend/. Bun loads
// backend/.env; variables already set in the shell win. The port is PORT (default 4108), not
// the 2018 SERVER_PORT's 3035, which collides with venix-desktop's API.
import { createApp } from './app.js';
import { connect, describeError, loadQueries } from './db.js';

const { PORT, NODE_ENV } = process.env;
const port = Number(PORT) || 4108;
const isProduction = NODE_ENV === 'production';

const db = loadQueries(connect());
const app = createApp({ db, isProduction });

//RUN THE SERVER
const server = Bun.serve({ port, fetch: app.fetch, idleTimeout: 60 });
console.log(
  `planner API listening on http://localhost:${server.port}${isProduction ? ' (production: serving frontend/dist)' : ''}`,
);
if (!isProduction)
  console.log(
    'dev back door enabled: GET /api/dev/login logs in as "dev" (NODE_ENV is not production)',
  );

db.ping()
  .then((database) => console.log(`connected to Postgres database "${database}"`))
  .catch((err) =>
    console.error(
      `could not connect to Postgres yet (check DATABASE_URL, run \`bun run db:setup\`): ${describeError(err)}`,
    ),
  );
