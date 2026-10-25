import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { apiTarget } from './scripts/api-target.js';

export default defineConfig(({ mode }) => {
  // The proxy's target is VITE_API_URL, or the backend's PORT (see scripts/api-target.js).
  // The browser only talks to /api/* (and gets sent to Stripe's checkout page).
  // PORT (this folder's .env or the shell) moves the dev server and its preview.
  const port = Number(loadEnv(mode, import.meta.dirname, 'PORT').PORT) || 3108;
  const proxy = { '/api': { target: apiTarget(mode) } };

  return {
    plugins: [react()],
    // A fixed default port per app, so all the legacy apps can run side by side.
    server: { port, strictPort: true, proxy },
    preview: { port, strictPort: true, proxy },
    // The backend serves frontend/dist in production (`bun run start:backend`), like the old
    // express.static(build).
  };
});
