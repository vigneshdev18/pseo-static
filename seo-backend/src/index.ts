import express from 'express';
import { config } from './config.js';
import { connectDb } from './lib/db.js';
import { publicRouter } from './routes/public.js';
import { adminRouter } from './routes/admin.js';
import { startImportWorker } from './workers/excelImport.worker.js';
import { startRenderWorker } from './workers/render.worker.js';
import { startShardWorker, startIndexWorker } from './workers/sitemap.worker.js';
import { verifyBucket } from './lib/s3.js';

async function main() {
  await connectDb();
  await verifyBucket();
  console.log(`s3 bucket reachable: ${config.aws.bucket}`);

  startImportWorker();
  startRenderWorker();
  startShardWorker();
  startIndexWorker();
  console.log(`workers started (render concurrency=${config.renderConcurrency})`);

  const app = express();
  app.use(express.json({ limit: '2mb' }));
  app.use('/api/seo', publicRouter);
  app.use('/api/admin/seo', adminRouter);
  app.listen(config.port, () => {
    console.log(`seo-backend listening on ${config.port}`);
  });
}

main().catch((err) => { console.error(err); process.exit(1); });
