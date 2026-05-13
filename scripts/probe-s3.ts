import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { appendFileSync, mkdirSync } from 'node:fs';
import 'dotenv/config';

const REGION = process.env.AWS_REGION ?? 'ap-south-1';
const BUCKET = process.env.AWS_S3_BUCKET ?? 'seo-landing-test-vignesh';
const ENDPOINT = process.env.AWS_ENDPOINT_URL || undefined;
const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  endpoint: ENDPOINT,
  forcePathStyle: !!ENDPOINT,
});

function quantile(sorted: number[], q: number) {
  return sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
}

async function probeOne(slug: string): Promise<number> {
  const t0 = Date.now();
  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: `${slug}.html.gz` });
  const res = await s3.send(cmd);
  if (res.Body) {
    // drain
    // @ts-ignore
    for await (const _ of res.Body as any) { /* */ }
  }
  return Date.now() - t0;
}

async function main() {
  const N = Number(process.argv[2] ?? 100);
  const TEMPLATES = ['geo', 'industry', 'pillar', 'solution', 'conversion'];
  const slugs: string[] = [];
  for (let i = 0; i < N; i++) {
    const tpl = TEMPLATES[i % TEMPLATES.length];
    slugs.push(`seo-${tpl}-${i}`);
  }

  console.log(`probing ${N} slugs via S3 GET (region=${REGION}${ENDPOINT ? ' endpoint=' + ENDPOINT : ''})...`);
  const latencies: number[] = [];
  let errors = 0;
  for (const slug of slugs) {
    try {
      latencies.push(await probeOne(slug));
    } catch (e) {
      errors++;
    }
  }
  latencies.sort((a, b) => a - b);
  const out = {
    N, errors,
    avg: latencies.reduce((a, b) => a + b, 0) / latencies.length,
    p50: quantile(latencies, 0.5),
    p90: quantile(latencies, 0.9),
    p99: quantile(latencies, 0.99),
    max: latencies[latencies.length - 1],
  };
  console.log(`PROBE_RESULT ${JSON.stringify(out)}`);
  mkdirSync('./results', { recursive: true });
  appendFileSync('./results/probe.jsonl', JSON.stringify(out) + '\n');
}

main().catch((e) => { console.error(e); process.exit(1); });
