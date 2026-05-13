function escapeXml(s: string): string {
  return s.replace(/[&<>'"]/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&apos;', '"': '&quot;',
  })[c] ?? c);
}

function ymd(d: Date): string { return d.toISOString().slice(0, 10); }

export interface ShardUrl { loc: string; lastmod: Date }
export interface ShardRef { shard: number; lastmod: Date }

export function emitShardXml(urls: ShardUrl[]): string {
  const head = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const body = urls
    .map((u) => `  <url><loc>${escapeXml(u.loc)}</loc><lastmod>${ymd(u.lastmod)}</lastmod></url>`)
    .join('\n');
  return `${head}\n${body}\n</urlset>\n`;
}

export function emitIndexXml(baseDomain: string, shards: ShardRef[]): string {
  const head = '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const body = shards
    .map((s) =>
      `  <sitemap><loc>${escapeXml(`${baseDomain}/sitemaps/sitemap-${s.shard}.xml.gz`)}</loc><lastmod>${ymd(s.lastmod)}</lastmod></sitemap>`)
    .join('\n');
  return `${head}\n${body}\n</sitemapindex>\n`;
}
