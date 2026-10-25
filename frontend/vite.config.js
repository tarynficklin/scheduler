import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { apiTarget } from './scripts/api-target.js';

export default defineConfig(({ mode }) => {
  // The proxy follows the backend's API_PORT (default 4108), read from backend/.env or the
  // shell (see scripts/api-target.js). The browser only talks to /api/* (plus Unsplash and
  // Stripe directly).
  const proxy = { '/api': { target: apiTarget(mode) } };

  return {
    plugins: [react()],
    // Fixed per-app dev port so all the legacy apps can run side by side.
    server: { port: 3108, strictPort: true, proxy },
    preview: { port: 3108, strictPort: true, proxy },
    // The backend serves frontend/dist in production (`bun run start:backend`), like the old
    // express.static(build).
  };
});
