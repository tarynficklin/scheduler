// Used by `bun run dev`: waits until the API answers before Vite starts, so an open
// browser tab doesn't hit the proxy (and log "http proxy error") while the API boots.
// Bun loads .env, so this follows API_PORT like the server and the Vite proxy do.
const port = Number(process.env.API_PORT) || 4108;
const deadline = Date.now() + 30_000;

while (true) {
  try {
    await fetch(`http://localhost:${port}/api/user-data`); // any HTTP response means it's up
    break;
  } catch {
    // not listening yet
  }
  if (Date.now() > deadline) {
    console.error(`API isn't answering on port ${port} after 30s; starting Vite anyway`);
    break;
  }
  await Bun.sleep(200);
}
