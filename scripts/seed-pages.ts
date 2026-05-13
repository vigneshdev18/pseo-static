import mongoose from 'mongoose';
import { createHash } from 'node:crypto';
import { appendFileSync, mkdirSync } from 'node:fs';
import 'dotenv/config';

const MONGO = process.env.MONGO_URI ?? 'mongodb://localhost:27019/zintlr_seo_static';
const SHARD_COUNT = Number(process.env.SHARD_COUNT ?? 4);
const BASE = process.env.SEO_BASE_DOMAIN ?? 'https://zintlr.com';

const TEMPLATES = ['geo', 'industry', 'pillar', 'solution', 'conversion'];
const REGIONS = ['India', 'USA', 'UK', 'Australia', 'UAE', 'Germany', 'Singapore', 'Canada'];

function shard(slug: string) {
  return createHash('md5').update(slug).digest().readUInt32BE(0) % SHARD_COUNT;
}

function makePage(i: number) {
  const tpl = TEMPLATES[i % TEMPLATES.length];
  const region = REGIONS[i % REGIONS.length];
  const slug = `seo-${tpl}-${i}`;
  const longPara1 = `The ${region} B2B market presents unique prospecting challenges. Local registry verification is essential. Zintlr's ${region} database combines registry verification with AI enrichment to deliver accurate, compliant contact data.`;
  const longPara2 = `Millions of verified contacts across ${region}. Every record refreshed every 90 days and verified for email deliverability before export.`;
  return {
    slug,
    template_type: tpl,
    meta: {
      title: `B2B Data ${region} | Verified Contacts | Zintlr p${i}`.slice(0, 60),
      description: `${region}'s most accurate B2B database. Verified contacts across all major cities. GDPR + local compliance. Get started today.`.slice(0, 160),
      canonical_url: `${BASE}/${slug}`,
    },
    sections: {
      hero: {
        tagTitle: `B2B Data ${region}`,
        title: `Find the 100% Accurate B2B database for ${region}`,
        subheading: `Are you looking for the most reliable B2B database provider in ${region}? Zintlr provides the highest quality verified contacts.`,
        animatedText: `${region} Decision Makers`,
        rotatingItems: ['CEOs', 'CTOs', 'VPs', 'Directors', 'Founders'],
        ctaLabel: 'Get Started',
        ctaUrl: `${BASE}/signup`,
        trustBadges: ['GDPR compliant', 'SOC 2 compliant', 'ISO certified'],
      },
      trusted_by: { label: `Trusted by high-growth companies in ${region}` },
      stats: {
        heading: 'Data Coverage',
        stats: [
          { value: '400M+', label: 'Verified global contacts' },
          { value: '2x', label: 'Higher deliverability' },
          { value: '95%', label: 'Email accuracy' },
          { value: '60+', label: 'Industries covered' },
        ],
      },
      features: {
        heading: `Built for B2B Prospecting in ${region}`,
        items: [
          { title: 'Registry Verified', description: `Every ${region} company cross-referenced with local registries.` },
          { title: 'GDPR Compliant', description: 'Compliant with GDPR and local data protection regulations.' },
          { title: 'Deep Coverage', description: `Comprehensive data across all ${region} business hubs.` },
          { title: 'CRM Integration', description: 'Export to Salesforce, HubSpot, or any CRM via REST API.' },
          { title: 'Real-Time Refresh', description: 'Contacts refreshed every 90 days for low bounce rates.' },
          { title: 'AI Buyer Intent', description: `Identify which ${region} companies are researching solutions.` },
        ],
      },
      benefits: {
        heading: `Key Benefits for ${region} Sales Teams`,
        items: [
          { title: `3x More Meetings`, description: `Reach the right ${region} decision-maker on first outreach.` },
          { title: '70% Less Prospecting Time', description: 'AI-powered search finds the right contacts in seconds.' },
          { title: '95%+ Data Accuracy', description: 'Multi-step verification ensures contacts are current.' },
        ],
      },
      data_highlights: {
        heading: `What Makes Zintlr ${region} Data Different`,
        description: `Accurate ${region} B2B prospecting requires more than a contact list.`,
        highlights: [
          { title: 'Registry Verified', description: `Verified against ${region} registries.` },
          { title: 'AI Buyer Intent', description: `Identifies high-intent ${region} accounts.` },
        ],
      },
      industries: {
        heading: `Top ${region} Industries`,
        items: [
          { name: 'Financial Services', description: `Reach decision-makers at banks across ${region}.` },
          { name: 'Technology & SaaS', description: `Target CTOs at ${region}'s fast-growing tech companies.` },
          { name: 'Healthcare', description: `Find operations leads at ${region} hospitals.` },
          { name: 'Manufacturing', description: `Connect with plant managers across ${region}.` },
          { name: 'Professional Services', description: `Prospect into law firms in ${region}.` },
          { name: 'Retail & E-Commerce', description: `Access buyers at ${region} retail chains.` },
        ],
      },
      workflow: {
        heading: `How to clean ${region} B2B data`,
        steps: [
          { heading: `Search the ${region} Database`, description: 'Filter by industry, location, role.', checklist: ['Filter by city', 'Filter by industry', 'Filter by size'] },
          { heading: 'Verify & Enrich', description: 'Every contact verified against registries.' },
          { heading: 'Export & Engage', description: 'Push to Salesforce, HubSpot or your CRM.', checklist: ['One-click export', 'CSV + API', '95%+ deliverability'] },
        ],
      },
      compliance: {
        heading: `${region} Data You Can Trust`,
        description: `Fully compliant with ${region}'s data protection laws, GDPR, and SOC 2 certified.`,
        cards: [
          { title: 'GDPR Compliant', body: `Meets GDPR for ${region} data.` },
          { title: 'SOC 2 Type II', body: 'Enterprise-grade security.' },
          { title: 'Local Privacy', body: `Compliant with ${region} regulations.` },
          { title: 'Registry Verified', body: `Verified against ${region} registries.` },
        ],
      },
      reviews: {
        heading: `What ${region} Sales Teams Say`,
        items: [
          { quote: `Zintlr is the best for the ${region} market.`, rating: 5, name: 'James W.', role: `Head of Sales, ${region}` },
          { quote: `Finally an ${region} database that's fresh.`, rating: 5, name: 'Sophie N.', role: `Sales Director` },
          { quote: `Expanded into ${region} with zero contacts. Now growing fastest.`, rating: 4.8, name: 'Aaron M.', role: 'BDM' },
        ],
      },
      comparison: { heading: `Zintlr vs Other ${region} B2B Data Providers`, competitors: ['Apollo.io', 'ZoomInfo', 'Lusha'] },
      content: {
        blocks: [
          { heading: `Why Zintlr is the Best for ${region}`, para1: longPara1, para2: longPara2, bullets: ['Millions of contacts', 'Registry verified', 'GDPR + local compliance', '95%+ deliverability', '60+ industries', 'Deep regional coverage'] },
          { heading: `How Sales Teams Win in ${region}`, para1: longPara1, para2: longPara2 },
        ],
      },
      banner: { heading: `Mastering B2B Sales in ${region}` },
      trial_cta: {
        heading: `Start prospecting in ${region} today`,
        description: `Sign up free. Access millions of verified ${region} contacts. No credit card required.`,
        ctaLabel: 'Get a call back',
      },
      faq: {
        heading: 'Frequently Asked Questions',
        items: [
          { q: `How accurate is Zintlr's ${region} data?`, a: `${region} database maintains 95%+ accuracy through three-layer verification.` },
          { q: `Is ${region} data compliant?`, a: `Yes, fully compliant with ${region} regulations + GDPR + SOC 2.` },
          { q: `Does Zintlr cover all of ${region}?`, a: `Yes, full ${region} coverage with 90-day refresh.` },
          { q: 'What industries are covered?', a: `60+ industries across ${region}.` },
          { q: 'Free trial available?', a: 'Yes, sign up free. No credit card required.' },
        ],
      },
      cta: {
        heading: `Ready to Build Pipeline Across ${region}?`,
        description: `Start prospecting with the most accurate B2B database for ${region}.`,
        primaryLabel: 'Start Free Trial', primaryUrl: '/signup',
        secondaryLabel: 'Book a Demo', secondaryUrl: '/demo',
      },
      visibility: {
        hero: true, trusted_by: true, stats: true, features: true,
        benefits: true, data_highlights: true, industries: true,
        workflow: true, compliance: true, reviews: true,
        comparison: true, content: true, visual_banner: true,
        trial_cta: true, faq: true, cta: true,
      },
    },
    status: 'live',
    noindex: false,
    sitemap_shard: shard(slug),
    render_state: 'pending',
  };
}

