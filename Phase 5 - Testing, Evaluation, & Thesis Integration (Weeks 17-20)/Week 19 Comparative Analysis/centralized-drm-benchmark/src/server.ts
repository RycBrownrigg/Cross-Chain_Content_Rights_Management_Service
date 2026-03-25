/**
 * Express server for centralized DRM benchmark.
 *
 * Implements the same content rights operations as the blockchain pallet
 * for side-by-side performance comparison.
 *
 * @module server
 *
 * Usage: npx tsx src/server.ts [port]
 * Default port: 3000
 */

import express from 'express';
import { initDatabase } from './database.js';
import routes from './routes.js';

const PORT = parseInt(process.env.PORT || process.argv[2] || '3000');

async function main() {
  const app = express();
  app.use(express.json());
  app.use('/', routes);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', port: PORT });
  });

  await initDatabase();

  app.listen(PORT, () => {
    console.log(`Centralized DRM benchmark server running on http://localhost:${PORT}`);
  });
}

main().catch((e) => {
  console.error('Server failed to start:', e.message);
  process.exit(1);
});
