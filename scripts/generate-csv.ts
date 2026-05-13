import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const TEMPLATES = ['geo', 'industry', 'pillar', 'solution', 'conversion'];

const HEADER = [
  'template_type','slug','meta_title','meta_description','canonical_url','og_image_url',
  'hero_title','hero_subtext','hero_cta_primary_label','hero_cta_primary_url','hero_trust_badges',
  'data_stat_1_value','data_stat_1_label','data_stat_2_value','data_stat_2_label','data_stat_3_value','data_stat_3_label',
  'industries_1_name','industries_1_description','industries_2_name','industries_2_description','industries_3_name','industries_3_description',
  'faq_q1','faq_a1','faq_q2','faq_a2',
  'cta_heading','cta_description','cta_primary_label','cta_primary_url',
];

function csvCell(s: string): string {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

async function main() {
  const N = Number(process.argv[2] ?? 10000);
  const out = process.argv[3] ?? '/tmp/seo-static-imports/pages.csv';
  if (!Number.isFinite(N) || N <= 0) {
    console.error(`bad N: ${process.argv[2]}. usage: tsx generate-csv.ts <rows> [path]`);
    process.exit(1);
  }
  await mkdir(path.dirname(out), { recursive: true });
  const ws = createWriteStream(out);
  ws.write(HEADER.join(',') + '\n');
  for (let i = 0; i < N; i++) {
    const tpl = TEMPLATES[i % TEMPLATES.length];
    const slug = `csv-${tpl}-${i}`;
    const row = [
      tpl, slug,
      `Page ${i} for ${tpl}`, `Description for page ${i} on template ${tpl}`,
      '', '',
      `Headline ${i}`, `Subtext for ${tpl} page ${i}`, 'Get started', 'https://zintlr.com/signup', 'GDPR|SOC2|ISO27001',
      '400M+', 'Verified contacts', '95%', 'Accuracy', '60+', 'Countries',
      'SaaS', 'Decision makers in growing companies', 'Healthcare', 'Compliance-aware contacts', 'Finance', 'Verified senior leaders',
      'Q1?', 'A1 about programmatic SEO. '.repeat(8).slice(0, 280),
      'Q2?', 'A2 compliance and accuracy. '.repeat(8).slice(0, 280),
      'Sign up today', 'Quick onboarding', 'Start', 'https://zintlr.com/signup',
    ].map(csvCell);
    ws.write(row.join(',') + '\n');
  }
  ws.end();
  await new Promise<void>((r) => ws.on('close', () => r()));
  console.log(`wrote ${N} rows -> ${out}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
