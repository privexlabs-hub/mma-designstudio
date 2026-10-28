/* Template registry and document operations (relayout, new page, new element).
   Ported from studio-lib.js. Template definitions live here, separate from user edits. */
import { C, HANDLE, PH } from './brand';
import { AVATARS, CAROUSELS, DOCS, EMAILS, FORMATS, OCCASIONS, PAGE_SIZES, V, WEBS } from './data';
import { CH, I, L, PN, RB, S, T, TB, TH, TOC, avatar, compose, docPage, fitDisplayWords, isDark, nid, stack } from './engine';
import type { CatId, Composed, Doc, DocTypeId, El, ElType, Item, Page, Template, Variant } from './types';

export const TEMPLATES: Template[] = [];
export const BUILD: Record<string, (sizeId?: string) => Doc> = {};
const reg = (t: Template, build: (sizeId?: string) => Doc) => { TEMPLATES.push(t); BUILD[t.id] = build; };
const page = (name: string, bg: string, elements: El[], ex?: Partial<Page>): Page => Object.assign({ id: nid('p'), name, bg, elements, numbered: false }, ex || {});
const graphicDoc = (t: Template, fmt: string, pages: Page[]): Doc => ({ tpl: t.id, name: t.name, cat: t.cat, mode: 'graphic', formatId: fmt, w: FORMATS[fmt].w, h: FORMATS[fmt].h, pages, pageNumbers: { show: false, start: 1 } });
const COMPOSE_FORMATS = Object.keys(FORMATS).filter((f) => FORMATS[f].group !== 'avatar' && FORMATS[f].group !== 'email');
const vpage = (vk: string | Variant, W: number, H: number, nm?: string): Page => { const v = typeof vk === 'string' ? V[vk] : vk; const r = compose(W, H, v); return page(nm || v.name || '', r.bg, r.elements, { spec: vk }); };
const addSet = (cat: CatId, fmt: string, keys: string[], sub?: string) => keys.forEach((vk) => { const t: Template = { id: fmt + ':' + vk, name: V[vk].name, cat, sub: sub || FORMATS[fmt].label, formatId: fmt, sizes: COMPOSE_FORMATS }; reg(t, (f) => { f = f || fmt; return graphicDoc(t, f, [vpage(vk, FORMATS[f].w, FORMATS[f].h)]); }); });

addSet('social', 'square', ['announce', 'product', 'update', 'launch', 'testimonial', 'educational', 'statistic', 'promo', 'cta', 'menu', 'founder', 'celebration', 'comparison', 'bts', 'seasonal', 'notice']);
addSet('social', 'engage', ['poll', 'thisorthat', 'question', 'fillblank', 'captionthis', 'spotlight', 'rateit']);
addSet('social', 'portrait', ['product', 'promo', 'educational', 'celebration', 'testimonial', 'statistic', 'launch', 'founder', 'comparison', 'announce', 'update', 'spotlight']);
addSet('social', 'story', ['announce', 'product', 'countdown', 'poll', 'question', 'testimonial', 'bts', 'steps', 'launch', 'cta', 'update', 'celebration']);
addSet('social', 'ytthumb', ['process', 'reveal', 'comparison', 'tutorial', 'vlog', 'bts']);

/* Platform posts — the Square post design set on each platform's feed formats. The handle line uses
   that platform's account from the supplied flyer; X has no known account, so it stays [to confirm]. */
