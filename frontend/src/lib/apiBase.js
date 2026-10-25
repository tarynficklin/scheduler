// Where the API is. A build calls it directly at VITE_API_URL (the API's own address when
// deployed, so the API has to list this site in its ALLOWED_ORIGINS). Under the Vite dev
// server it stays '' and Vite proxies /api to the backend.
export const apiBase = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');
