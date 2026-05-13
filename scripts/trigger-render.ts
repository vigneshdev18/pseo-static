import axios from 'axios';
import mongoose from 'mongoose';
import { appendFileSync, mkdirSync } from 'node:fs';
import 'dotenv/config';

const BACKEND = process.env.SEO_BACKEND_URL ?? 'http://localhost:4001';
const MONGO = process.env.MONGO_URI ?? 'mongodb://localhost:27019/zintlr_seo_static';

async function main() {
  const t0 = Date.now();
  const r = await axios.post(`${BACKEND}/api/admin/seo/render-all`);
  const expected = r.data.enqueued as number;
  console.log(`enqueued=${expected} polling render_state...`);

  await mongoose.connect(MONGO);
  const Page = mongoose.connection.collection('pages');

  while (true) {
    const done = await Page.countDocuments({ render_state: 'done' });
    const failed = await Page.countDocuments({ render_state: 'failed' });
    const remaining = expected - done - failed;
    process.stdout.write(`\r  done=${done} failed=${failed} remaining=${remaining}    `);
    if (remaining <= 0) break;
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.log('');
  const elapsed = (Date.now() - t0) / 1000;
  const rps = expected / elapsed;
  const failed = await Page.countDocuments({ render_state: 'failed' });
  const done = await Page.countDocuments({ render_state: 'done' });
  console.log(`RENDER_RESULT { enqueued: ${expected}, done: ${done}, failed: ${failed}, seconds: ${elapsed.toFixed(1)}, rps: ${rps.toFixed(0)} }`);
  await mongoose.disconnect();
  mkdirSync('./results', { recursive: true });
  appendFileSync('./results/render.jsonl', JSON.stringify({ enqueued: expected, done, failed, seconds: Number(elapsed.toFixed(1)), rps: Number(rps.toFixed(0)) }) + '\n');
}

main().catch((e) => { console.error(e); process.exit(1); });
