import { fileURLToPath, URL } from 'node:url';
import { loadEnv } from 'vite';

// The backend workspace (../backend) listens on API_PORT, default 4108. Read it from
// backend/.env (or the shell) so the Vite proxy and wait-for-api.js always follow the backend.
const backendDir = fileURLToPath(new URL('../../backend', import.meta.url));

export const apiTarget = (mode = 'development') => {
  const { API_PORT } = loadEnv(mode, backendDir, 'API_');
  return `http://localhost:${Number(API_PORT) || 4108}`;
};
