// /api/schedule (trip days and their priced items): scoped to the logged-in user's trips.
import { idParam, notFound, readJson, toAmount, toBoolean, toId, toText } from '../http.js';

const rowsOr404 = (c, rows) => (rows.length ? c.json(rows) : notFound(c, 'Schedule item not found.'));

export default {
  // GET /api/schedule/:id (trip id) -> the trip's schedules (days)
  read: async (c) => c.json(await c.get('db').schedules.schedule_read([idParam(c), c.get('userId')])),

  // POST /api/schedule { trip_id, schedule_date } -> the new schedule
  create: async (c) => {
    const body = await readJson(c);
    const [schedule] = await c.get('db').schedules.schedule_create([
      toId(body.trip_id, 'trip_id'),
      toText(body.schedule_date, 'Date', { max: 50 }),
      c.get('userId'),
    ]);
    return schedule ? c.json(schedule) : notFound(c, 'Trip not found.');
  },

  // GET /api/schedule/schedule/:id -> [schedule]
  find: async (c) => c.json(await c.get('db').schedules.schedule_find([idParam(c), c.get('userId')])),

  // GET /api/schedule/item/:id (schedule id) -> the schedule's items
  readItem: async (c) => c.json(await c.get('db').schedules.item_read([idParam(c), c.get('userId')])),

  // POST /api/schedule/item { schedule_id, item_title, item_price, item_time } -> the new item
  createItem: async (c) => {
    const body = await readJson(c);
    const [item] = await c.get('db').schedules.item_create([
      toId(body.schedule_id, 'schedule_id'),
      toText(body.item_title, 'Title', { max: 100 }),
      toAmount(body.item_price, 'Price'),
      toText(body.item_time, 'Time', { max: 10, fallback: 'morning' }) || 'morning',
      c.get('userId'),
    ]);
    return item ? c.json(item) : notFound(c, 'Schedule not found.');
  },

  // PUT /api/schedule/item/title/:id { title }
  titleItem: async (c) => {
    const { title } = await readJson(c);
    return rowsOr404(c, await c.get('db').schedules.item_title([toText(title, 'Title', { max: 100 }), idParam(c), c.get('userId')]));
  },

  // PUT /api/schedule/item/price/:id { price }
  priceItem: async (c) => {
    const { price } = await readJson(c);
    return rowsOr404(c, await c.get('db').schedules.item_price([toAmount(price, 'Price'), idParam(c), c.get('userId')]));
  },

  // PUT /api/schedule/item/check/:id { checked }
  checkItem: async (c) => {
    const { checked } = await readJson(c);
    return rowsOr404(c, await c.get('db').schedules.item_check([toBoolean(checked, 'checked'), idParam(c), c.get('userId')]));
  },

  // DELETE /api/schedule/item/:id
  deleteItem: async (c) => rowsOr404(c, await c.get('db').schedules.item_delete([idParam(c), c.get('userId')])),
};
