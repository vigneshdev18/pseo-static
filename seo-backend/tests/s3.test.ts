import { describe, expect, it, vi } from 'vitest';

vi.mock('@aws-sdk/client-s3', () => {
  const send = vi.fn().mockResolvedValue({ ETag: '"abc123"' });
  return {
    S3Client: vi.fn().mockImplementation(() => ({ send })),
    PutObjectCommand: vi.fn().mockImplementation((args) => ({ __cmd: 'put', args })),
    GetObjectCommand: vi.fn(),
    HeadBucketCommand: vi.fn(),
    CreateBucketCommand: vi.fn(),
  };
});

vi.mock('../src/config.js', () => ({
  config: {
    aws: {
      region: 'ap-south-1',
      bucket: 'seo-landing-test-vignesh',
      accessKeyId: 'x',
      secretAccessKey: 'y',
      endpoint: undefined,
      forcePathStyle: false,
    },
  },
}));

describe('putHtml', () => {
  it('puts gzipped HTML with etag/size returned', async () => {
    const { putHtml } = await import('../src/lib/s3.js');
    const result = await putHtml({
      slug: 'india-b2b',
      bodyGzip: Buffer.from('mock'),
      templateVersion: 1,
    });
    expect(result.etag).toBe('"abc123"');
    expect(result.size).toBe(4);
  });
});
