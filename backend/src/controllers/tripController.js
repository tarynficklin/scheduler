// /api/trips: every query is scoped to the logged-in user (c.get('userId')).
import { idParam, notFound, readJson, toAmount, toId, toText } from '../http.js';

const DATE = { max: 10 }; // trip_start_date / trip_end_date are VARCHAR(10) ("YYYY-MM-DD")

// Single-row updates: 404 when the trip doesn't exist or isn't the user's.
const updateOne = (query, read) => async (c) => {
  const value = read(await readJson(c));
  const rows = await c.get('db').trips[query]([value, idParam(c), c.get('userId')]);
  return rows.length ? c.json(rows) : notFound(c, 'Trip not found.');
};

export default {
  // GET /api/trips/:user (the route guard checks :user is the logged-in user)
  read: async (c) => c.json(await c.get('db').trips.trip_read([c.get('userId')])),

  // GET /api/trips -> { trip_id } reserved for the next POST /api/trips
  readLast: async (c) => {
    const [row] = await c.get('db').trips.trip_read_last();
    return c.json(row);
  },

  // GET /api/trips/trip/:id -> the trip
  find: async (c) => {
    const [trip] = await c.get('db').trips.trip_find([idParam(c), c.get('userId')]);
    return trip ? c.json(trip) : notFound(c, 'Trip not found.');
  },

  // GET /api/trips/total/:id -> { sum } of the trip's schedule item prices
  total: async (c) => {
    const [row] = await c.get('db').trips.trip_total_budget([idParam(c), c.get('userId')]);
    return c.json(row);
  },

  // POST /api/trips -> [trip]. user_id always comes from the session.
  create: async (c) => {
    const body = await readJson(c);
    const tripId =
      body.trip_id === undefined || body.trip_id === null || body.trip_id === 0
        ? null
        : toId(body.trip_id, 'trip_id');
    try {
      const rows = await c
        .get('db')
        .trips.trip_create([
          tripId,
          c.get('userId'),
          toText(body.trip_location, 'Location', { max: 200 }),
          toText(body.trip_start_date, 'Start date', DATE),
          toText(body.trip_end_date, 'End date', DATE),
          toAmount(body.trip_budget, 'Budget'),
          toText(body.trip_background, 'Background', { max: 2000 }),
          toText(body.trip_bg_color, 'Color', { max: 100 }),
        ]);
      return c.json(rows);
    } catch (err) {
      if (err.errno === '23505' || err.code === '23505')
        return c.json({ error: 'That trip id is already taken.' }, 409);
      throw err;
    }
  },

  // PUT /api/trips/:id { trip_location, trip_start_date, trip_end_date, trip_budget }
  update: async (c) => {
    const body = await readJson(c);
    const rows = await c
      .get('db')
      .trips.trip_update([
        toText(body.trip_location, 'Location', { max: 200 }),
        toText(body.trip_start_date, 'Start date', DATE),
        toText(body.trip_end_date, 'End date', DATE),
        toAmount(body.trip_budget, 'Budget'),
        idParam(c),
        c.get('userId'),
      ]);
    return rows.length ? c.json(rows) : notFound(c, 'Trip not found.');
  },

  budget: updateOne('trip_budget', (body) => toAmount(body.budget, 'Budget')),
  location: updateOne('trip_location', (body) => toText(body.location, 'Location', { max: 200 })),
  startDate: updateOne('trip_start_date', (body) => toText(body.startDate, 'Start date', DATE)),
  endDate: updateOne('trip_end_date', (body) => toText(body.endDate, 'End date', DATE)),

  // DELETE /api/trips/:id (its schedules, items and packing list go with it)
  delete: async (c) => {
    const rows = await c.get('db').trips.trip_delete([idParam(c), c.get('userId')]);
    return rows.length ? c.json(rows) : notFound(c, 'Trip not found.');
  },
};
