// Creates the schema and seed data from db/master_seed.sql (Bun loads DATABASE_URL from .env).
//
//   bun run db:seed    drops and re-creates every table (wipes all data)
//   bun run db:setup   same, but only when the tables don't exist yet (never wipes)
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { connect, dbDir, describeError } from './db.js';

const ifEmpty = process.argv.includes('--if-empty');
const sql = connect();

try {
  const [{ database }] = await sql`SELECT current_database() AS database`;
  const [{ exists }] = await sql`SELECT to_regclass('public.users') IS NOT NULL AS exists`;

  if (ifEmpty && exists) {
    console.log(`database "${database}" already has the scheduler tables; nothing to do (\`bun run db:seed\` re-creates them).`);
  } else {
    await sql.unsafe(readFileSync(path.join(dbDir, 'master_seed.sql'), 'utf8')); // no params: several statements allowed
    const [counts] = await sql`
      SELECT (SELECT count(*) FROM users)::int AS users,
             (SELECT count(*) FROM trips)::int AS trips,
             (SELECT count(*) FROM schedules)::int AS schedules,
             (SELECT count(*) FROM schedule_items)::int AS items,
             (SELECT count(*) FROM packing_lists)::int AS packing`;
    console.log(
      `seeded database "${database}": ${counts.users} user(s), ${counts.trips} trip(s), ${counts.schedules} schedule(s), ` +
        `${counts.items} schedule item(s), ${counts.packing} packing list item(s). Dev login: see db/master_seed.sql.`
    );
  }
} catch (err) {
  console.error(`db setup failed: ${describeError(err)}`);
  process.exitCode = 1;
} finally {
  await sql.close();
}
