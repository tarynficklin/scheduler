// Unsplash photo search for a new trip's background. It used to run in the browser with the
// REACT_APP_UAK access key; now UNSPLASH_KEY stays in backend/.env, as in venix-desktop.
//
// GET /api/unsplash/search?query=<location> -> the first page of results (up to 10), as
// Unsplash returns them. UNSPLASH_KEY unset -> 503; Unsplash errors (bad key, network) -> 502.
const UNSPLASH_SEARCH = 'https://api.unsplash.com/search/photos';

export default {
  search: async (c) => {
    const query = c.req.query('query');
    const { UNSPLASH_KEY } = process.env;
    if (typeof query !== 'string' || !query.trim())
      return c.json({ error: 'Expected a search query.' }, 400);
    if (!UNSPLASH_KEY) return c.json({ error: 'Unsplash is not configured.' }, 503);

    const params = new URLSearchParams({ page: '1', per_page: '10', query });
    let res;
    try {
      res = await fetch(`${UNSPLASH_SEARCH}?${params}`, {
        headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
      });
    } catch (err) {
      // not the error itself: the request it describes carries the key
      console.error(`unsplash: request failed (${err?.code ?? err?.name})`);
      return c.json({ error: 'Unsplash request failed.' }, 502);
    }
    if (!res.ok) {
      console.error(`unsplash: HTTP ${res.status}`);
      return c.json({ error: `Unsplash responded with HTTP ${res.status}.` }, 502);
    }
    return c.json((await res.json()).results ?? []);
  },
};
