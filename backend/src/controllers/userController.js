// /api/users: scoped to the logged-in user (the 2018 version listed and edited every user).
// Account creation is POST /api/signup (POST /api/users is an alias, see server/app.js).
import { readJson, toText } from '../http.js';
import { endSession } from '../session.js';

export default {
  // GET /api/users -> [the logged-in user] (same array shape as before)
  read: (c) => c.json([c.get('user')]),

  // PUT /api/users/:id { user_name?, user_email? } (own account only)
  update: async (c) => {
    const body = await readJson(c);
    const name =
      body.user_name === undefined ? null : toText(body.user_name, 'Username', { max: 100 }).trim();
    const email =
      body.user_email === undefined ? null : toText(body.user_email, 'Email', { max: 100 }).trim();
    if (name === '' || (name && name.includes('@'))) {
      return c.json({ error: 'Usernames cannot be empty or contain "@".' }, 400);
    }
    try {
      const rows = await c.get('db').users.user_update([name, email || null, c.get('userId')]);
      return c.json(rows);
    } catch (err) {
      if (err.errno === '23505' || err.code === '23505') {
        return c.json({ error: 'That username or email is already taken.' }, 409);
      }
      throw err;
    }
  },

  // DELETE /api/users/:id (own account only): deletes the account and all its trips, logs out.
  delete: async (c) => {
    const rows = await c.get('db').users.user_delete([c.get('userId')]);
    endSession(c);
    return c.json(rows);
  },
};
