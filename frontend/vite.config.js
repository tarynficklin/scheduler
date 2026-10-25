import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Read .env the same way the API does, so the proxy follows API_PORT (default 4108).
  // An API_PORT already set in the shell wins over the .env value.
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = `http://localhost:${env.API_PORT || 4108}`;
  // The browser only talks to /api/* (plus Unsplash and Stripe directly).
  const proxy = { '/api': { target: apiTarget } };

  return {
    plugins: [react()],
    // Keep the CRA-era REACT_APP_* names working via import.meta.env.REACT_APP_*.
    envPrefix: ['VITE_', 'REACT_APP_'],
    // Fixed per-app dev port so all the legacy apps can run side by side.
    server: { port: 3108, strictPort: true, proxy },
    preview: { port: 3108, strictPort: true, proxy },
    // The API serves ./build in production (`bun run start`), like the old express.static(build).
    build: { outDir: 'build' },
  };
});
