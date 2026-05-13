import { Router } from 'express';
import { Page } from '../models/Page.js';

export const publicRouter = Router();

publicRouter.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

publicRouter.get('/page/:slug', async (req, res) => {
  const doc = await Page.findOne({
    slug: req.params.slug,
    status: 'live',
    noindex: { $ne: true },
  }).lean();
  if (!doc) { res.status(404).json({ error: 'not_found' }); return; }
  res.json({ page: doc });
});
