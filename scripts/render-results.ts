import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import os from 'node:os';

function ts() { return new Date().toISOString(); }

function hardware(): string {
  const cpus = os.cpus();
  return `- CPU: ${cpus[0]?.model ?? 'unknown'} (${cpus.length} cores)
- RAM: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(1)} GB
- OS: ${os.platform()} ${os.arch()} ${os.release()}
- Node: ${process.version}`;
}

function readJsonl(file: string): Record<string, any>[] {
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf-8').split('\n').filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } })
    .filter(Boolean) as Record<string, any>[];
}

function table(rows: Record<string, any>[], cols: string[]): string {
  if (rows.length === 0) return '_no data_\n';
  const header = `| ${cols.join(' | ')} |`;
  const sep = `| ${cols.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${cols.map((c) => String(r[c] ?? '')).join(' | ')} |`).join('\n');
  return `${header}\n${sep}\n${body}\n`;
}

async function main() {
  const out = process.argv[2] ?? '../docs/poc-results.md';
  const dir = process.argv[3] ?? './results';
  const md = `# POC Results — Zintlr SEO Static-Render

## 1. Summary

Run timestamp: ${ts()}

Static-render-to-S3 POC. Each page rendered once via \`renderToString\`, gzipped, PUT to S3 (\`seo-landing-test-vignesh\`, ap-south-1). No origin server in serve path — S3 direct.

## 2. Hardware

${hardware()}

## 3. Seed (Mongo bulk insert)

${table(readJsonl(`${dir}/seed.jsonl`), ['count', 'seconds', 'rps'])}

## 4. Render → S3 (full pipeline)

${table(readJsonl(`${dir}/render.jsonl`), ['enqueued', 'done', 'failed', 'seconds', 'rps'])}

## 5. Import (CSV → Mongo → render → S3)

${table(readJsonl(`${dir}/import.jsonl`), ['jobId', 'status', 'seconds', 'processed', 'failed', 'renderEnqueued'])}

## 6. S3 GET latency probe

${table(readJsonl(`${dir}/probe.jsonl`), ['N', 'avg', 'p50', 'p90', 'p99', 'max', 'errors'])}

## 7. S3 bucket size

${table(readJsonl(`${dir}/bucket.jsonl`), ['bucket', 'object_count', 'total_human', 'avg_bytes', 'p50_bytes', 'p99_bytes'])}

## 8. Bottlenecks

_filled in after run_

## 9. Cost actual

_filled in after AWS billing console check_

## 10. Production projection

_filled in after analysis_
`;
  writeFileSync(out, md);
  console.log(`wrote ${out} (${md.length} bytes)`);
}

mkdirSync('./results', { recursive: true });
main().catch((e) => { console.error(e); process.exit(1); });