async function main() {
  const N = Number(process.argv[2] ?? 10000);
  if (!Number.isFinite(N) || N <= 0) {
    console.error(`bad N: ${process.argv[2]}`); process.exit(1);
  }
  const BATCH = 1000;
  console.log(`seeding ${N} pages, batch=${BATCH}, shards=${SHARD_COUNT}`);
  const t0 = Date.now();
  await mongoose.connect(MONGO, { maxPoolSize: 50 });
  const Page = mongoose.connection.collection('pages');
  for (let i = 0; i < N; i += BATCH) {
    const docs = [];
    for (let j = i; j < Math.min(i + BATCH, N); j++) {
      const p = makePage(j) as any;
      p.created_at = new Date();
      p.updated_at = new Date();
      docs.push(p);
    }
    await Page.insertMany(docs, { ordered: false });
    if (i % 10000 === 0) {
      const elapsed = (Date.now() - t0) / 1000;
      console.log(`inserted ${i + docs.length}/${N} in ${elapsed.toFixed(1)}s`);
    }
  }
  const elapsed = (Date.now() - t0) / 1000;
  const rps = N / elapsed;
  console.log(`SEED_RESULT { count: ${N}, seconds: ${elapsed.toFixed(1)}, rps: ${rps.toFixed(0)} }`);
  await mongoose.disconnect();
  mkdirSync('./results', { recursive: true });
  appendFileSync('./results/seed.jsonl', JSON.stringify({ count: N, seconds: Number(elapsed.toFixed(1)), rps: Number(rps.toFixed(0)) }) + '\n');
}

main().catch((e) => { console.error(e); process.exit(1); });
