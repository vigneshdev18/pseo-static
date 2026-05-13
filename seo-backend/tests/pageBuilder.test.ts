import { describe, expect, it } from 'vitest';
import { buildPageFromRow } from '../src/lib/pageBuilder.js';

const cfg = { shardCount: 4, baseDomain: 'https://zintlr.com' };

describe('buildPageFromRow', () => {
  it('rejects missing template_type', () => {
    const r = buildPageFromRow({ slug: 'x', meta_title: 'a', meta_description: 'b' }, cfg);
    expect(r.ok).toBe(false);
  });

  it('rejects unknown template_type', () => {
    const r = buildPageFromRow(
      { template_type: 'banana', slug: 'x', meta_title: 't', meta_description: 'd' }, cfg);
    expect(r.ok).toBe(false);
  });

  it('rejects oversize meta_title', () => {
    const r = buildPageFromRow(
      { template_type: 'geo', slug: 'x', meta_title: 'x'.repeat(70), meta_description: 'd' }, cfg);
    expect(r.ok).toBe(false);
  });

  it('derives canonical_url when omitted', () => {
    const r = buildPageFromRow(
      { template_type: 'geo', slug: 'india-b2b', meta_title: 't', meta_description: 'd' }, cfg);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.meta.canonical_url).toBe('https://zintlr.com/india-b2b');
  });

  it('honors explicit canonical override', () => {
    const r = buildPageFromRow(
      { template_type: 'geo', slug: 'india-b2b', meta_title: 't', meta_description: 'd',
        canonical_url: 'https://other.example/foo' }, cfg);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.meta.canonical_url).toBe('https://other.example/foo');
  });

  it('computes sitemap_shard deterministically', () => {
    const r = buildPageFromRow(
      { template_type: 'geo', slug: 'india-b2b', meta_title: 't', meta_description: 'd' }, cfg);
    if (r.ok) {
      expect(r.value.sitemap_shard).toBeGreaterThanOrEqual(0);
      expect(r.value.sitemap_shard).toBeLessThan(4);
    }
  });

  it('rejects invalid slug (uppercase)', () => {
    const r = buildPageFromRow(
      { template_type: 'geo', slug: 'India-B2B', meta_title: 't', meta_description: 'd' }, cfg);
    expect(r.ok).toBe(false);
  });
});
