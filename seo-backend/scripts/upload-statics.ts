import { readFileSync } from 'node:fs';
import path from 'node:path';
import { putStatic, verifyBucket } from '../src/lib/s3.js';

async function main() {
  await verifyBucket();
  const css = readFileSync(path.resolve('./public/_static/main.css'));
  await putStatic('_static/main.css', css, 'text/css; charset=utf-8');
  console.log(`uploaded _static/main.css (${css.length} bytes)`);

  const html404 = readFileSync(path.resolve('./public/404.html'));
  await putStatic('404.html', html404, 'text/html; charset=utf-8');
  console.log(`uploaded 404.html (${html404.length} bytes)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
