import { Worker } from 'bullmq';
import { gzipSync } from 'node:zlib';
import { redis } from '../lib/redis.js';
import { Page } from '../models/Page.js';
import { renderPage } from '../lib/render.js';
import { putHtml } from '../lib/s3.js';
import { QUEUE_RENDER } from '../lib/queue.js';
import { config } from '../config.js';

export function startRenderWorker() {
  const worker = new Worker(
    QUEUE_RENDER,
    async (job) => {
      const { slug } = job.data as { slug: string };
      const doc = await Page.findOne({ slug }).lean();
      if (!doc) throw new Error(`page not found slug=${slug}`);

      await Page.updateOne({ slug }, { $set: { render_state: 'rendering' } });

      const html = renderPage(
        {
          slug: doc.slug,
          template_type: doc.template_type as any,
          meta: doc.meta as any,
          sections: doc.sections as any,
        },
        config.staticCssPath
      );

      const gz = gzipSync(Buffer.from(html, 'utf-8'));
      const { etag, size } = await putHtml({
        slug: doc.slug,
        bodyGzip: gz,
        templateVersion: config.templateVersion,
      });

      await Page.updateOne(
        { slug },
        {
          $set: {
            render_state: 'done',
            rendered_at: new Date(),
            s3_etag: etag,
            s3_size_bytes: size,
          },
        }
      );

      return { slug, etag, size };
    },
    { connection: redis, concurrency: config.renderConcurrency }
  );

  worker.on('failed', async (job, err) => {
    if (!job) return;
    const { slug } = job.data as { slug: string };
    await Page.updateOne(
      { slug },
      {
        $set: { render_state: 'failed' },
        $push: {
          render_failures: {
            at: new Date(),
            error: String(err.message ?? err),
            retry_count: job.attemptsMade,
          },
        },
      }
    );
  });

  worker.on('error', (e) => console.error('render worker error', e));
  return worker;
}
