import { Queue, QueueEvents } from 'bullmq';
import { redis } from './redis.js';

export const QUEUE_EXCEL_IMPORT = 'excel-import';
export const QUEUE_RENDER = 'render';
export const QUEUE_SITEMAP_SHARD = 'sitemap-shard-regen';
export const QUEUE_SITEMAP_INDEX = 'sitemap-index-regen';

const defaultJobOpts = {
  removeOnComplete: { age: 3600, count: 1000 },
  removeOnFail: 1000,
  attempts: 3,
  backoff: { type: 'exponential' as const, delay: 1000 },
};

export const importQueue = new Queue(QUEUE_EXCEL_IMPORT, {
  connection: redis,
  defaultJobOptions: defaultJobOpts,
});
export const renderQueue = new Queue(QUEUE_RENDER, {
  connection: redis,
  defaultJobOptions: defaultJobOpts,
});
export const shardQueue = new Queue(QUEUE_SITEMAP_SHARD, {
  connection: redis,
  defaultJobOptions: defaultJobOpts,
});
export const indexQueue = new Queue(QUEUE_SITEMAP_INDEX, {
  connection: redis,
  defaultJobOptions: defaultJobOpts,
});

export const importEvents = new QueueEvents(QUEUE_EXCEL_IMPORT, { connection: redis });
export const renderEvents = new QueueEvents(QUEUE_RENDER, { connection: redis });
