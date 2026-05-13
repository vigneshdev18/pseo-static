import { slugToShard } from './sharding.js';

export type BuildResult =
  | { ok: true; value: BuiltPage }
  | { ok: false; reason: string };

export interface BuiltPage {
  slug: string;
  template_type: 'geo' | 'industry' | 'pillar' | 'solution' | 'conversion';
  meta: {
    title: string;
    description: string;
    canonical_url: string;
    og_image_url?: string;
  };
  sections: Record<string, any>;
  status: 'live';
  noindex: false;
  sitemap_shard: number;
  render_state: 'pending';
}

const TEMPLATES = ['geo', 'industry', 'pillar', 'solution', 'conversion'] as const;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface BuildConfig {
  shardCount: number;
  baseDomain: string;
}

export function buildPageFromRow(
  row: Record<string, string | undefined>,
  cfg: BuildConfig
): BuildResult {
  const t = (row.template_type ?? '').trim();
  if (!t) return { ok: false, reason: 'missing template_type' };
  if (!TEMPLATES.includes(t as any)) return { ok: false, reason: `unknown template_type=${t}` };

  const slug = (row.slug ?? '').trim();
  if (!slug) return { ok: false, reason: 'missing slug' };
  if (!SLUG_RE.test(slug)) return { ok: false, reason: `invalid slug=${slug}` };

  const title = (row.meta_title ?? '').trim();
  if (!title) return { ok: false, reason: 'missing meta_title' };
  if (title.length > 60) return { ok: false, reason: `meta_title>60 (${title.length})` };

  const description = (row.meta_description ?? '').trim();
  if (!description) return { ok: false, reason: 'missing meta_description' };
  if (description.length > 160)
    return { ok: false, reason: `meta_description>160 (${description.length})` };

  const canonical = (row.canonical_url ?? '').trim() || `${cfg.baseDomain}/${slug}`;
  const og = (row.og_image_url ?? '').trim() || undefined;

  return {
    ok: true,
    value: {
      slug,
      template_type: t as BuiltPage['template_type'],
      meta: { title, description, canonical_url: canonical, og_image_url: og },
      sections: buildSections(row),
      status: 'live',
      noindex: false,
      sitemap_shard: slugToShard(slug, cfg.shardCount),
      render_state: 'pending',
    },
  };
}

function buildSections(row: Record<string, string | undefined>): Record<string, any> {
  const sections: Record<string, any> = {};

  if (row.hero_title) {
    sections.hero = {
      title: row.hero_title,
      subheading: row.hero_subtext || undefined,
      ctaLabel: row.hero_cta_primary_label || undefined,
      ctaUrl: row.hero_cta_primary_url || undefined,
      trustBadges: row.hero_trust_badges
        ? row.hero_trust_badges.split('|').map((s) => s.trim()).filter(Boolean)
        : undefined,
    };
  }

  const stats = [];
  for (let i = 1; i <= 3; i++) {
    const v = row[`data_stat_${i}_value`];
    const l = row[`data_stat_${i}_label`];
    if (v && l) stats.push({ value: v, label: l });
  }
  if (stats.length > 0) sections.stats = { stats };

  const industries = [];
  for (let i = 1; i <= 6; i++) {
    const n = row[`industries_${i}_name`];
    const d = row[`industries_${i}_description`];
    if (n && d) industries.push({ name: n, description: d });
  }
  if (industries.length > 0) sections.industries = { items: industries };

  const faqs = [];
  for (let i = 1; i <= 8; i++) {
    const q = row[`faq_q${i}`];
    const a = row[`faq_a${i}`];
    if (q && a) faqs.push({ q, a });
  }
  if (faqs.length > 0) sections.faq = { items: faqs };

  if (row.cta_heading) {
    sections.cta = {
      heading: row.cta_heading,
      description: row.cta_description || undefined,
      primaryLabel: row.cta_primary_label || undefined,
      primaryUrl: row.cta_primary_url || undefined,
    };
  }

  return sections;
}
