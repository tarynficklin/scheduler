// Postgres through Bun's built-in client (Bun.sql), replacing massive.
//
// Every db/<folder>/<name>.sql file is exposed as db.<folder>.<name>(params) ->
// Promise<rows[]>, so controllers keep the massive-style calls they always had
// (db.trips.trip_read([userId])). Parameters are $1, $2, ... Each file must hold
// a single statement (parameterized queries run as prepared statements). Files
// directly in db/ (master_seed.sql) are not loaded; server/seed.js runs that one.
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { SQL } from 'bun';

export const dbDir = path.join(import.meta.dirname, '..', 'db');

// Connection failures can be AggregateErrors (one per address tried) with an empty message.
export function describeError(err) {
  const inner = Array.isArray(err?.errors)
    ? err.errors.map((e) => e.message || e.code).filter(Boolean)
    : [];
  return err?.message || inner.join('; ') || err?.code || String(err);
}

// Bun.sql lets PGDATABASE / PGUSER / PGPASSWORD from the environment override the
// matching parts of the URL, so every part the URL does have is passed explicitly.
export function connect(url = process.env.DATABASE_URL) {
  if (!url) throw new Error('DATABASE_URL is not set (add it to .env).');
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    // Don't echo the value: it contains the password.
    throw new Error('DATABASE_URL is not a valid postgres:// URL.');
  }
  const explicit = {
    hostname: parsed.hostname || undefined,
    port: parsed.port ? Number(parsed.port) : undefined,
    username: decodeURIComponent(parsed.username) || undefined,
    password: decodeURIComponent(parsed.password) || undefined,
    database: decodeURIComponent(parsed.pathname.slice(1)) || undefined,
  };
  for (const key of Object.keys(explicit)) {
    if (explicit[key] === undefined) delete explicit[key];
  }
  return new SQL({ url, ...explicit });
}

// Builds the massive-style query namespaces on top of a Bun.sql client.
export function loadQueries(sql, scriptsDir = dbDir) {
  const db = {
    sql,
    ping: () => sql`SELECT current_database() AS database`.then(([row]) => row.database),
    close: () => sql.close(),
  };

  for (const dir of readdirSync(scriptsDir, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const namespace = {};
    db[dir.name] = namespace;
    for (const file of readdirSync(path.join(scriptsDir, dir.name))) {
      if (!file.endsWith('.sql')) continue;
      const text = readFileSync(path.join(scriptsDir, dir.name, file), 'utf8');
      namespace[path.basename(file, '.sql')] = (params = []) =>
        sql.unsafe(text, Array.isArray(params) ? params : [params]).then((rows) => [...rows]);
    }
  }

  return db;
}
