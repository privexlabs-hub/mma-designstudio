/* Layout engine — element factories, text metrics, the stack engine and the graphic / document
   composers. Ported line-for-line from studio-lib.js; behaviour must stay identical so templates
   render the same as the prototype. */
import { C, PH } from './brand';
import type {
  AvatarSpec, Block, Card, Composed, DocTypeId, Edition, El, Item, ItemOpt, Rect, Theme, ThemeId, Variant,
} from './types';
import { DOCS, it } from './data';

let uid = 0;
export const nid = (p?: string): string => (p || 'e') + Date.now().toString(36).slice(-4) + (uid++).toString(36);
export const clamp = (v: number, a: number, b: number): number => Math.max(a, Math.min(b, v));
const R = Math.round;

type Opts = Partial<El>;
export const T = (key: string, text: string, o?: Opts): El => Object.assign({ id: nid(), key, type: 'text', text, font: 'body', size: 16, weight: 400, color: C.cocoa, align: 'left', lh: 1.4, ls: 0, upper: false, italic: false, bg: '', radius: 0, pad: 0, valign: 'top', opacity: 1, x: 0, y: 0, w: 100, h: 40 } as El, o);
export const I = (key: string, src: string, o?: Opts): El => Object.assign({ id: nid(), key, type: 'image', src, fit: 'cover', frame: 'none', ring: '', scrim: false, radius: 0, opacity: 1, x: 0, y: 0, w: 100, h: 100 } as El, o);
export const S = (key: string, o?: Opts): El => Object.assign({ id: nid(), key, type: 'shape', fill: C.gold1, radius: 0, stroke: '', strokeW: 0, opacity: 1, x: 0, y: 0, w: 100, h: 100 } as El, o);
export const L = (key: string, o?: Opts): El => Object.assign({ id: nid(), key, type: 'logo', variant: 'full', tile: C.cream, radius: 12, opacity: 1, x: 0, y: 0, w: 100, h: 100 } as El, o);
export const RB = (key: string, o?: Opts): El => Object.assign({ id: nid(), key, type: 'ribbon', color: C.pink, opacity: 1, x: 0, y: 0, w: 200, h: 20 } as El, o);
export const TB = (key: string, text: string, o?: Opts): El => Object.assign({ id: nid(), key, type: 'table', text, font: 'body', size: 15, color: C.cocoa, head: C.cocoa, line: C.gold3, opacity: 1, x: 0, y: 0, w: 300, h: 200 } as El, o);
export const TOC = (key: string, text: string, o?: Opts): El => Object.assign({ id: nid(), key, type: 'toc', text, font: 'body', size: 16, color: C.cocoa, opacity: 1, x: 0, y: 0, w: 300, h: 300 } as El, o);
export const CH = (key: string, text: string, o?: Opts): El => Object.assign({ id: nid(), key, type: 'chart', text, font: 'body', size: 15, color: C.cocoa, bar: C.pink6, track: C.pink1, opacity: 1, x: 0, y: 0, w: 300, h: 200 } as El, o);
export const PN = (o?: Opts): El => Object.assign({ id: nid(), key: 'pageno', type: 'pageno', text: '{n}', font: 'body', size: 12, weight: 600, color: C.cocoa7, align: 'center', lh: 1, ls: 0.08, upper: false, italic: false, bg: '', radius: 0, pad: 0, valign: 'center', opacity: 1, x: 0, y: 0, w: 100, h: 20 } as El, o);

export const TH: Record<ThemeId, Theme> = {
  cream: { bg: C.cream, title: C.cocoa, fg: C.cocoa, muted: C.cocoa7, label: C.pink7, ctaBg: C.pink6, ctaFg: C.white, card: C.cream0, cardFg: C.cocoa, stat: C.pink6, rib: C.pink, tile: C.cream0, line: C.gold3 },
  white: { bg: C.cream0, title: C.cocoa, fg: C.cocoa, muted: C.cocoa7, label: C.pink7, ctaBg: C.pink6, ctaFg: C.white, card: C.cream, cardFg: C.cocoa, stat: C.pink6, rib: C.pink, tile: C.cream, line: C.gold3 },
  cocoa: { bg: C.cocoa, title: C.cream, fg: C.cream, muted: C.cocoa1, label: C.gold4, ctaBg: C.pink6, ctaFg: C.white, card: C.cocoa7, cardFg: C.cream, stat: C.gold4, rib: C.gold, tile: C.cream, line: C.cocoa7 },
  photo: { bg: C.cocoa, title: C.cream, fg: C.cream, muted: C.cream, label: C.gold4, ctaBg: C.pink6, ctaFg: C.white, card: C.cocoa7, cardFg: C.cream, stat: C.gold4, rib: C.gold, tile: C.cream, line: C.cocoa7 },
};