const POST_SET = ['announce', 'product', 'update', 'launch', 'testimonial', 'educational', 'statistic', 'promo', 'cta', 'menu', 'founder', 'celebration', 'comparison', 'bts', 'seasonal', 'notice'];
const withHandle = (v: Variant, handle: string): Variant => ({ ...v, items: v.items.map((i) => i[0] === 'handle' && i[1] === HANDLE ? (['handle', handle] as Item) : i) });
const PLATFORM_FORMATS: [string, string | null][] = [['igpost', null], ['igsquare', null], ['xpost', '[X handle to confirm]'], ['xsquare', '[X handle to confirm]'], ['fbpost', 'Facebook · Eze Chinwendu'], ['fblandscape', 'Facebook · Eze Chinwendu'], ['tiktok', 'TikTok @.mmacakeandpastry']];
PLATFORM_FORMATS.forEach(([fmt, handle]) => POST_SET.forEach((vk) => {
  const F0 = FORMATS[fmt]; const t: Template = { id: fmt + ':' + vk, name: V[vk].name, cat: 'platform', sub: F0.label + ' · ' + F0.w + ' × ' + F0.h, formatId: fmt, sizes: COMPOSE_FORMATS };
  const spec: string | Variant = handle ? withHandle(V[vk], handle) : vk;
  reg(t, (f) => { f = f || fmt; const pg = vpage(spec, FORMATS[f].w, FORMATS[f].h); fitDisplayWords(pg.elements); return graphicDoc(t, f, [pg]); });
}));
Object.keys(CAROUSELS).forEach((ck) => {
  const cs = CAROUSELS[ck]; const t: Template = { id: 'carousel:' + ck, name: cs.name, cat: 'social', sub: 'Carousel · ' + cs.pages.length + ' slides · 1080 × 1080', formatId: 'carousel', sizes: ['carousel', 'portrait', 'square'], multi: 1 };
  reg(t, (f) => { f = f || 'carousel'; const { w, h } = FORMATS[f]; return graphicDoc(t, f, cs.pages.map(([nm, v]) => vpage(v, w, h, nm))); });
});
/* Celebrations & observances — every occasion on the platform formats plus Story. Occasion designs
   are also added to V so they can be inserted as pages ("Page type to add") and re-laid out. */
