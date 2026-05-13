import express from 'express';
import { config } from './config.js';
import { connectDb } from './lib/db.js';

async function main() {
  await connectDb();
  const app = express();
  app.use(express.json({ limit: '2mb' }));
  app.get('/api/seo/health', (_req, res) => {
    res.json({ ok: true, ts: Date.now(), bucket: config.aws.bucket });
  });
  app.listen(config.port, () => {
    console.log(`seo-backend listening on ${config.port}`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
