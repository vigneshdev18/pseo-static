import IORedis from 'ioredis';
import { config } from '../config.js';

export const redis = new IORedis(config.redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

redis.on('error', (e) => console.error('redis error', e));