OCCASIONS.forEach((o) => { V[o.key] = o.v; });
OCCASIONS.forEach((o) => ([...PLATFORM_FORMATS, ['story', null]] as [string, string | null][]).forEach(([fmt, handle]) => {
  const F0 = FORMATS[fmt]; const t: Template = { id: fmt + ':' + o.key, name: o.v.name, cat: 'celebrations', sub: o.group + ' · ' + F0.label + ' · ' + F0.w + ' × ' + F0.h, formatId: fmt, sizes: COMPOSE_FORMATS };
  const spec: string | Variant = handle ? withHandle(o.v, handle) : o.key;
  reg(t, (f) => { f = f || fmt; const pg = vpage(spec, FORMATS[f].w, FORMATS[f].h); fitDisplayWords(pg.elements); return graphicDoc(t, f, [pg]); });
}));
['xheader', 'licover', 'licompany', 'fbcover', 'fbevent', 'ytbanner', 'twitch', 'podcast', 'nlheader', 'webbanner', 'eventbanner', 'community'].forEach((f) => addSet('banners', f, ['brand', 'promo', 'event']));
Object.keys(AVATARS).forEach((ak) => { const t: Template = { id: 'avatar:' + ak, name: AVATARS[ak].name, cat: 'avatars', sub: 'Avatar · 400 × 400', formatId: 'avatar', sizes: ['avatar'] }; reg(t, () => { const r = avatar(400, 400, AVATARS[ak]); return graphicDoc(t, 'avatar', [page(t.name, r.bg, r.elements, { spec: ak })]); }); });
['adsq', 'adpt', 'adst', 'adlink', 'admrec', 'adleader', 'adsky', 'adbill', 'admob'].forEach((f) => addSet('ads', f, ['adproduct', 'adoffer', 'adcake', 'adplatter']));
Object.keys(EMAILS).forEach((ek) => {
  const e = EMAILS[ek]; const t: Template = { id: 'email:' + ek, name: e.name, cat: 'email', sub: 'Email · 600 px wide', formatId: 'email', sizes: ['email'] };
  reg(t, () => { const H = 1400, th = TH[e.theme || 'white'], els: El[] = []; stack(els, { x: 40, y: 40, w: 520, h: H - 80 }, e.items, th, 20, { valign: 'top', logo: 110 }); return graphicDoc(t, 'email', [page(e.name, th.bg, els)]); });
});
Object.keys(WEBS).forEach((wk) => {
  const wb = WEBS[wk]; const t: Template = { id: 'web:' + wk, name: wb.name, cat: 'web', sub: FORMATS[wb.fmt].label + ' · ' + FORMATS[wb.fmt].w + ' × ' + FORMATS[wb.fmt].h, formatId: wb.fmt, sizes: wb.v ? ['webhero', 'websection', 'webmobile', 'web404'] : [wb.fmt] };
  reg(t, (f) => {
    f = f || wb.fmt; const { w, h } = FORMATS[f]; if (wb.v) { const r = compose(w, h, wb.v); return graphicDoc(t, f, [page(wb.name, r.bg, r.elements, { spec: wb.v })]); }
    const els: El[] = [], m = Math.round(w * 0.06); stack(els, { x: m, y: m, w: w - 2 * m, h: h - 2 * m }, wb.stackItems || [], TH.white, 22, { valign: 'top', align: 'left' }); return graphicDoc(t, f, [page(wb.name, C.cream0, els)]);
  });
});
['xarticle', 'liarticle', 'lipost', 'medium', 'articlehero', 'blogpromo', 'nlpromo', 'pinterest'].forEach((f) => addSet('editorial', f, ['edcocoa', 'edcream', 'edphoto', 'edtype']));
(Object.keys(DOCS) as DocTypeId[]).forEach((dt) => {
  const D = DOCS[dt]; ([['cream', 'Cream edition'], ['cocoa', 'Cocoa edition']] as const).forEach(([ed, en]) => {
    const t: Template = { id: 'doc:' + dt + ':' + ed, name: D.label + ' · ' + en, cat: 'documents', sub: D.seq.length + ' pages · ' + PAGE_SIZES[D.size].label, docType: dt, edition: ed, sizes: D.slides ? ['slide169', 'slide43'] : ['a4', 'letter', 'a5', 'ebook'] };
    reg(t, (sz) => {
      sz = sz || D.size; const { w, h } = PAGE_SIZES[sz]; let ch = 0;
      const pages = D.seq.map((kid) => {
        const pg = docPage(dt, kid, w, h, ed); const k = D.kinds[kid]; let nm = k.label;
        if (kid === 'chapter') { ch++; nm = 'Chapter ' + ch; pg.elements.forEach((e) => { if (e.key === 'label') e.text = 'Chapter ' + ch; }); }
        return page(nm, pg.bg, pg.elements, { kind: kid, numbered: k.numbered !== false, toc: !!k.toc });
      });
      const rows = pages.map((p, i) => { if (!p.toc) return null; const hd = p.elements.find((e) => e.key === 'title') || p.elements.find((e) => e.key === 'heading'); const lab = p.elements.find((e) => e.key === 'label'); let tt = ((hd && hd.text) || p.name).replace(/\n/g, ' '); if (lab && /^(chapter|part|section)/i.test(lab.text || '')) tt = lab.text + ' — ' + tt; return tt + '|' + (i + 1); }).filter(Boolean);
      pages.forEach((p) => p.elements.forEach((e) => { if (e.type === 'toc') e.text = rows.join('\n'); }));
      return { tpl: t.id, name: t.name, cat: 'documents', mode: 'doc', docType: dt, edition: ed, formatId: sz, w, h, pages, pageNumbers: { show: true, start: 1 } };
    });
  });
});

/** Post-prototype templates get display-word fitting; the prototype's own 202 are left as designed. */
const FITTED_CATS: CatId[] = ['platform', 'celebrations'];
const OCCASION_KEYS = new Set(OCCASIONS.map((o) => o.key));
export const CATS: [CatId, string][] = [['social', 'Social posts'], ['platform', 'Platform posts'], ['celebrations', 'Celebrations'], ['banners', 'Banners & covers'], ['avatars', 'Avatars'], ['ads', 'Advertising'], ['email', 'Email'], ['web', 'Web'], ['editorial', 'Article & editorial'], ['documents', 'Documents']];
export const ELEMENT_KINDS: Record<ElType, string> = { text: 'Text', image: 'Image', shape: 'Shape', logo: 'Logo / mark', ribbon: 'Ribbon rule', table: 'Table', toc: 'Contents list', chart: 'Bar chart', pageno: 'Page number' };

