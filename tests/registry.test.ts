import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';
import { BUILD, CATS, DOCS, TEMPLATES, pageKinds, relayout, newPage, newElement } from '@/lib/studio';
import type { Doc } from '@/lib/studio';

/* Load the original prototype library (window.TBM) for parity checks. */
const src = fs.readFileSync(path.join(__dirname, '../reference/prototype/studio-lib.js'), 'utf8');
const sandbox: { window: Record<string, unknown> } = { window: {} };
vm.runInNewContext(src, sandbox);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TBM = sandbox.window.TBM as any;

const strip = (d: Doc) => JSON.parse(JSON.stringify(d, (k, v) => (k === 'id' ? undefined : typeof v === 'string' && v.startsWith('/assets/') ? v.slice(1) : v)));

describe('template registry', () => {
  it('has 202 templates in the INVENTORY.md category counts', () => {
    expect(TEMPLATES).toHaveLength(202);
    const count = (c: string) => TEMPLATES.filter((t) => t.cat === c).length;
    expect(CATS.map(([c]) => count(c))).toEqual([59, 36, 6, 36, 8, 7, 32, 18]);
  });

  it('lists the same template ids, names and sizes as the prototype', () => {
    expect(TEMPLATES.map((t) => [t.id, t.name, t.cat, t.sub, t.sizes])).toEqual(TBM.TEMPLATES.map((t: Record<string, unknown>) => [t.id, t.name, t.cat, t.sub, t.sizes]));
  });

  it.each(TEMPLATES.map((t) => t.id))('builds %s identically to the prototype', (id) => {
    expect(strip(BUILD[id]())).toEqual(strip(TBM.BUILD[id]()));
  });

  it('relayouts every template to each allowed size identically to the prototype', () => {
    for (const t of TEMPLATES) {
      for (const sz of t.sizes.slice(0, 3)) {
        const ours = relayout(BUILD[t.id](), sz), theirs = TBM.relayout(TBM.BUILD[t.id](), sz);
        expect(strip(ours), t.id + ' @ ' + sz).toEqual(strip(theirs));
      }
    }
  });

  it('keeps document page kinds from INVENTORY.md', () => {
    expect(Object.keys(DOCS)).toEqual(['ebook', 'report', 'whitepaper', 'proposal', 'casestudy', 'presentation', 'article', 'newsletter', 'resume']);
    expect(DOCS.ebook.seq).toHaveLength(29);
    expect(Object.keys(DOCS.ebook.kinds)).toHaveLength(31);
  });

  it('creates pages and elements like the prototype', () => {
    const d = BUILD['doc:report:cream'](), d0 = TBM.BUILD['doc:report:cream']();
    expect(pageKinds(d)).toEqual(TBM.pageKinds(d0));
    expect(strip({ ...d, pages: [newPage(d, 'chart')] })).toEqual(strip({ ...d0, pages: [TBM.newPage(d0, 'chart')] }));
    for (const k of ['heading', 'text', 'label', 'cta', 'image', 'shape', 'logo', 'ribbon', 'table', 'chart', 'toc', 'pageno'] as const) {
      const a = strip({ ...d, pages: [{ ...d.pages[0], elements: [newElement(k, d, d.pages[0])] }] });
      const b = strip({ ...d0, pages: [{ ...d0.pages[0], elements: [TBM.newElement(k, d0, d0.pages[0])] }] });
      expect(a, k).toEqual(b);
    }
  });
});

import { contrast, grade } from '@/lib/contrast';
describe('contrast', () => {
  it('matches the ratios stated in the design system readme', () => {
    expect(Math.round(contrast('#3D1D10', '#FFF4DC'))).toBe(14); // cocoa on cream (14:1)
    expect(grade(contrast('#FFFFFF', '#C81F75'))).not.toBe('Fail'); // white on icing-600 (AA)
    expect(contrast('#FFFFFF', '#C81F75')).toBeGreaterThanOrEqual(4.5);
    expect(grade(contrast('#FFFFFF', '#E8358F'))).toBe('AA Large'); // white on icing-500: large text only
    expect(grade(contrast('#E8B323', '#FFF4DC'))).toBe('Fail'); // gold fails on cream
    expect(contrast('#E8B323', '#3D1D10')).toBeGreaterThanOrEqual(7.5); // gold on cocoa (8:1)
  });
});
