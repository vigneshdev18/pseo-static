import { Worker } from 'bullmq';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { redis } from '../lib/redis.js';
import { iterateRows } from '../lib/parseFile.js';
import { buildPageFromRow } from '../lib/pageBuilder.js';
import { Page } from '../models/Page.js';
import { ImportJob } from '../models/ImportJob.js';
import { renderQueue, shardQueue, QUEUE_EXCEL_IMPORT, QUEUE_RENDER, QUEUE_SITEMAP_SHARD } from '../lib/queue.js';
import { config } from '../config.js';

const BATCH_SIZE = 1000;

async function sha256Of(path: string): Promise<string> {
  const buf = await readFile(path);
  return createHash('sha256').update(buf).digest('hex');
}

export function startImportWorker() {
  const worker = new Worker(
    QUEUE_EXCEL_IMPORT,
    async (job) => {
      const { job_id, source_path } = job.data as { job_id: string; source_path: string };
      const cfg = { shardCount: config.shardCount, baseDomain: config.baseDomain };

      const sha = await sha256Of(source_path);
      await ImportJob.updateOne({ job_id }, { $set: { status: 'running', file_sha256: sha } });

      const conflicts: { row: number; slug: string; reason: string }[] = [];
      const affected = new Set<number>();
      const slugsForRender: string[] = [];
      let total = 0, processed = 0, failed = 0;
      let batch: any[] = [];

      async function flushBatch() {
        if (batch.length === 0) return;
        const ops = batch.map((p) => ({
          updateOne: { filter: { slug: p.slug }, update: { $set: p }, upsert: true },
        }));
        await Page.bulkWrite(ops, { ordered: false });
        for (const p of batch) slugsForRender.push(p.slug);
        batch = [];
      }

      try {
        for await (const row of iterateRows(source_path)) {
          total++;
          const built = buildPageFromRow(row, cfg);
          if (!built.ok) {
            failed++;
            conflicts.push({ row: total, slug: row.slug ?? '', reason: built.reason });
            continue;
          }
          batch.push(built.value);
          affected.add(built.value.sitemap_shard);
          processed++;
          if (batch.length >= BATCH_SIZE) await flushBatch();
        }
        await flushBatch();

        for (const slug of slugsForRender) {
          await renderQueue.add(QUEUE_RENDER, { slug }, { jobId: `render-${slug}` });
        }
        for (const shard of affected) {
          await shardQueue.add(QUEUE_SITEMAP_SHARD, { shard }, { jobId: `shard-${shard}` });
        }

        await ImportJob.updateOne(
          { job_id },
          {
            $set: {
              status: 'done',
              total_rows: total,
              processed,
              failed,
              conflicts: conflicts.slice(-1000),
              affected_shards: Array.from(affected),
              render_jobs_enqueued: slugsForRender.length,
              completed_at: new Date(),
            },
          }
        );
      } catch (err: any) {
        await ImportJob.updateOne(
          { job_id },
          { $set: { status: 'failed', error: String(err?.message ?? err), completed_at: new Date() } }
        );
        throw err;
      }
    },
    { connection: redis, concurrency: 1 }
  );

  worker.on('error', (e) => console.error('import worker error', e));
  return worker;
}
