// Route guards and the local login, against an in-memory fake of the db query files
// (no Postgres needed). End-to-end checks against the real database are in the README.
import { beforeAll, describe, expect, test } from 'bun:test';
import { createApp } from './app.js';

let devHash;
beforeAll(async () => {
  devHash = await Bun.password.hash('scheduler-dev');
});

function fakeDb() {
  const users = [{ user_id: 1, user_name: 'dev', user_email: 'dev@scheduler.test', password_hash: devHash }];
  const trips = [
    { trip_id: 1, user_id: 1, trip_location: 'New York' },
    { trip_id: 2, user_id: 2, trip_location: 'Elsewhere' },
  ];
  const publicUser = ({ password_hash, ...u }) => u;
  return {
    users: {
      user_find: async ([login]) => users.filter((u) => [u.user_name, u.user_email].some((v) => v?.toLowerCase() === login.toLowerCase())),
      user_read: async ([id]) => users.filter((u) => u.user_id === id).map(publicUser),
      user_create: async ([user_name, user_email, password_hash]) => {
        if (users.some((u) => u.user_name.toLowerCase() === user_name.toLowerCase())) throw Object.assign(new Error('duplicate'), { errno: '23505' });
        const user = { user_id: users.length + 1, user_name, user_email, password_hash };
        users.push(user);
        return [publicUser(user)];
      },
    },
    trips: {
      trip_read: async ([userId]) => trips.filter((t) => t.user_id === userId),
      trip_find: async ([id, userId]) => trips.filter((t) => t.trip_id === id && t.user_id === userId),
    },
  };
}

const json = (body) => ({ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
const cookieFrom = (res) => res.headers.get('set-cookie')?.split(';')[0];

describe('auth', () => {
  test('signup, session, logout', async () => {
    const app = createApp({ db: fakeDb(), isProduction: false });
    expect((await app.request('/api/user-data')).status).toBe(401);

    const signup = await app.request('/api/signup', json({ username: 'casey', email: 'casey@example.test', password: 'hunter22' }));
    expect(signup.status).toBe(201);
    const user = await signup.json();
    expect(user).toEqual({ user_id: 2, user_name: 'casey', user_email: 'casey@example.test' });
    expect(JSON.stringify(user)).not.toContain('password');

    const cookie = cookieFrom(signup);
    expect(cookie).toStartWith('scheduler_session=');
    const me = await app.request('/api/user-data', { headers: { cookie } });
    expect(await me.json()).toEqual(user);

    const logout = await app.request('/api/logout');
    expect(await logout.json()).toEqual({ loggedOut: true });
    expect(logout.headers.get('set-cookie')).toContain('Max-Age=0');
  });

  test('signup validation and duplicates', async () => {
    const app = createApp({ db: fakeDb() });
    expect((await app.request('/api/signup', json({ username: 'x', password: '123' }))).status).toBe(400);
    expect((await app.request('/api/signup', json({ username: 'a@b', password: 'long-enough' }))).status).toBe(400);
    expect((await app.request('/api/signup', json({ username: 'DEV', password: 'long-enough' }))).status).toBe(409);
  });

  test('login by username or email; wrong password is a 401', async () => {
    const app = createApp({ db: fakeDb() });
    for (const login of ['dev', 'DEV@scheduler.test']) {
      const res = await app.request('/api/login', json({ login, password: 'scheduler-dev' }));
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ user_id: 1, user_name: 'dev', user_email: 'dev@scheduler.test' });
    }
    expect((await app.request('/api/login', json({ login: 'dev', password: 'nope-nope' }))).status).toBe(401);
    expect((await app.request('/api/login', json({ login: 'nobody', password: 'nope-nope' }))).status).toBe(401);
  });

  test('dev back door exists outside production only', async () => {
    const dev = await createApp({ db: fakeDb(), isProduction: false }).request('/api/dev/login');
    expect(dev.status).toBe(302);
    expect(dev.headers.get('location')).toBe('/#/');
    expect(cookieFrom(dev)).toStartWith('scheduler_session=');

    const prod = await createApp({ db: fakeDb(), isProduction: true, buildDir: '/nonexistent' }).request('/api/dev/login');
    expect(prod.status).toBe(404);
  });
});

describe('scoping', () => {
  async function devCookie(app) {
    return cookieFrom(await app.request('/api/login', json({ login: 'dev', password: 'scheduler-dev' })));
  }

  test('data routes need a session', async () => {
    const app = createApp({ db: fakeDb() });
    for (const [method, path] of [
      ['GET', '/api/trips/1'],
      ['GET', '/api/trips'],
      ['GET', '/api/trips/trip/1'],
      ['POST', '/api/trips'],
      ['GET', '/api/list/1'],
      ['PUT', '/api/list/check/1'],
      ['GET', '/api/schedule/1'],
      ['POST', '/api/schedule/item'],
      ['GET', '/api/users'],
      ['DELETE', '/api/users/1'],
    ]) {
      const res = await app.request(path, { method });
      expect(`${method} ${path} ${res.status}`).toBe(`${method} ${path} 401`);
    }
  });

  test("another user's id or trip is refused", async () => {
    const app = createApp({ db: fakeDb() });
    const cookie = await devCookie(app);
    expect((await app.request('/api/trips/1', { headers: { cookie } })).status).toBe(200);
    expect((await app.request('/api/trips/2', { headers: { cookie } })).status).toBe(403);
    expect((await app.request('/api/trips/trip/1', { headers: { cookie } })).status).toBe(200);
    expect((await app.request('/api/trips/trip/2', { headers: { cookie } })).status).toBe(404);
    expect((await app.request('/api/trips/trip/abc', { headers: { cookie } })).status).toBe(400);
    expect((await app.request('/api/users/2', { method: 'PUT', headers: { cookie } })).status).toBe(403);
  });

  test('a forged cookie is ignored', async () => {
    const app = createApp({ db: fakeDb() });
    const res = await app.request('/api/user-data', { headers: { cookie: 'scheduler_session=1.forged' } });
    expect(res.status).toBe(401);
  });

  test('unknown API paths are JSON 404s', async () => {
    const res = await createApp({ db: fakeDb() }).request('/api/nope');
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'Not found.' });
  });
});
