# Scheduler

A trip planner from 2018, modernized. Create a trip (location, dates, budget) and Scheduler finds an
Unsplash photo for the background and picks a theme color from it. Each trip gets one schedule per day with
priced items (and a running total against the budget), a packing list, and a small donate-to-the-developer widget.

React 19 + Vite frontend, [Hono](https://hono.dev) API on Bun, PostgreSQL through Bun's built-in client (`Bun.sql`), as a Bun + Turborepo monorepo laid out like snowstack-lab:

| Workspace | Package | Path | Purpose |
| --- | --- | --- | --- |
| Frontend | `@scheduler/frontend` | `frontend/` | The trip planner (React 19, Vite 8, Redux) |
| Backend | `@scheduler/backend` | `backend/` | The API (Hono on Bun), with its SQL in `backend/db/` |

## Requirements

- [Bun](https://bun.sh) 1.4.4+: package manager, script runner, and the runtime for the API (`Bun.serve`) and Vite
- Node 26.12.1 (pinned in `.node-version`; Bun does the work, Node is only for tooling that wants it)
- PostgreSQL (developed against 18.6) with a `scheduler` database

## Setup

```sh
bun install          # no native/compiled dependencies, no install scripts (trustedDependencies is empty)
bun run db:setup     # creates the tables + dev user + sample trips, only if the tables don't exist yet
bun run db:seed      # drops and re-creates everything from backend/db/master_seed.sql. Wipes existing data!
```

`bunfig.toml` sets a supply-chain cooldown: `bun install` / `bun add` never pick package versions published in the
last 7 days (`minimumReleaseAge = 604800`).

Configuration lives in `backend/.env`, plus `frontend/.env` for the browser's `REACT_APP_*` value (Bun and Vite load
them automatically; variables already set in your shell win, even empty ones):

| Variable | Used by |
| --- | --- |
| `DATABASE_URL` | API and `db:*` scripts: `postgres://user:password@host:port/scheduler` |
| `API_PORT` | API port (default **4108**); the Vite proxy and `frontend/scripts/wait-for-api.js` follow it |
| `SESSION_SECRET` | API: signs the session cookie (falls back to a fixed dev string) |
| `NODE_ENV` | `production` disables the dev back door (`bun run start` sets it) |
| `STRIPE_SECRET_KEY` | API: donations through Stripe Checkout (unset: the API answers 503) |
| `REACT_APP_UAK` | browser: Unsplash access key for trip backgrounds (unset: a default photo is used) |

`REACT_APP_*` names are kept from the Create React App days: Vite exposes them to the browser as
`import.meta.env.REACT_APP_*` (`envPrefix` in `frontend/vite.config.js`), so only put public values there.

No longer used (safe to delete from `.env`): `SERVER_PORT` (it was 3035, which collides with another app's API),
`CONNECTION_STRING` (replaced by `DATABASE_URL`), the Auth0 variables `REACT_APP_DOMAIN`, `REACT_APP_CLIENT_ID` and
`CLIENT_SECRET`, and `REACT_APP_STRIPE_PUBLIC` (Stripe Checkout doesn't need the publishable key).

> Bun.sql lets `PGDATABASE` / `PGUSER` / `PGPASSWORD` from the environment override parts of a connection URL, so
> `backend/src/db.js` parses `DATABASE_URL` and passes host, port, user, password and database explicitly. The API logs
> the database it connected to on startup.

## Running

```sh
bun run dev             # API, then Vite once the API's /health answers (Turborepo)
bun run build           # production build into frontend/dist
bun run start:backend   # API that also serves frontend/dist, with NODE_ENV=production (no dev back door)
bun run start:frontend  # preview frontend/dist with Vite on port 3108
bun run test            # unit tests for both workspaces (bun test)
bun run lint            # Biome (also the pre-commit hook)
```

In development open **http://localhost:3108**. Vite proxies `/api` to the API on `API_PORT` (read from
`backend/.env`). Both ports are fixed so the legacy apps can run side by side. `API_PORT=5108 bun run dev` moves the
API for a session, and the proxy follows. In `backend/`, `bun run dev` watches the API alone; in `frontend/`,
`bun --bun vite --port 5208` runs Vite on another port.

## Login

Auth0 is gone. Scheduler has a simple local login: the start page has **Log in** / **Sign up** tabs (username or
email + password; passwords are hashed with `Bun.password`, argon2id). The session is a signed cookie
(`scheduler_session`, HMAC-signed with `SESSION_SECRET` via `hono/cookie`) holding the user id. Logging out deletes the
cookie; sessions survive API restarts. **This is not secure and is only meant for local development.**

Seeded dev account (from `backend/db/master_seed.sql`): username **`dev`** (or email `dev@scheduler.test`), password
**`scheduler-dev`**. It owns two sample trips (New York and San Francisco) with schedules, priced items and packing
lists, so every page has content.

### Dev back door (no password)

While `NODE_ENV` is not `production`, **http://localhost:3108/api/dev/login** logs you in as `dev` and redirects to
the dashboard. The start page shows a "Dev login" link to it in dev builds. The route is not registered at all when
`NODE_ENV=production`, and the link is compiled out of production builds.

## API

All data routes need a session (401 otherwise) and only ever touch the logged-in user's rows: another user's trip
is a 404 (lists of it come back empty), and a `:user` / `:id` user id that isn't yours is a 403. Paths, methods and
response shapes are the ones the 2018 frontend used; updates and deletes now return the affected rows (`[row]`)
instead of `[]`.

| Method | Path | Body / notes |
| --- | --- | --- |
| POST | `/api/signup` | `{ username, email?, password }` (6+ chars) -> 201 user, logged in |
| POST | `/api/login` | `{ login, password }` (login = username or email) -> user |
| GET, POST | `/api/logout` | `{ loggedOut: true }` |
| GET | `/api/user-data` | the logged-in user `{ user_id, user_name, user_email }`, or 401 |
| GET | `/api/dev/login` | dev only: log in as `dev`, redirect to `/#/` |
| GET | `/api/users` | `[me]` |
| POST | `/api/users` | same as `/api/signup` |
| PUT, DELETE | `/api/users/:id` | own account only (`{ user_name?, user_email? }`); DELETE removes the account and its trips |
| GET | `/api/trips/:user` | my trips (`:user` must be my id) |
| GET | `/api/trips` | `{ trip_id }`: reserves the next trip id |
| GET | `/api/trips/trip/:id` | one trip |
| GET | `/api/trips/total/:id` | `{ sum }` of the trip's item prices, rounded to cents |
| POST | `/api/trips` | `{ trip_id?, trip_location, trip_start_date, trip_end_date, trip_budget, trip_background, trip_bg_color }`; the owner is always the session user |
| PUT | `/api/trips/:id` | `{ trip_location, trip_start_date, trip_end_date, trip_budget }` |
| PUT | `/api/trips/budget/:id`, `/location/:id`, `/startDate/:id`, `/endDate/:id` | `{ budget }`, `{ location }`, `{ startDate }`, `{ endDate }` |
| DELETE | `/api/trips/:id` | also removes its schedules, items and packing list (`ON DELETE CASCADE`) |
| GET | `/api/list/:id` | packing list of trip `:id` |
| POST | `/api/list` | `{ trip_id, packing_title }` -> item |
| PUT | `/api/list/:id`, `/api/list/check/:id` | `{ packing_title }`, `{ checked }` |
| DELETE | `/api/list/:id`, `/api/list/purge/:id` | one item; every item of trip `:id` |
| GET | `/api/schedule/:id` | schedules (days) of trip `:id` |
| GET | `/api/schedule/schedule/:id` | `[schedule]` |
| POST | `/api/schedule` | `{ trip_id, schedule_date }` -> schedule |
| GET | `/api/schedule/item/:id` | items of schedule `:id` |
| POST | `/api/schedule/item` | `{ schedule_id, item_title, item_price, item_time }` -> item |
| PUT | `/api/schedule/item/title/:id`, `/price/:id`, `/check/:id` | `{ title }`, `{ price }`, `{ checked }` |
| DELETE | `/api/schedule/item/:id` | |
| POST | `/api/payment` | `{ amount (cents, default 500), trip_id? }` -> `{ url }` of a Stripe Checkout Session |

Bad input (non-numeric ids, negative prices, text over the column limits, ...) is a 400 with `{ error }`.

## Donations (Stripe)

The donate widget used `react-stripe-checkout` (Stripe's retired legacy Checkout.js) and the server charged the
returned token with the Charges API. Now:

1. The widget posts `{ amount: 500, trip_id }` to `POST /api/payment`.
2. The API (latest `stripe` SDK) creates a **Checkout Session**: `mode: 'payment'`, one line item with
   `price_data` in USD for the amount, `success_url` `<origin>/?donation=success&trip=<id>` and `cancel_url`
   `<origin>/?donation=cancelled&trip=<id>`. It returns `{ url }`.
3. The browser goes to Stripe's hosted page; afterwards Stripe sends it back to the app, which shows a
   "Thank you" (or "cancelled") banner and returns to the trip.

Setup: put a **test-mode** secret key from the Stripe dashboard (Developers -> API keys, `sk_test_...`) in `.env` as
`STRIPE_SECRET_KEY`. In test mode no real money moves; Stripe's test card `4242 4242 4242 4242` with any future date
and CVC completes a payment. A live key (`sk_live_...`) would take real payments.
The browser no longer needs a publishable key. Without `STRIPE_SECRET_KEY` the API answers
`503 { "error": "Payments aren't configured." }`; a Stripe failure (bad key, network) is a `502` and the API logs
only the Stripe error type.

## Database

`backend/db/master_seed.sql` is the schema plus seed data and is safe to re-run (it drops and recreates every table).
Query files live in `backend/db/<table group>/*.sql` (one statement each, `$1`-style parameters) and are exposed by
`backend/src/db.js` as `db.trips.trip_read([userId])` and so on: the same calls massive used to provide, on `Bun.sql`.

```
users          user_id (identity PK), user_name (unique, case-insensitive), user_email (unique, case-insensitive), password_hash
trips          trip_id (identity PK), user_id -> users, trip_location, trip_start_date, trip_end_date (YYYY-MM-DD text),
               trip_budget, trip_background (image URL), trip_bg_color ("r, g, b")
schedules      schedule_id (identity PK), trip_id -> trips, schedule_date ("December 04 2026")
schedule_items item_id (identity PK), schedule_id -> schedules, item_title, item_price, item_time, item_checked
packing_lists  packing_id (identity PK), trip_id -> trips, packing_title, packing_checked
```

All foreign keys are `ON DELETE CASCADE`. The Auth0 columns `auth_id` and `auth_profile` are gone (local accounts
show their initial instead of a profile picture).

## What replaced what

| 2018 | Now | Why |
| --- | --- | --- |
| Create React App 1.1.4 (`react-scripts`) | Vite 8 + `@vitejs/plugin-react` | CRA is deprecated; `index.html` moved to the project root, JSX files are `.jsx` |
| React 16 `ReactDOM.render` | React 19 `createRoot` | `componentWillReceiveProps` became `componentDidUpdate`; string `class` attributes became `className` |
| `react-router-dom` 4 (`Switch`, `withRouter`) | `react-router` 8 (`HashRouter`, `Routes`, small local `withRouter`) | hash URLs kept (`/#/trip/1`) |
| redux 4 / react-redux 5 | redux 5 (`legacy_createStore`) / react-redux 9 | |
| Express, body-parser, cors, express-session | Hono on `Bun.serve`, signed cookie session | |
| massive | `Bun.sql` + `backend/src/db.js` | same `db.<folder>.<file>()` calls over `backend/db/**/*.sql` |
| dotenv | Bun's built-in `.env` loading | |
| Auth0 | local signup/login (`Bun.password`) + dev back door | |
| `react-stripe-checkout` + Charges API | Stripe Checkout Session (`stripe` 23) | legacy Checkout.js is retired |
| `node-vibrant` 3 | `@vibrant/*` 4 (`frontend/src/lib/palette.js`) | same palette, the maintained packages |
| `moment` | `frontend/src/lib/dates.js` (a few lines) | only two date helpers were used |
| `axios` | `frontend/src/lib/api.js` (fetch) | a 40-line wrapper with the same `{ data }` / `err.response` shape |
| `lodash` | removed | it was never imported |
| `frosted-glass` (web component from unpkg) | CSS `backdrop-filter` (`components/Common/Glass.jsx`) | archived on GitHub, loaded unpinned from a CDN |
| `react-fade-in` | CSS animation (`components/Common/FadeIn.jsx`) | unmaintained; a dozen lines of CSS |
| `registerServiceWorker.js`, `App.test.js` | removed | CRA boilerplate |

## Tests

`bun run test` runs `backend/src/*.test.js` and `frontend/src/lib/*.test.js`: the auth flow, route guards and per-user scoping
against an in-memory fake of the query files, the Stripe Checkout Session parameters and error paths with a mocked
Stripe client (the tests never read `STRIPE_SECRET_KEY` or call Stripe), and the date and donation-return helpers.

## Tooling

- **Turborepo** runs the workspaces' `dev`, `build`, `test`, `db:setup` and `db:seed` scripts from the root (`turbo.json`).
- **Biome** (pinned to `2.4.10`, like snowstack-lab) lints and formats everything. The config is the one shared by the
  legacy monorepos: snowstack-lab's, with a few old-code rules (hook dependencies, array-index keys, six accessibility
  rules) as warnings.
- **Husky** runs `bunx biome check .` before each commit. `.gitattributes` keeps every file LF, which Biome expects.
- `bun.lock` is committed, unlike snowstack-lab, so installs reproduce exactly and the cooldown applies to the versions
  it pins.
