import { Worker } from 'bullmq';
import { gzipSync } from 'node:zlib';
import { redis } from '../lib/redis.js';
import { Page } from '../models/Page.js';
import { config } from '../config.js';
import {
  QUEUE_SITEMAP_SHARD,
  QUEUE_SITEMAP_INDEX,
  indexQueue,
} from '../lib/queue.js';
import { emitShardXml, emitIndexXml, type ShardRef } from '../lib/sitemapEmit.js';
import { putSitemap } from '../lib/s3.js';

export function startShardWorker() {
  const worker = new Worker(
    QUEUE_SITEMAP_SHARD,
    async (job) => {
      const { shard } = job.data as { shard: number };
      const cursor = Page.find(
        { sitemap_shard: shard, status: 'live', noindex: { $ne: true }, render_state: 'done' },
        { slug: 1, updated_at: 1 }
      ).cursor();
      const urls: { loc: string; lastmod: Date }[] = [];
      for await (const doc of cursor) {
        urls.push({
          loc: `${config.baseDomain}/${doc.slug}`,
          lastmod: doc.updated_at as Date,
        });
      }
      const xml = emitShardXml(urls);
      const gz = gzipSync(Buffer.from(xml, 'utf-8'));
      await putSitemap(`sitemaps/sitemap-${shard}.xml.gz`, gz);
      await indexQueue.add(QUEUE_SITEMAP_INDEX, {}, { jobId: 'index-regen' });
      return { shard, urlCount: urls.length, gzipBytes: gz.length };
    },
    { connection: redis, concurrency: 2 }
  );
  worker.on('error', (e) => console.error('shard worker error', e));
  return worker;
}

export function startIndexWorker() {
  const worker = new Worker(
    QUEUE_SITEMAP_INDEX,
    async () => {
      const refs: ShardRef[] = [];
      for (let i = 0; i < config.shardCount; i++) {
        refs.push({ shard: i, lastmod: new Date() });
      }
      const xml = emitIndexXml(config.baseDomain, refs);
      const gz = gzipSync(Buffer.from(xml, 'utf-8'));
      await putSitemap('sitemap.xml.gz', gz);
      return { shards: refs.length };
    },
    { connection: redis, concurrency: 1 }
  );
  worker.on('error', (e) => console.error('index worker error', e));
  return worker;
}
