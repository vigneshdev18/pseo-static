import { createReadStream } from 'node:fs';
import path from 'node:path';
import Papa from 'papaparse';
import ExcelJS from 'exceljs';

export async function* iterateRows(
  filePath: string
): AsyncGenerator<Record<string, string>, void, void> {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.csv') yield* iterateCsv(filePath);
  else if (ext === '.xlsx') yield* iterateXlsx(filePath);
  else throw new Error(`Unsupported file extension: ${ext}`);
}

async function* iterateCsv(
  filePath: string
): AsyncGenerator<Record<string, string>, void, void> {
  const stream = createReadStream(filePath, { encoding: 'utf-8' });
  const buffer: Record<string, string>[] = [];
  let resolveRow: ((v: IteratorResult<Record<string, string>>) => void) | null = null;
  let done = false;
  let errored: Error | null = null;

  const parser = Papa.parse(Papa.NODE_STREAM_INPUT, { header: true, skipEmptyLines: true });

  parser.on('data', (row: Record<string, string>) => {
    if (resolveRow) { resolveRow({ value: row, done: false }); resolveRow = null; }
    else buffer.push(row);
  });
  parser.on('end', () => {
    done = true;
    if (resolveRow) { resolveRow({ value: undefined as never, done: true }); resolveRow = null; }
  });
  parser.on('error', (e: Error) => {
    errored = e;
    if (resolveRow) { resolveRow({ value: undefined as never, done: true }); resolveRow = null; }
  });
  stream.on('error', (e: Error) => {
    errored = e;
    parser.destroy();
    if (resolveRow) { resolveRow({ value: undefined as never, done: true }); resolveRow = null; }
  });
  stream.pipe(parser);

  while (true) {
    if (errored) throw errored;
    if (buffer.length > 0) { yield buffer.shift()!; continue; }
    if (done) return;
    const next = await new Promise<IteratorResult<Record<string, string>>>((res) => { resolveRow = res; });
    if (errored) throw errored;
    if (next.done) return;
    yield next.value;
  }
}

async function* iterateXlsx(
  filePath: string
): AsyncGenerator<Record<string, string>, void, void> {
  const wb = new ExcelJS.stream.xlsx.WorkbookReader(filePath, {
    entries: 'emit', sharedStrings: 'cache', worksheets: 'emit',
  });
  let header: string[] | null = null;
  for await (const ws of wb as any) {
    if ((ws as any).id !== 1) continue;
    for await (const row of ws) {
      const values = (row.values as Array<unknown>).slice(1).map((v) => v == null ? '' : String(v));
      if (header == null) { header = values; continue; }
      const obj: Record<string, string> = {};
      for (let i = 0; i < header.length; i++) obj[header[i]] = values[i] ?? '';
      yield obj;
    }
    break;
  }
}