export function lines(text: string | undefined, size: number, w: number, font: string): number {
  const cw = size * (font === 'display' ? 0.6 : 0.52); const cpl = Math.max(1, Math.floor(w / cw));
  return String(text || ' ').split('\n').reduce((n, p) => {
    let ln = 1, cur = 0;
    for (const wd of p.split(/\s+/).filter(Boolean)) {
      if (wd.length > cpl) { if (font === 'display') return n + 999; ln += Math.ceil(wd.length / cpl); cur = 0; continue; }
      if (cur && cur + 1 + wd.length > cpl) { ln++; cur = wd.length; } else cur += (cur ? 1 : 0) + wd.length;
    }
    return n + ln;
  }, 0);
}
export function fit(text: string, w: number, maxH: number, max: number, min: number, font: string, lh: number): number {
  for (let s = R(max); s >= min; s -= 1) if (lines(text, s, w, font) * s * lh <= maxH) return s;
  return min;
}

export interface StackOpts {
  valign?: 'top' | 'center' | 'bottom'; align?: 'left' | 'center'; gap?: number; justify?: boolean; logo?: number; mark?: boolean;
  subScale?: number; listScale?: number; headScale?: number; titleMax?: number; quoteMax?: number; bodyScale?: number; base?: number;
}
interface Spec { it: Item; h: number; flex: number; mk: (y: number) => El[] }

const FLEX: Record<string, number> = { title: 1, quote: 1, stat: 1, bodyfill: 3, img: 1.4, table: 2, chart: 2, toc: 3, cols: 2, cards: 2, blocks: 4, gallery: 2, box: 1 };
const isOpt = (x: unknown): x is ItemOpt => !!x && typeof x === 'object' && !Array.isArray(x);
const str = (x: unknown): string => x as string;

