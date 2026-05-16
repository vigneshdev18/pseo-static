import { S3Client, PutObjectCommand, GetObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { config } from '../config.js';

export const s3 = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
  endpoint: config.aws.endpoint,
  forcePathStyle: config.aws.forcePathStyle,
});

export const usingLocalEndpoint = !!config.aws.endpoint;

export async function verifyBucket(): Promise<void> {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: config.aws.bucket }));
  } catch (e: any) {
    const code = e.$metadata?.httpStatusCode;
    // Auto-create bucket when running against Floci/LocalStack local endpoint.
    if (usingLocalEndpoint && (e.name === 'NotFound' || code === 404)) {
      const { CreateBucketCommand } = await import('@aws-sdk/client-s3');
      await s3.send(new CreateBucketCommand({ Bucket: config.aws.bucket }));
      console.log(`floci: created bucket ${config.aws.bucket}`);
      return;
    }
    // 403 = bucket exists but no HeadBucket permission (tight IAM). Trust + continue.
    if (code === 403) {
      console.warn(`verifyBucket: 403 on HeadBucket (likely IAM scope). Assuming ${config.aws.bucket} exists.`);
      return;
    }
    throw e;
  }
}

export interface PutHtmlOpts {
  slug: string;
  bodyGzip: Buffer;
  templateVersion: number;
}

export async function putHtml(opts: PutHtmlOpts): Promise<{ etag: string; size: number }> {
  const cmd = new PutObjectCommand({
    Bucket: config.aws.bucket,
    Key: `${opts.slug}.html.gz`,
    Body: opts.bodyGzip,
    ContentType: 'text/html; charset=utf-8',
    ContentEncoding: 'gzip',
    CacheControl: 'public, max-age=604800, stale-while-revalidate=86400',
    Metadata: {
      'template-version': String(opts.templateVersion),
      'rendered-at': new Date().toISOString(),
    },
  });
  const res = await s3.send(cmd);
  return { etag: res.ETag ?? '', size: opts.bodyGzip.length };
}

export async function putSitemap(key: string, bodyGzip: Buffer): Promise<{ etag: string; size: number }> {
  const cmd = new PutObjectCommand({
    Bucket: config.aws.bucket,
    Key: key,
    Body: bodyGzip,
    ContentType: 'application/xml',
    ContentEncoding: 'gzip',
    CacheControl: 'public, max-age=3600',
  });
  const res = await s3.send(cmd);
  return { etag: res.ETag ?? '', size: bodyGzip.length };
}

export async function putStatic(key: string, body: Buffer, contentType: string): Promise<void> {
  await s3.send(new PutObjectCommand({
    Bucket: config.aws.bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));
}
