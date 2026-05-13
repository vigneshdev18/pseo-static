import { createHash } from 'node:crypto';

export function slugToShard(slug: string, shardCount: number): number {
  const hash = createHash('md5').update(slug).digest();
  const n = hash.readUInt32BE(0);
  return n % shardCount;
}