/* ---------- stack engine: lays items into a region top→bottom ---------- */
export function stack(els: El[], r: Rect, items: Item[], th: Theme, base: number, o?: StackOpts): El[] {
  o = o || {}; const valign = o.valign || 'center', align = o.align || 'left', gap = o.gap || base * 0.8;
  const tAlign = align === 'center' ? 'center' : 'left', just = o.justify ? 'justify' : tAlign;
  const ax = (w: number) => align === 'center' ? r.x + (r.w - w) / 2 : r.x;
  const lg = o.logo || clamp(Math.min(r.w, r.h) * 0.22, 36, 190);
  const specs: Spec[] = [];
  const noop = (): El[] => [];
  items.forEach((it) => {
    const [k, a0, b0] = it; const a = str(a0), b = str(b0); let s: number, h = 0, flex = 0, mk: (y: number) => El[] = noop;
    switch (k) {
      case 'logo': h = lg; mk = (y) => [L('logo', { x: ax(lg), y, w: lg, h: lg, tile: th.tile, radius: R(lg * 0.18), variant: o.mark ? 'mark' : 'full' })]; break;
      case 'label': s = R(base * 0.72); h = lines(a, s, r.w, 'body') * s * 1.4; { const s1 = s, h1 = h; mk = (y) => [T('label', a, { x: r.x, y, w: r.w, h: h1, size: s1, weight: 800, upper: true, ls: 0.12, color: th.label, align: tAlign, lh: 1.4 })]; } break;
      case 'meta': s = R(base * 0.78); h = lines(a, s, r.w, 'body') * s * 1.45; { const s1 = s, h1 = h; mk = (y) => [T(str(it[3]) || 'meta', a, { x: r.x, y, w: r.w, h: h1, size: s1, weight: 600, color: th.muted, align: tAlign, lh: 1.45 })]; } break;
      case 'handle': s = R(base * 0.78); h = s * 1.5; { const s1 = s, h1 = h; mk = (y) => [T('handle', a, { x: r.x, y, w: r.w, h: h1, size: s1, weight: 700, color: th.muted, align: tAlign })]; } break;
      case 'author': s = R(base * 0.9); h = lines(a, s, r.w, 'body') * s * 1.4; { const s1 = s, h1 = h; mk = (y) => [T('author', a, { x: r.x, y, w: r.w, h: h1, size: s1, weight: 700, color: th.fg, align: tAlign })]; } break;
      case 'sub': s = R(base * (o.subScale || 1.1)); h = lines(a, s, r.w, 'body') * s * 1.38; { const s1 = s, h1 = h; mk = (y) => [T('sub', a, { x: r.x, y, w: r.w, h: h1, size: s1, weight: 500, color: th.fg, align: tAlign, lh: 1.38 })]; } break;
      case 'body': s = R(base * 0.95); h = lines(a, s, r.w, 'body') * s * 1.55; { const s1 = s, h1 = h; mk = (y) => [T(str(it[3]) || 'body', a, { x: r.x, y, w: r.w, h: h1, size: s1, color: th.fg, align: just, lh: 1.55 })]; } break;
      case 'list': s = R(base * (o.listScale || 0.95)); { const t = a.split('\n').map((l) => '•  ' + l).join('\n'); h = lines(t, s, r.w, 'body') * s * 1.7; const s1 = s, h1 = h; mk = (y) => [T('list', t, { x: r.x, y, w: r.w, h: h1, size: s1, weight: 500, color: th.fg, align: 'left', lh: 1.7 })]; } break;
      case 'heading': s = R(base * (o.headScale || 1.9)); h = lines(a, s, r.w, 'display') * s * 1.12; { const s1 = s, h1 = h; mk = (y) => [T('heading', a, { x: r.x, y, w: r.w, h: h1, size: s1, font: 'display', color: th.title, align: tAlign, lh: 1.12 })]; } break;
      case 'h3': s = R(base * 1.15); h = lines(a, s, r.w, 'body') * s * 1.3; { const s1 = s, h1 = h; mk = (y) => [T('h3', a, { x: r.x, y, w: r.w, h: h1, size: s1, weight: 700, color: th.title, align: tAlign, lh: 1.3 })]; } break;
      case 'cta': s = R(base * 0.9); { const s1 = s; const w = Math.min(r.w, a.length * s1 * 0.56 + s1 * 3); h = R(s1 * 2.8); const h1 = h; mk = (y) => [T('cta', a, { x: ax(w), y, w, h: h1, size: s1, weight: 700, color: th.ctaFg, bg: th.ctaBg, radius: 999, align: 'center', valign: 'center', lh: 1.1 })]; } break;
      case 'ribbon': h = base * 1.2; { const w = Math.min(r.w, base * 12), h1 = h; mk = (y) => [RB('ribbon', { x: ax(w), y, w, h: h1, color: th.rib })]; } break;
      case 'quotemark': s = R(base * 4); h = s * 0.62; { const s1 = s; mk = (y) => [T('quotemark', '“', { x: r.x, y: y - s1 * 0.12, w: r.w, h: s1 * 0.9, size: s1, font: 'display', color: th.stat, align: tAlign, lh: 1 })]; } break;
      case 'option': s = R(base * 0.95); h = R(s * 2.9); { const s1 = s, h1 = h; mk = (y) => [S('opt' + a + 'bg', { x: r.x, y, w: r.w, h: h1, fill: th.card, radius: R(h1 / 2) }), T('opt' + a, a + '   ' + b, { x: r.x + s1 * 1.2, y, w: r.w - s1 * 2.4, h: h1, size: s1, weight: 700, color: th.cardFg, valign: 'center' })]; } break;
      case 'title': case 'quote': case 'stat': case 'bodyfill': case 'img': case 'table': case 'chart': case 'toc': case 'cols': case 'cards': case 'blocks': case 'gallery': case 'box': {
        const last = it[it.length - 1];
        flex = (isOpt(last) && last.flex) || FLEX[k]; h = 0; break;
      }
      default: return;
    }
    specs.push({ it, h, flex, mk });
  });
  const fixedH = specs.reduce((n, sp) => n + sp.h, 0) + gap * (specs.length - 1);
  const free = Math.max(r.h - fixedH, base * 3), fw = specs.reduce((n, sp) => n + sp.flex, 0) || 1;
  specs.forEach((sp) => {
    if (!sp.flex) return; const [k, a, b] = sp.it; let H = free * sp.flex / fw; const optc = sp.it.find(isOpt) || {};
    const nl = typeof a === 'string' ? a.split('\n').filter(Boolean).length : 0;
    if (k === 'cards') { const n = (a as Card[]).length, cols = optc.cols || n; H = Math.min(H, Math.ceil(n / cols) * base * (optc.stat ? 7 : 13)); }
    if (k === 'chart') H = Math.min(H, nl * base * 3.2); if (k === 'table') H = Math.min(H, nl * base * 2.8); if (k === 'box') H = Math.min(H, base * 12); if (k === 'cols') H = Math.min(H, base * 18);
    if (k === 'blocks') { const s0 = R(base * 0.92); const tot = (a as Block[]).reduce((n, [, bd]) => n + R(base * 1.1) * 1.6 + lines(bd, s0, r.w, 'body') * s0 * 1.5 + base * 1.6, 0); H = Math.min(H, tot); }
    const opt = optc; const Hf = H;
    if (k === 'title' || k === 'quote' || k === 'stat') {
      const font = 'display', lh = k === 'stat' ? 1 : 1.06, max = k === 'stat' ? base * 7 : k === 'quote' ? base * (o.quoteMax || 2.4) : base * (o.titleMax || 3.8);
      const s = fit(str(a), r.w, Hf, max, R(base * 1.1), font, lh); const h = lines(str(a), s, r.w, font) * s * lh; sp.h = h;
      sp.mk = (y) => [T(k, str(a), { x: r.x, y, w: r.w, h, size: s, font, color: k === 'stat' ? th.stat : th.title, align: tAlign, lh, italic: false })];
    } else if (k === 'bodyfill') {
      sp.h = Hf; const s = R(base * (o.bodyScale || 1)); sp.mk = (y) => [T(opt.key || 'body', str(a), { x: r.x, y, w: r.w, h: Hf, size: s, color: th.fg, align: just, lh: 1.6 })];
    } else if (k === 'img') {
      const w = Math.min(r.w, opt.w ? r.w * opt.w : r.w); sp.h = Hf;
      sp.mk = (y) => [I(opt.key || 'photo', str(a), { x: ax(w), y, w, h: Hf, frame: opt.frame || 'round', radius: R(base * 0.9), ring: opt.ring || '' })];
    } else if (k === 'table') { sp.h = Hf; sp.mk = (y) => [TB('table', str(a), { x: r.x, y, w: r.w, h: Hf, size: R(base * 0.88), color: th.fg, head: th.title, line: th.line })]; }
    else if (k === 'chart') { sp.h = Hf; sp.mk = (y) => [CH('chart', str(a), { x: r.x, y, w: r.w, h: Hf, size: R(base * 0.85), color: th.fg, bar: C.pink6, track: th.card })]; }
    else if (k === 'toc') { sp.h = Hf; sp.mk = (y) => [TOC('toc', str(a), { x: r.x, y, w: r.w, h: Hf, size: R(base * 0.95), color: th.fg })]; }
    else if (k === 'box') { sp.h = Hf; const s = R(base * 0.95), p = R(base * 1.3); sp.mk = (y) => [S('boxbg', { x: r.x, y, w: r.w, h: Hf, fill: th.card, radius: R(base * 1.2) }), T('boxh', str(a), { x: r.x + p, y: y + p, w: r.w - 2 * p, h: s * 1.6, size: R(s * 1.05), weight: 800, color: th.cardFg }), T('box', str(b), { x: r.x + p, y: y + p + s * 2, w: r.w - 2 * p, h: Hf - 2 * p - s * 2, size: s, color: th.cardFg, lh: 1.55 })]; }
    else if (k === 'cols') {
      sp.h = Hf; const g = base * 1.4, w = (r.w - g) / 2, s = R(base * 0.95);
      sp.mk = (y) => [str(a), str(b)].flatMap((txt, i) => { const [hd, ...bd] = txt.split('\n'); const x = r.x + i * (w + g); const p = R(base); return [S('col' + i + 'bg', { x, y, w, h: Hf, fill: th.card, radius: R(base * 1.1) }), T('col' + i + 'h', hd, { x: x + p, y: y + p, w: w - 2 * p, h: s * 2.6, size: R(s * 1.3), font: 'display', color: th.cardFg, lh: 1.1 }), T('col' + i, bd.join('\n'), { x: x + p, y: y + p + s * 3, w: w - 2 * p, h: Hf - 2 * p - s * 3, size: s, color: th.cardFg, lh: 1.55 })]; });
    } else if (k === 'cards') {
      sp.h = Hf; const list = a as Card[], n = list.length, g = base * 1.1, cols = opt.cols || (r.w / n < base * 8 ? Math.ceil(n / 2) : n), rows = Math.ceil(n / cols);
      const w = (r.w - g * (cols - 1)) / cols, ch = (Hf - g * (rows - 1)) / rows, s = R(base * 0.85), p = R(base * 0.9);
      sp.mk = (y) => list.flatMap((cd, i) => {
        const x = r.x + (i % cols) * (w + g), yy = y + Math.floor(i / cols) * (ch + g); const out = [S('card' + i + 'bg', { x, y: yy, w, h: ch, fill: th.card, radius: R(base) })]; let ty = yy + p;
        if (cd[2] !== undefined) { const ih = ch * 0.5; out.push(I('card' + i + 'img', cd[2], { x: x + p, y: yy + p, w: w - 2 * p, h: ih, frame: 'round', radius: R(base * 0.6) })); ty = yy + p + ih + p * 0.6; }
        const big = opt.stat; const hs = big ? fit(cd[0], w - 2 * p, (ch - (ty - yy)) * 0.45, base * 3.2, base, 'display', 1) : R(s * 1.25);
        out.push(T('card' + i + 'h', cd[0], { x: x + p, y: ty, w: w - 2 * p, h: hs * (big ? 1.1 : 2.5), size: hs, font: big ? 'display' : 'body', weight: big ? 400 : 800, color: big ? th.stat : th.cardFg, lh: big ? 1 : 1.2 }));
        out.push(T('card' + i, cd[1], { x: x + p, y: ty + hs * (big ? 1.25 : 2.6), w: w - 2 * p, h: Math.max(s * 2, yy + ch - p - (ty + hs * (big ? 1.25 : 2.6))), size: s, color: th.cardFg, lh: 1.45 })); return out;
      });
    } else if (k === 'gallery') {
      sp.h = Hf; const g = base * 0.8, w = (r.w - g) / 2, gh = (Hf - g) / 2; sp.mk = (y) => (a as string[]).map((src, i) => I('gal' + i, src, { x: r.x + (i % 2) * (w + g), y: y + Math.floor(i / 2) * (gh + g), w, h: gh, frame: 'round', radius: R(base * 0.7) }));
    } else if (k === 'blocks') {
      sp.h = Hf; const bl = a as Block[]; const s = R(base * 0.92), hs = R(base * 1.1); const est = bl.map(([, bd]) => hs * 1.6 + lines(bd, s, r.w, 'body') * s * 1.5 + base * 0.9); const tot = est.reduce((n, v) => n + v, 0);
      sp.mk = (y) => { let yy = y; return bl.flatMap(([hd, bd], i) => { const hh = Hf * est[i] / tot; const out = [T('blk' + i + 'h', hd, { x: r.x, y: yy, w: r.w, h: hs * 1.5, size: hs, weight: 800, upper: true, ls: 0.08, color: th.label }), T('blk' + i, bd, { x: r.x, y: yy + hs * 1.6, w: r.w, h: hh - hs * 1.6 - base * 0.6, size: s, color: th.fg, lh: 1.5 })]; yy += hh; return out; }); };
    }
  });
  const total = specs.reduce((n, sp) => n + sp.h, 0) + gap * (specs.length - 1);
  let y = valign === 'top' ? r.y : valign === 'bottom' ? r.y + r.h - total : r.y + (r.h - total) / 2; y = Math.max(r.y, y);
  specs.forEach((sp) => { els.push(...sp.mk(y)); y += sp.h + gap; });
  els.forEach((e) => { e.x = R(e.x); e.y = R(e.y); e.w = R(e.w); e.h = R(e.h); });
  return els;
}

