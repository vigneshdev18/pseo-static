import { describe, expect, it } from 'vitest';
import { slugToShard } from '../src/lib/sharding.js';

describe('slugToShard', () => {
  it('maps slug to a shard in [0, SHARD_COUNT)', () => {
    expect(slugToShard('india-b2b-data', 4)).toBeGreaterThanOrEqual(0);
    expect(slugToShard('india-b2b-data', 4)).toBeLessThan(4);
  });

  it('is deterministic', () => {
    expect(slugToShard('india-b2b-data', 4)).toBe(slugToShard('india-b2b-data', 4));
  });

  it('distributes 10k slugs evenly within ±15% across 4 shards', () => {
    const counts = [0, 0, 0, 0];
    for (let i = 0; i < 10000; i++) counts[slugToShard(`page-${i}`, 4)]++;
    const mean = 10000 / 4;
    for (const c of counts) expect(Math.abs(c - mean) / mean).toBeLessThan(0.15);
  });
});
