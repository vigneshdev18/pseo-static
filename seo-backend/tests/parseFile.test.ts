import { describe, expect, it } from 'vitest';
import { iterateRows } from '../src/lib/parseFile.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, 'fixtures');

describe('iterateRows', () => {
  it('streams CSV rows', async () => {
    const rows: Record<string, string>[] = [];
    for await (const row of iterateRows(path.join(FIXTURES, 'sample.csv'))) {
      rows.push(row);
    }
    expect(rows).toHaveLength(2);
    expect(rows[0].slug).toBe('india-b2b');
  });

  it('rejects unknown extension', async () => {
    await expect(async () => {
      for await (const _ of iterateRows('/tmp/foo.txt')) { /* */ }
    }).rejects.toThrow();
  });
});
