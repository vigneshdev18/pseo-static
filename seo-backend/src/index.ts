import express from 'express';
import { config } from './config.js';

const app = express();
app.use(express.json({ limit: '2mb' }));

app.get('/api/seo/health', (_req, res) => {
  res.json({
    ok: true,
    ts: Date.now(),
    shardCount: config.shardCount,
    region: config.aws.region,
    bucket: config.aws.bucket,
  });
});

app.listen(config.port, () => {
  console.log(`seo-backend listening on ${config.port} bucket=${config.aws.bucket}`);
});
