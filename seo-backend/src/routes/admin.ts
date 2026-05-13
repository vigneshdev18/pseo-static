import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { Page } from '../models/Page.js';
import { ImportJob } from '../models/ImportJob.js';
import { importQueue, renderQueue, shardQueue, QUEUE_RENDER, QUEUE_SITEMAP_SHARD } from '../lib/queue.js';
import { config } from '../config.js';
import { verifyBucket } from '../lib/s3.js';

export const adminRouter = Router();

adminRouter.get('/health', async (_req, res) => {
  try {
    await verifyBucket();
    res.json({ ok: true, ts: Date.now(), bucket: config.aws.bucket });
  } catch (e: any) {
    res.status(503).json({ ok: false, error: e.message });
  }
});

adminRouter.post('/import', async (req, res) => {
  const { source_path } = req.body as { source_path?: string };
  if (!source_path) { res.status(400).json({ error: 'source_path required' }); return; }
  const jobId = randomUUID();
  await ImportJob.create({ job_id: jobId, source_path, status: 'queued' });
  await importQueue.add('excel-import', { job_id: jobId, source_path }, { jobId });
  res.status(202).json({ job_id: jobId });
});

adminRouter.get('/import/:jobId', async (req, res) => {
  const job = await ImportJob.findOne({ job_id: req.params.jobId }).lean();
  if (!job) { res.status(404).json({ error: 'not_found' }); return; }
  res.json(job);
});

adminRouter.post('/render/:slug', async (req, res) => {
  await renderQueue.add(QUEUE_RENDER, { slug: req.params.slug }, { jobId: `render-${req.params.slug}` });
  res.json({ enqueued: true });
});

adminRouter.post('/render-all', async (_req, res) => {
  const cursor = Page.find({ status: 'live' }, { slug: 1 }).cursor();
  let n = 0;
  for await (const doc of cursor) {
    await renderQueue.add(QUEUE_RENDER, { slug: doc.slug }, { jobId: `render-${doc.slug}` });
    n++;
  }
  res.json({ enqueued: n });
});

adminRouter.post('/sitemap/regen', async (req, res) => {
  const shards: number[] = req.body?.shards ?? Array.from({ length: config.shardCount }, (_, i) => i);
  for (const s of shards) {
    await shardQueue.add(QUEUE_SITEMAP_SHARD, { shard: s }, { jobId: `shard-${s}` });
  }
  res.json({ enqueued: shards });
});
