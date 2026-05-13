import 'dotenv/config';

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export const config = {
  port: Number(process.env.PORT ?? 4001),
  mongoUri: required('MONGO_URI'),
  redisUrl: required('REDIS_URL'),
  shardCount: Number(process.env.SHARD_COUNT ?? 4),
  baseDomain: required('SEO_BASE_DOMAIN').replace(/\/$/, ''),
  aws: {
    region: required('AWS_REGION'),
    bucket: required('AWS_S3_BUCKET'),
    accessKeyId: required('AWS_ACCESS_KEY_ID'),
    secretAccessKey: required('AWS_SECRET_ACCESS_KEY'),
    // If set, S3 client uses this endpoint instead of AWS. Used for Floci local dev.
    endpoint: process.env.AWS_ENDPOINT_URL || undefined,
    forcePathStyle: !!process.env.AWS_ENDPOINT_URL,  // path-style required for non-AWS endpoints
  },
  renderConcurrency: Number(process.env.RENDER_CONCURRENCY ?? 10),
  templateVersion: Number(process.env.TEMPLATE_VERSION ?? 1),
  staticCssPath: process.env.STATIC_CSS_PATH ?? '/_static/main.css',
};

export type AppConfig = typeof config;
