// Local username/email + password login (replaces the old Auth0 flow).
// For local development only: no rate limiting, no CSRF protection, and the
// session is a signed cookie holding the user id (see ../session.js).
// Passwords are hashed with Bun.password (argon2id).
import { badRequest, readJson, toText } from '../http.js';
import { endSession, getSessionUserId, startSession } from '../session.js';

// The account seeded by db/master_seed.sql; used by the dev-only back door.
export const DEV_USER = 'dev';
export const MIN_PASSWORD_LENGTH = 6;

// Never send password_hash to the browser.
const publicUser = ({ password_hash, ...user }) => user;

async function verifyPassword(password, hash) {
  try {
    return await Bun.password.verify(password, hash);
  } catch {
    return false; // malformed hash
  }
}

// The logged-in user's row ({ user_id, user_name, user_email }) or null.
// Clears a session whose user no longer exists (deleted, or the DB was re-seeded).
export async function currentUser(c) {
  if (c.get('user') !== undefined) return c.get('user');
  const userId = await getSessionUserId(c);
  const [user] = userId ? await c.get('db').users.user_read([userId]) : [];
  if (userId && !user) endSession(c);
  c.set('user', user ?? null);
  return user ?? null;
}

// Route guard: requires a logged-in session. Sets c.get('user') and c.get('userId').
export async function requireUser(c, next) {
  const user = await currentUser(c);
  if (!user) return c.json({ error: 'Not logged in.' }, 401);
  c.set('userId', user.user_id);
  await next();
}

// For routes whose :param is a user id: it must be the logged-in user's.
export const requireSelf = (param) => async (c, next) => {
  if (c.req.param(param) !== String(c.get('userId'))) {
    return c.json({ error: 'You can only access your own account.' }, 403);
  }
  await next();
};

export default {
  // POST /api/signup { username, email?, password } -> 201 user (also logs in)
  signup: async (c) => {
    const db = c.get('db');
    const body = await readJson(c);
    const username = toText(body.username ?? body.user_name, 'Username', { max: 100 }).trim();
    const email = toText(body.email ?? body.user_email, 'Email', { max: 100 }).trim() || null;
    const password = typeof body.password === 'string' ? body.password : '';

    if (!username || !password) throw badRequest('Username and password are required.');
    if (username.includes('@')) throw badRequest('Usernames cannot contain "@".');
    if (email && !/^[^\s@]+@[^\s@]+$/.test(email))
      throw badRequest('That email address does not look right.');
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw badRequest(`Passwords must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    }

    let user;
    try {
      [user] = await db.users.user_create([username, email, await Bun.password.hash(password)]);
    } catch (err) {
      if (err.errno === '23505' || err.code === '23505') {
        return c.json({ error: 'That username or email is already taken.' }, 409);
      }
      throw err;
    }

    await startSession(c, user.user_id);
    return c.json(user, 201);
  },

  // POST /api/login { login (username or email), password } -> user
  login: async (c) => {
    const db = c.get('db');
    const body = await readJson(c);
    const login = toText(body.login ?? body.username ?? body.email, 'Login', { max: 100 }).trim();
    const password = typeof body.password === 'string' ? body.password : '';

    if (!login || !password) throw badRequest('Enter your username (or email) and password.');

    const [row] = await db.users.user_find([login]);
    if (!row || !(await verifyPassword(password, row.password_hash))) {
      return c.json({ error: 'Wrong username/email or password.' }, 401);
    }

    await startSession(c, row.user_id);
    return c.json(publicUser(row));
  },

  // GET|POST /api/logout
  logout: (c) => {
    endSession(c);
    return c.json({ loggedOut: true });
  },

  // GET /api/user-data -> the logged-in user, or 401
  user: async (c) => {
    const user = await currentUser(c);
    if (!user) return c.json({ error: 'Not logged in.' }, 401);
    return c.json(user);
  },

  // DEV-ONLY back door (registered only when NODE_ENV !== 'production'):
  // logs in as the seeded dev user without a password and redirects into the app.
  devLogin: async (c) => {
    const [row] = await c.get('db').users.user_find([DEV_USER]);
    if (!row)
      return c.json({ error: `Dev user "${DEV_USER}" not found. Run \`bun run db:seed\`.` }, 404);
    await startSession(c, row.user_id);
    return c.redirect('/#/', 302);
  },
};
