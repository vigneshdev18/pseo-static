import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
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

function bytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

async function main() {
  console.log(`measuring s3://${BUCKET} ...`);
  let count = 0, total = 0;
  const sizes: number[] = [];
  let ContinuationToken: string | undefined;
  do {
    const r = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, ContinuationToken }));
    for (const o of r.Contents ?? []) {
      count++;
      total += o.Size ?? 0;
      sizes.push(o.Size ?? 0);
    }
    ContinuationToken = r.IsTruncated ? r.NextContinuationToken : undefined;
  } while (ContinuationToken);

  sizes.sort((a, b) => a - b);
  const out = {
    bucket: BUCKET,
    object_count: count,
    total_bytes: total,
    total_human: bytes(total),
    p50_bytes: sizes[Math.floor(sizes.length * 0.5)] ?? 0,
    p99_bytes: sizes[Math.floor(sizes.length * 0.99)] ?? 0,
    avg_bytes: count > 0 ? Math.round(total / count) : 0,
  };
  console.log(`BUCKET_RESULT ${JSON.stringify(out)}`);
  mkdirSync('./results', { recursive: true });
  appendFileSync('./results/bucket.jsonl', JSON.stringify(out) + '\n');
}

main().catch((e) => { console.error(e); process.exit(1); });
