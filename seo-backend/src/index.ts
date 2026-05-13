import express from 'express';
import 'dotenv/config';

const app = express();
app.get('/api/seo/health', (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

const port = Number(process.env.PORT ?? 4001);
app.listen(port, () => console.log(`seo-backend listening on ${port}`));