/* ---------- graphic composer (social / ads / banners / editorial / web) ---------- */
export function ratioClass(W: number, H: number): 'strip' | 'wide' | 'tall' | 'square' { const ar = W / H; return ar > 2.6 ? 'strip' : ar > 1.3 ? 'wide' : ar < 0.77 ? 'tall' : 'square'; }
export function compose(W: number, H: number, v: Variant): Composed {
  const cls = ratioClass(W, H), mn = Math.min(W, H), m = R(mn * (cls === 'strip' ? 0.14 : 0.07));
  const base = clamp(R(Math.sqrt(W * H) * 0.024), 10, 38); let th = TH[v.theme || 'cream']; const els: El[] = []; let bg = th.bg;
  let tr: Rect = { x: m, y: m, w: W - 2 * m, h: H - 2 * m }, valign: 'center' | 'bottom' = 'center'; const media = v.media || 'none', photo = v.photo || PH.cake;
  let items = v.items.slice();
  if (media === 'full') {
    els.push(I('photo', photo, { x: 0, y: 0, w: W, h: H, scrim: true })); th = TH.photo; bg = C.cocoa; valign = 'bottom';
    if (cls === 'wide') tr = { x: m, y: m, w: W * 0.6, h: H - 2 * m }; if (cls === 'strip') tr = { x: m, y: m * 0.5, w: W * 0.62, h: H - m };
    const hasLogo = items.some((i) => i[0] === 'logo'); items = items.filter((i) => i[0] !== 'logo');
    if (hasLogo || cls !== 'strip') { const lg = clamp(mn * 0.15, 32, 180); els.push(L('logo', { x: W - m - lg, y: m, w: lg, h: lg, radius: R(lg * 0.18), variant: 'mark', tile: C.cream })); }
  } else if (media !== 'none') {
    let frame: 'arch' | 'round' | 'none' = media === 'arch' ? 'arch' : 'round', mr: Rect;
    if (cls === 'tall') { mr = { x: m, y: m, w: W - 2 * m, h: H * 0.44 }; tr = { x: m, y: mr.y + mr.h + m * 0.6, w: W - 2 * m, h: H - mr.h - m * 2.6 }; }
    else if (cls === 'square') { mr = { x: W * 0.53, y: m, w: W * 0.47 - m, h: H - 2 * m }; tr = { x: m, y: m, w: W * 0.53 - m * 1.6, h: H - 2 * m }; }
    else if (cls === 'wide') { mr = { x: W * 0.58, y: m, w: W * 0.42 - m, h: H - 2 * m }; tr = { x: m, y: m, w: W * 0.58 - m * 1.6, h: H - 2 * m }; }
    else { mr = { x: W * 0.76, y: 0, w: W * 0.24, h: H }; frame = 'none'; tr = { x: m, y: m * 0.5, w: W * 0.76 - m * 1.5, h: H - m }; }
    els.push(I('photo', photo, { x: R(mr.x), y: R(mr.y), w: R(mr.w), h: R(mr.h), frame, ring: v.ring && frame !== 'none' ? C.gold : '', radius: R(base * 0.9) }));
  }
  if (cls === 'strip') return { bg, elements: strip(els, tr, items, th) };
  stack(els, tr, items, th, base, { valign, align: v.align || 'left', logo: clamp(mn * 0.15, 36, 170), mark: media === 'full' });
  return { bg, elements: els };
}
export function strip(els: El[], r: Rect, items: Item[], th: Theme): El[] {
  const get = (k: string) => items.find((i) => i[0] === k); const g = Math.min(r.h * 0.28, r.w * 0.03); let x = r.x, right = r.x + r.w;
  { const lg = R(Math.min(r.h, r.w * 0.14)); els.push(L('logo', { x, y: r.y + (r.h - lg) / 2, w: lg, h: lg, radius: R(lg * 0.18), tile: th.tile, variant: lg < 70 ? 'mark' : 'full' })); x += lg + g; }
  const cta = get('cta'); if (cta) { const ct = str(cta[1]); const s = clamp(R(r.h * 0.24), 9, Math.max(9, Math.min(30, r.w * 0.022))), w = ct.length * s * 0.56 + s * 3, h = Math.min(r.h, s * 2.8); if (right - x - w - g >= r.w * 0.3) els.push(T('cta', ct, { x: R(right - w), y: R(r.y + (r.h - h) / 2), w: R(w), h: R(h), size: s, weight: 700, color: th.ctaFg, bg: th.ctaBg, radius: 999, align: 'center', valign: 'center', lh: 1.1 })); if (right - x - w - g >= r.w * 0.3) right -= w + g; }
  const tw = right - x, title = get('title') || get('quote') || get('stat'), sub = get('sub'), lab = get('label');
  let showSub = !!sub && r.h > 110; const showLab = !!lab && r.h > 150;
  const ss = clamp(R(r.h * 0.13), 9, 30), ls = clamp(R(r.h * 0.08), 9, 20), lh = showLab ? ls * 1.6 : 0; let sh = showSub && sub ? lines(str(sub[1]), ss, tw, 'body') * ss * 1.35 : 0;
  if (showSub && r.h - sh - lh < r.h * 0.4) { showSub = false; sh = 0; }
  const ttl = title ? str(title[1]) : '';
  const ts = fit(ttl, tw, (r.h - sh - lh - (showSub ? ss * 0.5 : 0)) * 0.96, r.h * 0.5, 9, 'display', 1.05); const th1 = lines(ttl, ts, tw, 'display') * ts * 1.05;
  let y = r.y + (r.h - th1 - sh - lh - (showSub ? ss * 0.5 : 0)) / 2;
  if (showLab && lab) { els.push(T('label', str(lab[1]), { x, y, w: tw, h: lh, size: ls, weight: 800, upper: true, ls: 0.12, color: th.label })); y += lh; }
  if (title) { els.push(T('title', ttl, { x, y, w: tw, h: th1, size: ts, font: 'display', color: th.title, lh: 1.05 })); y += th1 + ss * 0.5; }
  if (showSub && sub) els.push(T('sub', str(sub[1]), { x, y, w: tw, h: sh, size: ss, weight: 500, color: th.fg, lh: 1.35 }));
  els.forEach((e) => { e.x = R(e.x); e.y = R(e.y); e.w = R(e.w); e.h = R(e.h); }); return els;
}
export function avatar(W: number, H: number, v: AvatarSpec): Composed {
  const els: El[] = [], p = R(W * (v.pad || 0)); const bg = v.bg;
  if (v.ring) els.push(S('ring', { x: R(W * 0.04), y: R(H * 0.04), w: R(W * 0.92), h: R(H * 0.92), fill: 'transparent', stroke: v.ring, strokeW: R(W * 0.035), radius: 999 }));
  if (v.kind === 'initials') els.push(T('title', 'MMA', { x: 0, y: 0, w: W, h: H, size: R(W * 0.3), font: 'display', color: C.gold4, align: 'center', valign: 'center', lh: 1 }));
  else els.push(L('logo', { x: p, y: p, w: W - 2 * p, h: H - 2 * p, variant: v.kind, tile: v.tile || C.cream, radius: v.circle ? 999 : R(W * 0.12) }));
  return { bg, elements: els };
}

