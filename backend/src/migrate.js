// Creates the tables that are missing (db/schema.sql), without dropping or adding any data: what
// a deploy runs before each start (`bun run db:migrate`). `bun run db:seed` is the one that
// re-creates everything with the dev user. Bun loads DATABASE_URL from .env.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { connect, dbDir, describeError } from './db.js';

const sql = connect();

try {
  await sql.unsafe(readFileSync(path.join(dbDir, 'schema.sql'), 'utf8')); // several statements
  const [counts] = await sql`
    SELECT (SELECT count(*) FROM users)::int AS users, (SELECT count(*) FROM trips)::int AS trips`;
  console.log(`planner schema is up to date: ${counts.users} user(s), ${counts.trips} trip(s).`);
} catch (err) {
  console.error(`db:migrate failed: ${describeError(err)}`);
  process.exitCode = 1;
} finally {
  await sql.close();
}
