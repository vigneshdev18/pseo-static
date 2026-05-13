import { describe, expect, it } from 'vitest';
import { emitShardXml, emitIndexXml } from '../src/lib/sitemapEmit.js';

describe('emitShardXml', () => {
  it('emits urlset with URLs + lastmod', () => {
    const xml = emitShardXml([
      { loc: 'https://x.example/a', lastmod: new Date('2026-05-10T00:00:00Z') },
    ]);
    expect(xml).toContain('<urlset');
    expect(xml).toContain('<loc>https://x.example/a</loc>');
    expect(xml).toContain('<lastmod>2026-05-10</lastmod>');
  });

  it('escapes & in URL', () => {
    const xml = emitShardXml([{ loc: 'https://x.example/a&b', lastmod: new Date() }]);
    expect(xml).toContain('https://x.example/a&amp;b');
  });
});

describe('emitIndexXml', () => {
  it('emits sitemapindex with shard URLs', () => {
    const xml = emitIndexXml('https://x.example', [
      { shard: 0, lastmod: new Date('2026-05-10T00:00:00Z') },
    ]);
    expect(xml).toContain('<sitemapindex');
    expect(xml).toContain('<loc>https://x.example/sitemaps/sitemap-0.xml.gz</loc>');
  });
});