/* ---------- doc page layouts ---------- */
export function docPage(dt: DocTypeId, kindId: string, W: number, H: number, ed?: Edition): Composed {
  const D = DOCS[dt], k = D.kinds[kindId], c = k.c, wide = W > H;
  const base = Math.max(15, R(Math.sqrt(W * H) / (wide ? 48 : 59)));
  const m = R(wide ? W * 0.065 : W * 0.1), r: Rect = { x: m, y: m, w: W - 2 * m, h: H - 2 * m - (k.numbered === false ? 0 : base * 1.6) };
  const darkPage = ed === 'cocoa' && (k.layout === 'cover' || k.layout === 'opener' || k.layout === 'closing' || k.layout === 'back') || !!k.dark || k.layout === 'back' || k.layout === 'nlfooter';
  const th = darkPage ? TH.cocoa : TH[D.slides ? 'cream' : 'white']; const els: El[] = []; const o: StackOpts = { valign: 'top', justify: D.justify, base };
  const split = (): [Rect, Rect] => { const mr = { x: W * 0.54, y: m, w: W * 0.46 - m, h: H - 2 * m }; const tr = { x: m, y: m, w: W * 0.54 - m * 1.6, h: H - 2 * m }; return [mr, tr]; };
  const keep = (x: Item | null): x is Item => !!x;
  switch (k.layout) {
    case 'cover':
      if (wide) { const [mr, tr] = split(); els.push(I('photo', PH.cake, { ...mr, frame: 'arch', ring: darkPage ? C.gold : '', radius: R(base) })); stack(els, tr, [it('logo'), it('label', c.label), it('title', c.title), it('sub', c.sub), it('meta', c.meta)], th, base, { valign: 'center' }); }
      else stack(els, { x: m, y: m, w: W - 2 * m, h: H - 2 * m }, [it('img', PH.cake, { frame: 'arch', ring: darkPage ? C.gold : '', flex: 1.6 }), it('label', c.label), it('title', c.title), it('sub', c.sub), it('meta', c.meta), it('logo')], th, base, { valign: 'top', logo: R(base * 4.2) });
      break;
    case 'titlepage': stack(els, r, [it('title', c.title), it('sub', c.sub), it('ribbon'), it('meta', c.meta)], th, base, { valign: 'center', align: 'center', titleMax: 3 }); break;
    case 'copyright': stack(els, r, [it('body', c.body)], th, R(base * 0.85), { valign: 'bottom' }); break;
    case 'dedication': stack(els, r, [it('quote', c.quote)], th, base, { valign: 'center', align: 'center', quoteMax: 1.6 }); els.forEach((e) => { e.italic = true; e.font = 'body'; }); break;
    case 'epigraph': stack(els, r, [it('quote', c.quote), it('author', c.author)], th, base, { valign: 'center', align: 'center', quoteMax: 1.6 }); break;
    case 'toc': stack(els, r, [it('heading', c.heading), it('ribbon'), it('toc', c.toc)], th, base, o); break;
    case 'opener': stack(els, r, [it('label', c.label), it('title', c.title), it('ribbon'), it('sub', c.sub)].filter((x) => x[1] !== ''), th, base, { valign: 'center', align: 'left', titleMax: wide ? 3.4 : 3 }); break;
    case 'text': stack(els, r, [c.label ? it('label', c.label) : null, it('heading', c.heading), it('bodyfill', c.body)].filter(keep), th, base, o); break;
    case 'sections': stack(els, r, [it('heading', c.heading), it('blocks', c.blocks)], th, base, o); break;
    case 'quote': stack(els, r, [it('quotemark'), it('quote', c.quote), c.author ? it('author', c.author) : null].filter(keep), th, base, { valign: 'center', quoteMax: wide ? 2.6 : 2.2 }); break;
    case 'callout': stack(els, r, [it('heading', c.heading), it('body', c.body), it('box', c.boxh, c.box)], th, base, o); break;
    case 'figure':
      if (wide) { const [mr, tr] = split(); els.push(I('photo', c.img || '', { ...mr, frame: 'round', radius: R(base) })); stack(els, tr, [it('heading', c.heading), it('body', c.body), it('meta', c.caption, null, 'caption')], th, base, { valign: 'center' }); }
      else stack(els, r, [c.heading ? it('heading', c.heading) : null, it('img', c.img), it('meta', c.caption, null, 'caption'), c.body ? it('bodyfill', c.body, { flex: 1 }) : null].filter(keep), th, base, o);
      break;
    case 'table': stack(els, r, [it('heading', c.heading), c.body ? it('body', c.body) : null, it('table', c.table), c.caption ? it('meta', c.caption, null, 'caption') : null].filter(keep), th, base, o); break;
    case 'chart': stack(els, r, [it('heading', c.heading), it('chart', c.chart), it('meta', c.caption, null, 'caption')], th, base, o); break;
    case 'stats': { const cards = c.cards || []; stack(els, r, [it('heading', c.heading), it('cards', cards, { stat: 1, cols: wide ? cards.length : Math.min(cards.length, 2) })], th, base, o); break; }
    case 'team': stack(els, r, [it('heading', c.heading), it('cards', c.cards, { cols: 3 })], th, base, o); break;
    case 'cards': stack(els, r, [it('heading', c.heading), it('cards', c.cards, { cols: wide ? 3 : 1 })], th, base, o); break;
    case 'list': stack(els, r, [it('heading', c.heading), it('ribbon'), it('list', c.list)], th, base, { ...o, listScale: wide ? 1.3 : 1.05 }); break;
    case 'twocol': stack(els, r, [it('heading', c.heading), it('cols', c.cols?.[0], c.cols?.[1])], th, base, o); break;
    case 'gallery': stack(els, r, [it('heading', c.heading), it('gallery', c.gallery)], th, base, o); break;
    case 'hero': stack(els, r, [it('img', c.img, { flex: 1.2 }), it('label', c.label), it('title', c.title, { flex: 0.6 }), c.meta ? it('meta', c.meta) : null, it('bodyfill', c.body, { flex: 0.5 })].filter(keep), th, base, { ...o, titleMax: 2.6 }); break;
    case 'nlheader': stack(els, r, [it('logo'), it('label', c.label), it('title', c.title, { flex: 0.5 }), it('ribbon'), it('bodyfill', c.body)], th, base, { ...o, logo: R(base * 5), titleMax: 3 }); break;
    case 'nlfooter': stack(els, r, [it('logo'), it('ribbon'), it('body', c.body)], th, base, { valign: 'center', align: 'center', logo: R(base * 5) }); break;
    case 'resumehead': stack(els, r, [it('title', c.title, { flex: 0.35 }), it('sub', c.sub), it('meta', c.meta), it('ribbon'), it('blocks', c.blocks)], th, base, { ...o, titleMax: 2.6 }); break;
    case 'closing': stack(els, r, [it('logo'), it('title', c.title), it('sub', c.sub), it('cta', c.cta), it('handle', c.handle)], th, base, { valign: 'center', align: 'center', titleMax: wide ? 3.6 : 2.8, logo: R(base * (wide ? 6 : 5)) }); break;
    case 'back': stack(els, r, [it('logo'), it('quote', c.quote), it('ribbon'), it('meta', c.meta)], th, base, { valign: 'center', align: 'center', quoteMax: 1.4, logo: R(base * 5) }); break;
  }
  if (k.numbered !== false) els.push(PN({ x: m, y: H - m * 0.5 - base, w: W - 2 * m, h: base * 1.2, size: R(base * 0.75), color: th.muted }));
  els.forEach((e) => { e.x = R(e.x); e.y = R(e.y); e.w = R(e.w); e.h = R(e.h); });
  return { bg: th.bg, elements: els };
}

export function isDark(hex: string | undefined): boolean { if (!hex || hex[0] !== '#' || hex.length < 7) return false; const n = parseInt(hex.slice(1, 7), 16); const r = n >> 16, g = (n >> 8) & 255, b = n & 255; return (0.299 * r + 0.587 * g + 0.114 * b) < 128; }
export const slug = (s: string): string => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
