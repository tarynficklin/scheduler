// /api/list (packing lists): scoped to trips owned by the logged-in user.
import { idParam, notFound, readJson, toBoolean, toId, toText } from '../http.js';

const TITLE = { max: 100 };

const rowsOr404 = (c, rows) => (rows.length ? c.json(rows) : notFound(c, 'Packing list item not found.'));

export default {
  // GET /api/list/:id (trip id) -> items ([] when the trip isn't the user's)
  read: async (c) => c.json(await c.get('db').packing_lists.list_read([idParam(c), c.get('userId')])),

  // POST /api/list { trip_id, packing_title } -> the new item
  create: async (c) => {
    const body = await readJson(c);
    const [item] = await c.get('db').packing_lists.list_create([
      toId(body.trip_id, 'trip_id'),
      toText(body.packing_title, 'Title', TITLE),
      c.get('userId'),
    ]);
    return item ? c.json(item) : notFound(c, 'Trip not found.');
  },

  // PUT /api/list/check/:id { checked }
  check: async (c) => {
    const { checked } = await readJson(c);
    const rows = await c.get('db').packing_lists.list_check([toBoolean(checked, 'checked'), idParam(c), c.get('userId')]);
    return rowsOr404(c, rows);
  },

  // PUT /api/list/:id { packing_title }
  update: async (c) => {
    const { packing_title } = await readJson(c);
    const rows = await c.get('db').packing_lists.list_update([toText(packing_title, 'Title', TITLE), idParam(c), c.get('userId')]);
    return rowsOr404(c, rows);
  },

  // DELETE /api/list/:id
  delete: async (c) => rowsOr404(c, await c.get('db').packing_lists.list_delete([idParam(c), c.get('userId')])),

  // DELETE /api/list/purge/:id (trip id): removes the whole list
  purge: async (c) => c.json(await c.get('db').packing_lists.list_purge([idParam(c), c.get('userId')])),
};
