import axios from 'axios';
import { appendFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const BACKEND = process.env.SEO_BACKEND_URL ?? 'http://localhost:4001';

async function main() {
  const fileArg = process.argv[2];
  if (!fileArg) { console.error('usage: trigger-import.ts <csv-path>'); process.exit(1); }
  const file = path.resolve(fileArg);
  if (!existsSync(file)) { console.error(`not found: ${file}`); process.exit(1); }

  const t0 = Date.now();
  const start = await axios.post(`${BACKEND}/api/admin/seo/import`, { source_path: file });
  const jobId = start.data.job_id;
  console.log(`job=${jobId} polling...`);
  while (true) {
    const r = await axios.get(`${BACKEND}/api/admin/seo/import/${jobId}`);
    const j = r.data;
    process.stdout.write(`\r  ${j.status} processed=${j.processed} failed=${j.failed} total=${j.total_rows}`);
    if (j.status === 'done' || j.status === 'failed') {
      console.log('');
      const elapsed = (Date.now() - t0) / 1000;
      console.log(`IMPORT_RESULT { jobId: "${jobId}", status: "${j.status}", seconds: ${elapsed.toFixed(1)}, processed: ${j.processed}, failed: ${j.failed}, renderEnqueued: ${j.render_jobs_enqueued} }`);
      mkdirSync('./results', { recursive: true });
      appendFileSync('./results/import.jsonl', JSON.stringify({
        jobId, status: j.status, seconds: Number(elapsed.toFixed(1)),
        processed: j.processed, failed: j.failed,
        renderEnqueued: j.render_jobs_enqueued,
      }) + '\n');
      return;
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
