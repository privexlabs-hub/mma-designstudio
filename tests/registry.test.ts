import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';
import { BUILD, CATS, DOCS, TEMPLATES, pageKinds, relayout, newPage, newElement } from '@/lib/studio';
import { OCCASIONS } from '@/lib/studio/data';
import type { Doc } from '@/lib/studio';

/* Load the original prototype library (window.TBM) for parity checks. */
const src = fs.readFileSync(path.join(__dirname, '../reference/prototype/studio-lib.js'), 'utf8');
const sandbox: { window: Record<string, unknown> } = { window: {} };
vm.runInNewContext(src, sandbox);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TBM = sandbox.window.TBM as any;

const strip = (d: Doc) => JSON.parse(JSON.stringify(d, (k, v) => (k === 'id' ? undefined : typeof v === 'string' && v.startsWith('/assets/') ? v.slice(1) : v)));

describe('template registry', () => {
  const ORIGINAL = TEMPLATES.filter((t) => t.cat !== 'platform' && t.cat !== 'celebrations');
  const PLATFORM = TEMPLATES.filter((t) => t.cat === 'platform');

  it('keeps the prototype’s 202 templates in the INVENTORY.md category counts', () => {
    expect(ORIGINAL).toHaveLength(202);
    const count = (c: string) => ORIGINAL.filter((t) => t.cat === c).length;
    expect(CATS.filter(([c]) => c !== 'platform' && c !== 'celebrations').map(([c]) => count(c))).toEqual([59, 36, 6, 36, 8, 7, 32, 18]);
  });

  it('lists the same template ids, names and subtitles as the prototype; sizes extend the prototype’s list', () => {
    expect(ORIGINAL.map((t) => [t.id, t.name, t.cat, t.sub])).toEqual(TBM.TEMPLATES.map((t: Record<string, unknown>) => [t.id, t.name, t.cat, t.sub]));
    ORIGINAL.forEach((t, i) => { const theirs = TBM.TEMPLATES[i].sizes as string[]; expect(t.sizes.slice(0, theirs.length), t.id).toEqual(theirs); });
  });

  it.each(ORIGINAL.map((t) => t.id))('builds %s identically to the prototype', (id) => {
    expect(strip(BUILD[id]())).toEqual(strip(TBM.BUILD[id]()));
  });

  it('relayouts every template to each allowed size identically to the prototype', () => {
    for (const t of ORIGINAL) {
      for (const sz of t.sizes.slice(0, 3)) {
        const ours = relayout(BUILD[t.id](), sz), theirs = TBM.relayout(TBM.BUILD[t.id](), sz);
        expect(strip(ours), t.id + ' @ ' + sz).toEqual(strip(theirs));
      }
    }
  });

  it('adds the 16-design post set on 7 platform formats', () => {
    expect(PLATFORM).toHaveLength(112);
    const dims: Record<string, [number, number]> = { igpost: [1080, 1440], igsquare: [1080, 1080], xpost: [1600, 900], xsquare: [1080, 1080], fbpost: [1080, 1350], fblandscape: [1200, 630], tiktok: [1080, 1920] };
    for (const [fmt, [w, h]] of Object.entries(dims)) {
      const set = PLATFORM.filter((t) => t.formatId === fmt);
      expect(set.map((t) => t.name), fmt).toEqual(TEMPLATES.filter((t) => t.formatId === 'square').map((t) => t.name));
      for (const t of set) {
        const d = BUILD[t.id]();
        expect([d.w, d.h], t.id).toEqual([w, h]);
        expect(d.cat).toBe('platform');
        for (const e of d.pages[0].elements) {
          expect(e.x >= 0 && e.y >= 0 && e.x + e.w <= w + 1 && e.y + e.h <= h + 1, t.id + ' ' + e.key + ' inside the page').toBe(true);
          expect(e.w > 0 && e.h > 0, t.id + ' ' + e.key + ' has size').toBe(true);
        }
      }
    }
  });

  it('uses each platform’s handle from the flyer (X stays [to confirm])', () => {
    const handle = (id: string) => BUILD[id]().pages[0].elements.find((e) => e.key === 'handle')?.text;
    expect(handle('igpost:educational')).toBe('@treats_by_mma');
    expect(handle('tiktok:educational')).toBe('TikTok @.mmacakeandpastry');
    expect(handle('fbpost:educational')).toBe('Facebook · Eze Chinwendu');
    expect(handle('xpost:educational')).toBe('[X handle to confirm]');
    expect(handle('xpost:cta')).toBe('0813 107 7321'); // non-handle lines are untouched
  });

  it('resizes platform posts between formats, keeping edits', () => {
    const d = BUILD['tiktok:announce'](); d.pages[0].elements.find((e) => e.key === 'title')!.text = 'Edited title';
    const r = relayout(d, 'xpost');
    expect([r.w, r.h]).toEqual([1600, 900]);
    expect(r.pages[0].elements.find((e) => e.key === 'title')?.text).toBe('Edited title');
  });

  describe('celebrations & observances', () => {
    const CEL = TEMPLATES.filter((t) => t.cat === 'celebrations');
    const FMTS = ['igpost', 'igsquare', 'xpost', 'xsquare', 'fbpost', 'fblandscape', 'tiktok', 'story'];
    it('has 39 occasions on 8 formats', () => {
      expect(OCCASIONS).toHaveLength(39);
      expect(CEL).toHaveLength(312);
      for (const o of OCCASIONS) expect(CEL.filter((t) => t.id.endsWith(':' + o.key)).map((t) => t.formatId), o.key).toEqual(FMTS);
      const groups = (g: string) => OCCASIONS.filter((o) => o.group === g).length;
      expect([groups('New month'), groups('Christian'), groups('Muslim'), groups('National day'), groups('International day')]).toEqual([12, 9, 7, 4, 7]);
    });
    it('lays every occasion out inside the page on every format', () => {
      for (const t of CEL) {
        const d = BUILD[t.id]();
        for (const e of d.pages[0].elements) expect(e.x >= 0 && e.y >= 0 && e.x + e.w <= d.w + 1 && e.y + e.h <= d.h + 1 && e.w > 0 && e.h > 0, t.id + ' ' + e.key).toBe(true);
      }
    });
    it('uses platform handles and keeps titles', () => {
      const el = (id: string, k: string) => BUILD[id]().pages[0].elements.find((e) => e.key === k)?.text;
      expect(el('tiktok:christmas', 'title')).toBe('Merry Christmas');
      expect(el('tiktok:christmas', 'handle')).toBe('TikTok @.mmacakeandpastry');
      expect(el('story:eidfitr', 'handle')).toBe('@treats_by_mma');
      expect(el('xpost:eidfitr', 'handle')).toBe('[X handle to confirm]');
      expect(el('igpost:eidadha', 'label')).toBe('Barka da Sallah · Eid al-Adha');
      expect(el('igsquare:newmonth-march', 'title')).toBe('Hello, March');
    });
    it('follows the copy rules: fixed dates shown, no prices or offers, solemn days not “happy”', () => {
      const all = OCCASIONS.map((o) => JSON.stringify(o.v.items)).join(' ');
      expect(all).not.toMatch(/₦|price|%|discount|free/i);
      const lab = (k: string) => OCCASIONS.find((o) => o.key === k)!.v.items.find((i) => i[0] === 'label')![1];
      expect([lab('newyear'), lab('valentine'), lab('workersday'), lab('childrensday'), lab('democracyday'), lab('independence')]).toEqual(['January 1', 'February 14', 'May 1', 'May 27', 'June 12', 'October 1']);
      const title = (k: string) => OCCASIONS.find((o) => o.key === k)!.v.items.find((i) => i[0] === 'title')![1] as string;
      expect(title('goodfriday')).not.toMatch(/happy/i);
      for (const k of ['ramadan', 'eidfitr', 'eidadha', 'islamicnewyear', 'maulud', 'laylatalqadr']) expect(JSON.stringify(OCCASIONS.find((o) => o.key === k)!.v.items), k).not.toMatch(/\b(19|20)\d\d\b|January|February|March|April|June|July|August|September|October|November|December/);
    });
    it('can be inserted as a page in any graphic document', () => {
      const d = BUILD['square:announce']();
      expect(pageKinds(d).some(([k]) => k === 'christmas')).toBe(true);
      expect(newPage(d, 'ramadan').elements.find((e) => e.key === 'title')?.text).toBe('Ramadan Kareem');
    });
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

import { displayWidth } from '@/lib/studio/metrics';
describe('display-word fitting (post-prototype templates)', () => {
  it('no Caprasimo word is wider than its box on platform or celebration templates, at any platform size', () => {
    const fmts = ['igpost', 'igsquare', 'xpost', 'xsquare', 'fbpost', 'fblandscape', 'tiktok', 'story'];
    for (const t of TEMPLATES.filter((x) => x.cat === 'platform' || x.cat === 'celebrations')) {
      const docs = [BUILD[t.id](), ...fmts.filter((f) => f !== t.formatId).slice(0, 2).map((f) => relayout(BUILD[t.id](), f))];
      for (const d of docs) for (const e of d.pages[0].elements) {
        if (e.type !== 'text' || e.font !== 'display' || !e.text) continue;
        for (const w of e.text.split(/\s+/).filter(Boolean)) expect(displayWidth(w, e.size!, e.ls || 0) <= e.w - 2 * (e.pad || 0), `${t.id} @ ${d.formatId} "${w}"`).toBe(true);
      }
    }
  });
});

import { outputSize, safeRatio } from '@/lib/export';
describe('phone export guard', () => {
  const story = BUILD['story:announce'](), yt = BUILD['ytbanner:brand']();
  it('caps exports under the iPhone canvas limit (16 MP)', () => {
    for (const d of [story, yt]) for (const m of [1, 2, 3]) { const o = outputSize(d, m, 16_000_000); expect(o.w * o.h, d.formatId + ' ' + m + '×').toBeLessThanOrEqual(16_000_000); }
    expect(outputSize(story, 3, 16_000_000).capped).toBe(true);
    expect(outputSize(story, 1, 16_000_000)).toEqual({ w: 1080, h: 1920, capped: false });
  });
  it('leaves sizes that fit untouched', () => {
    expect(safeRatio(story, 2, 16_000_000)).toBe(2);
    expect(safeRatio(BUILD['admrec:adproduct'](), 2, 16_000_000)).toBe(2); // 300×250 exports at 600 px wide → 2× base
  });
});