/* rebuild a single page from its kind/spec at new size, preserving content by key */
export function relayout(doc: Doc, sizeId: string): Doc {
  const nd = BUILD[doc.tpl](sizeId); const out: Doc = JSON.parse(JSON.stringify(doc)); out.formatId = nd.formatId; out.w = nd.w; out.h = nd.h;
  const sx = nd.w / doc.w, sy = nd.h / doc.h;
  out.pages = doc.pages.map((pg, i) => {
    let fresh: Composed | null = null;
    if (doc.mode === 'doc' && pg.kind && doc.docType) fresh = docPage(doc.docType, pg.kind, nd.w, nd.h, doc.edition);
    else if (typeof pg.spec === 'string' && V[pg.spec]) fresh = compose(nd.w, nd.h, V[pg.spec]);
    else if (pg.spec && typeof pg.spec === 'object') fresh = compose(nd.w, nd.h, pg.spec);
    else if (nd.pages[i]) fresh = { bg: nd.pages[i].bg, elements: nd.pages[i].elements };
    const scaled = (e: El): El => Object.assign({}, e, { id: nid(), x: Math.round(e.x * sx), y: Math.round(e.y * sy), w: Math.round(e.w * sx), h: Math.round(e.h * sy), size: e.size ? Math.round(e.size * Math.sqrt(sx * sy)) : e.size });
    if (!fresh) return Object.assign({}, pg, { elements: pg.elements.map(scaled) });
    const used: Record<string, number> = {};
    const els = fresh.elements.map((fe) => {
      const old = pg.elements.find((e) => e.key === fe.key && !used[e.id]); if (!old) return fe; used[old.id] = 1;
      return Object.assign(fe, { text: old.text !== undefined ? old.text : fe.text, src: old.src !== undefined ? old.src : fe.src, color: old.color || fe.color, bg: old.bg !== undefined ? old.bg : fe.bg, fill: old.fill || fe.fill, font: old.font || fe.font, align: old.align || fe.align, weight: old.weight || fe.weight, variant: old.variant || fe.variant });
    });
    pg.elements.forEach((e) => { if (!used[e.id] && e.user) els.push(scaled(e)); });
    return Object.assign({}, pg, { bg: pg.bg, elements: els });
  });
  if (FITTED_CATS.includes(doc.cat)) out.pages.forEach((pg) => fitDisplayWords(pg.elements));
  return out;
}
export function newPage(doc: Doc, kindId: string): Page {
  if (doc.mode === 'doc' && doc.docType) { const D = DOCS[doc.docType], k = D.kinds[kindId]; const pg = docPage(doc.docType, kindId, doc.w, doc.h, doc.edition); return page(k.label, pg.bg, pg.elements, { kind: kindId, numbered: k.numbered !== false, toc: !!k.toc }); }
  const r = compose(doc.w, doc.h, V[kindId] || V.announce); if (FITTED_CATS.includes(doc.cat) || OCCASION_KEYS.has(kindId)) fitDisplayWords(r.elements);
  return page((V[kindId] || V.announce).name, r.bg, r.elements, { spec: kindId });
}
export function pageKinds(doc: Doc): [string, string][] {
  if (doc.mode === 'doc' && doc.docType) { const ks = DOCS[doc.docType].kinds; return Object.keys(ks).map((k) => [k, ks[k].label]); }
  if (doc.formatId === 'avatar' || doc.formatId === 'email') return [];
  return Object.keys(V).map((k) => [k, V[k].name]);
}
export type AddKind = 'heading' | 'text' | 'label' | 'cta' | 'image' | 'shape' | 'logo' | 'ribbon' | 'table' | 'chart' | 'toc' | 'pageno';
export function newElement(type: AddKind, doc: Doc, pg: Page): El { const el = newElement0(type, doc, pg); el.user = true; return el; }
function newElement0(type: AddKind, doc: Doc, pg: Page): El {
  const R = Math.round, W = doc.w, H = doc.h, s = Math.max(14, R(Math.sqrt(W * H) * 0.03)), dark = isDark(pg.bg), fg = dark ? C.cream : C.cocoa;
  const cx = (w: number) => R((W - w) / 2), cy = (h: number) => R((H - h) / 2);
  switch (type) {
    case 'heading': return T('heading', 'New heading', { x: cx(W * 0.7), y: cy(s * 2), w: R(W * 0.7), h: R(s * 2.4), size: R(s * 1.8), font: 'display', color: fg, lh: 1.1 });
    case 'text': return T('body', 'New paragraph. Click to edit in the panel.', { x: cx(W * 0.6), y: cy(s * 4), w: R(W * 0.6), h: R(s * 4), size: R(s * 0.7), color: fg, lh: 1.55 });
    case 'label': return T('label', 'Label', { x: cx(W * 0.4), y: cy(s), w: R(W * 0.4), h: R(s * 1.1), size: R(s * 0.5), weight: 800, upper: true, ls: 0.12, color: dark ? C.gold4 : C.pink7 });
    case 'cta': return T('cta', 'Order on WhatsApp', { x: cx(s * 10), y: cy(s * 2), w: R(s * 10), h: R(s * 2.2), size: R(s * 0.7), weight: 700, color: C.white, bg: C.pink6, radius: 999, align: 'center', valign: 'center', lh: 1.1 });
    case 'image': return I('img', PH.cake, { x: cx(W * 0.4), y: cy(H * 0.4), w: R(W * 0.4), h: R(H * 0.4), frame: 'round', radius: R(s * 0.6) });
    case 'shape': return S('shape', { x: cx(W * 0.3), y: cy(H * 0.2), w: R(W * 0.3), h: R(H * 0.2), fill: dark ? C.cocoa7 : C.gold1, radius: R(s * 0.6) });
    case 'logo': { const z = R(Math.min(W, H) * 0.18); return L('logo', { x: cx(z), y: cy(z), w: z, h: z, radius: R(z * 0.18) }); }
    case 'ribbon': return RB('ribbon', { x: cx(W * 0.4), y: cy(s), w: R(W * 0.4), h: R(s * 0.9), color: dark ? C.gold : C.pink });
    case 'table': return TB('table', 'Column | Column\n[Value] | [Value]\n[Value] | [Value]', { x: cx(W * 0.7), y: cy(H * 0.25), w: R(W * 0.7), h: R(H * 0.25), size: R(s * 0.6), color: fg, head: fg, line: dark ? C.cocoa7 : C.gold3 });
    case 'chart': return CH('chart', '[Label]: 60\n[Label]: 40\n[Label]: 20', { x: cx(W * 0.7), y: cy(H * 0.25), w: R(W * 0.7), h: R(H * 0.25), size: R(s * 0.6), color: fg, track: dark ? C.cocoa7 : C.pink1 });
    case 'toc': return TOC('toc', 'Entry|1', { x: cx(W * 0.7), y: cy(H * 0.3), w: R(W * 0.7), h: R(H * 0.3), size: R(s * 0.6), color: fg });
    case 'pageno': return PN({ x: cx(W * 0.3), y: H - R(s * 2), w: R(W * 0.3), h: R(s), size: R(s * 0.5), color: dark ? C.cocoa1 : C.cocoa7 });
  }
}

/** Prototype files stored asset paths relative to the HTML file (`assets/...`). Make them root-relative. */
export function normalizeDoc(d: Doc): Doc {
  const fix = (s?: string) => (s && s.startsWith('assets/') ? '/' + s : s);
  d.pages.forEach((p) => p.elements.forEach((e) => { if (e.src) e.src = fix(e.src); }));
  return d;
}

export { FORMATS, PAGE_SIZES, DOCS, V };
export { docPage, compose, isDark, nid, slug } from './engine';
