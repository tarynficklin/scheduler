import { apiBase } from './apiBase';

// A few lines of fetch() in place of axios. Same call shapes as before:
//   api.get(url) / api.post(url, body) / api.put(url, body) / api.delete(url) -> { data, status }
// Paths (/api/...) go to the API at apiBase (see apiBase.js), with the session cookie.
// Non-2xx responses reject with an Error that has .response = { status, data },
// like axios, so callers can read err.response.data.error.
async function request(method, path, body) {
  const url = path.startsWith('/') ? `${apiBase}${path}` : path;
  const init = { method, credentials: 'include', headers: { Accept: 'application/json' } };
  if (body !== undefined) {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }

  const res = await fetch(url, init);
  const text = await res.text();
  let data = text;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // not JSON; keep the text
    }
  } else {
    data = null;
  }

  if (!res.ok) {
    const err = new Error(data?.error || `Request failed with status ${res.status}`);
    err.response = { status: res.status, data };
    throw err;
  }
  return { data, status: res.status };
}

// The API's error message, or a generic one when the API couldn't be reached.
export const errorMessage = (err) =>
  err?.response?.data?.error ?? 'Something went wrong. Is the API server running?';

const api = {
  get: (url) => request('GET', url),
  post: (url, body = {}) => request('POST', url, body),
  put: (url, body = {}) => request('PUT', url, body),
  delete: (url) => request('DELETE', url),
};

export default api;
