/* Treats by MMA Studio — brand tokens, layout engine, template inventory, document types.
   Pure data/logic; no DOM. Exposed as window.TBM. */
(function () {
const C = { cocoa:'#3D1D10', cocoa9:'#2B140A', cocoa7:'#5A2F1C', cocoa6:'#7A4A33', cocoa3:'#C9A893', cocoa1:'#EEDFD3',
  gold:'#E8B323', gold4:'#F2C94C', gold3:'#F7DC85', gold7:'#8F6410', gold1:'#FCF1CC',
  pink:'#E8358F', pink6:'#C81F75', pink7:'#AD1660', pink3:'#F59AC6', pink1:'#FDE3F0',
  cream:'#FFF4DC', cream0:'#FFFDF6', cream50:'#FFF9EA', cream2:'#F8E8C4', cream3:'#EED7A8',
  milk:'#4A8FD0', milk1:'#E1EEFA', leaf:'#2E9A4E', leaf1:'#DDF3E2', white:'#FFFFFF' };
const SWATCHES = [C.cocoa, C.cocoa9, C.cocoa7, C.gold, C.gold4, C.gold3, C.gold1, C.pink, C.pink6, C.pink7, C.pink3, C.pink1, C.cream, C.cream0, C.milk, C.leaf, C.white];
const FONTS = { display:"'Caprasimo', 'Cooper Black', Georgia, serif", body:"'Figtree', 'Segoe UI', system-ui, sans-serif" };
const P = 'assets/photos/concept-';
const PH = { cake:P+'cake.png', bread:P+'banana-bread.png', donut:P+'doughnuts.png', pastry:P+'pastries.png', chops:P+'small-chops.png', fura:P+'yogurt-fura.png' };
const LOGO = 'assets/logo/treats-by-mma-logo.png', MARK = 'assets/logo/proposed-cake-monogram.png';
const PHOTOS = [['Celebration cake',PH.cake],['Banana bread',PH.bread],['Doughnuts',PH.donut],['Pastries',PH.pastry],['Small chops',PH.chops],['Yogurt fura',PH.fura]];
const HANDLE = '@treats_by_mma', WA = 'WhatsApp 0813 107 7321';

let uid = 0; const nid = (p) => (p||'e') + Date.now().toString(36).slice(-4) + (uid++).toString(36);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const R = Math.round;

const T = (key, text, o) => Object.assign({ id:nid(), key, type:'text', text, font:'body', size:16, weight:400, color:C.cocoa, align:'left', lh:1.4, ls:0, upper:false, italic:false, bg:'', radius:0, pad:0, valign:'top', opacity:1, x:0, y:0, w:100, h:40 }, o);
const I = (key, src, o) => Object.assign({ id:nid(), key, type:'image', src, fit:'cover', frame:'none', ring:'', scrim:false, radius:0, opacity:1, x:0, y:0, w:100, h:100 }, o);
const S = (key, o) => Object.assign({ id:nid(), key, type:'shape', fill:C.gold1, radius:0, stroke:'', strokeW:0, opacity:1, x:0, y:0, w:100, h:100 }, o);
const L = (key, o) => Object.assign({ id:nid(), key, type:'logo', variant:'full', tile:C.cream, radius:12, opacity:1, x:0, y:0, w:100, h:100 }, o);
const RB = (key, o) => Object.assign({ id:nid(), key, type:'ribbon', color:C.pink, opacity:1, x:0, y:0, w:200, h:20 }, o);
const TB = (key, text, o) => Object.assign({ id:nid(), key, type:'table', text, font:'body', size:15, color:C.cocoa, head:C.cocoa, line:C.gold3, opacity:1, x:0, y:0, w:300, h:200 }, o);
const TOC = (key, text, o) => Object.assign({ id:nid(), key, type:'toc', text, font:'body', size:16, color:C.cocoa, opacity:1, x:0, y:0, w:300, h:300 }, o);
const CH = (key, text, o) => Object.assign({ id:nid(), key, type:'chart', text, font:'body', size:15, color:C.cocoa, bar:C.pink6, track:C.pink1, opacity:1, x:0, y:0, w:300, h:200 }, o);
const PN = (o) => Object.assign({ id:nid(), key:'pageno', type:'pageno', text:'{n}', font:'body', size:12, weight:600, color:C.cocoa7, align:'center', lh:1, ls:0.08, upper:false, italic:false, bg:'', radius:0, pad:0, valign:'center', opacity:1, x:0, y:0, w:100, h:20 }, o);

const TH = {
  cream:{ bg:C.cream, title:C.cocoa, fg:C.cocoa, muted:C.cocoa7, label:C.pink7, ctaBg:C.pink6, ctaFg:C.white, card:C.cream0, cardFg:C.cocoa, stat:C.pink6, rib:C.pink, tile:C.cream0, line:C.gold3 },
  white:{ bg:C.cream0, title:C.cocoa, fg:C.cocoa, muted:C.cocoa7, label:C.pink7, ctaBg:C.pink6, ctaFg:C.white, card:C.cream, cardFg:C.cocoa, stat:C.pink6, rib:C.pink, tile:C.cream, line:C.gold3 },
  cocoa:{ bg:C.cocoa, title:C.cream, fg:C.cream, muted:C.cocoa1, label:C.gold4, ctaBg:C.pink6, ctaFg:C.white, card:C.cocoa7, cardFg:C.cream, stat:C.gold4, rib:C.gold, tile:C.cream, line:C.cocoa7 },
  photo:{ bg:C.cocoa, title:C.cream, fg:C.cream, muted:C.cream, label:C.gold4, ctaBg:C.pink6, ctaFg:C.white, card:C.cocoa7, cardFg:C.cream, stat:C.gold4, rib:C.gold, tile:C.cream, line:C.cocoa7 },
};

function lines(text, size, w, font) {
  const cw = size * (font === 'display' ? 0.6 : 0.52); const cpl = Math.max(1, Math.floor(w / cw));
  return String(text || ' ').split('\n').reduce((n, p) => { let ln = 1, cur = 0;
    for (const wd of p.split(/\s+/).filter(Boolean)) { if (wd.length > cpl) { if (font === 'display') return n + 999; ln += Math.ceil(wd.length / cpl); cur = 0; continue; } if (cur && cur + 1 + wd.length > cpl) { ln++; cur = wd.length; } else cur += (cur ? 1 : 0) + wd.length; }
    return n + ln; }, 0);
}
function fit(text, w, maxH, max, min, font, lh) { for (let s = R(max); s >= min; s -= 1) if (lines(text, s, w, font) * s * lh <= maxH) return s; return min; }

/* ---------- stack engine: lays items into a region top→bottom ---------- */
function stack(els, r, items, th, base, o) {
  o = o || {}; const valign = o.valign || 'center', align = o.align || 'left', gap = o.gap || base * 0.8;
  const tAlign = align === 'center' ? 'center' : 'left', just = o.justify ? 'justify' : tAlign;
  const ax = (w) => align === 'center' ? r.x + (r.w - w) / 2 : r.x;
  const lg = o.logo || clamp(Math.min(r.w, r.h) * 0.22, 36, 190);
  const fixed = [], specs = [];
  items.forEach((it) => {
    const [k, a, b] = it; let s, h, flex = 0, mk;
    switch (k) {
      case 'logo': h = lg; mk = (y) => [L('logo', { x:ax(lg), y, w:lg, h:lg, tile:th.tile, radius:R(lg*0.18), variant:o.mark ? 'mark' : 'full' })]; break;
      case 'label': s = R(base*0.72); h = lines(a, s, r.w, 'body') * s * 1.4; mk = (y) => [T('label', a, { x:r.x, y, w:r.w, h, size:s, weight:800, upper:true, ls:0.12, color:th.label, align:tAlign, lh:1.4 })]; break;
      case 'meta': s = R(base*0.78); h = lines(a, s, r.w, 'body') * s * 1.45; mk = (y) => [T(it[3]||'meta', a, { x:r.x, y, w:r.w, h, size:s, weight:600, color:th.muted, align:tAlign, lh:1.45 })]; break;
      case 'handle': s = R(base*0.78); h = s * 1.5; mk = (y) => [T('handle', a, { x:r.x, y, w:r.w, h, size:s, weight:700, color:th.muted, align:tAlign })]; break;
      case 'author': s = R(base*0.9); h = lines(a, s, r.w, 'body') * s * 1.4; mk = (y) => [T('author', a, { x:r.x, y, w:r.w, h, size:s, weight:700, color:th.fg, align:tAlign })]; break;
      case 'sub': s = R(base*(o.subScale||1.1)); h = lines(a, s, r.w, 'body') * s * 1.38; mk = (y) => [T('sub', a, { x:r.x, y, w:r.w, h, size:s, weight:500, color:th.fg, align:tAlign, lh:1.38 })]; break;
      case 'body': s = R(base*0.95); h = lines(a, s, r.w, 'body') * s * 1.55; mk = (y) => [T(it[3]||'body', a, { x:r.x, y, w:r.w, h, size:s, color:th.fg, align:just, lh:1.55 })]; break;
      case 'list': s = R(base*(o.listScale||0.95)); { const t = a.split('\n').map((l) => '•  ' + l).join('\n'); h = lines(t, s, r.w, 'body') * s * 1.7; mk = (y) => [T('list', t, { x:r.x, y, w:r.w, h, size:s, weight:500, color:th.fg, align:'left', lh:1.7 })]; } break;
      case 'heading': s = R(base*(o.headScale||1.9)); h = lines(a, s, r.w, 'display') * s * 1.12; mk = (y) => [T('heading', a, { x:r.x, y, w:r.w, h, size:s, font:'display', color:th.title, align:tAlign, lh:1.12 })]; break;
      case 'h3': s = R(base*1.15); h = lines(a, s, r.w, 'body') * s * 1.3; mk = (y) => [T('h3', a, { x:r.x, y, w:r.w, h, size:s, weight:700, color:th.title, align:tAlign, lh:1.3 })]; break;
      case 'cta': s = R(base*0.9); { const w = Math.min(r.w, a.length * s * 0.56 + s * 3); h = R(s * 2.8); mk = (y) => [T('cta', a, { x:ax(w), y, w, h, size:s, weight:700, color:th.ctaFg, bg:th.ctaBg, radius:999, align:'center', valign:'center', lh:1.1 })]; } break;
      case 'ribbon': h = base * 1.2; { const w = Math.min(r.w, base * 12); mk = (y) => [RB('ribbon', { x:ax(w), y, w, h, color:th.rib })]; } break;
      case 'quotemark': s = R(base*4); h = s * 0.62; mk = (y) => [T('quotemark', '\u201C', { x:r.x, y:y - s*0.12, w:r.w, h:s*0.9, size:s, font:'display', color:th.stat, align:tAlign, lh:1 })]; break;
      case 'option': s = R(base*0.95); h = R(s * 2.9); mk = (y) => [S('opt'+a+'bg', { x:r.x, y, w:r.w, h, fill:th.card, radius:R(h/2) }), T('opt'+a, a + '   ' + b, { x:r.x + s*1.2, y, w:r.w - s*2.4, h, size:s, weight:700, color:th.cardFg, valign:'center' })]; break;
      case 'title': case 'quote': case 'stat': case 'bodyfill': case 'img': case 'table': case 'chart': case 'toc': case 'cols': case 'cards': case 'blocks': case 'gallery': case 'box':
        flex = it[it.length - 1] && typeof it[it.length - 1] === 'object' && it[it.length - 1].flex || ({ title:1, quote:1, stat:1, bodyfill:3, img:1.4, table:2, chart:2, toc:3, cols:2, cards:2, blocks:4, gallery:2, box:1 })[k]; h = 0; break;
      default: return;
    }
    specs.push({ it, h, flex, mk });
  });
  const fixedH = specs.reduce((n, sp) => n + sp.h, 0) + gap * (specs.length - 1);
  const free = Math.max(r.h - fixedH, base * 3), fw = specs.reduce((n, sp) => n + sp.flex, 0) || 1;
  specs.forEach((sp) => {
    if (!sp.flex) return; const [k, a, b, c3] = sp.it; let H = free * sp.flex / fw; const optc = (sp.it.find((x) => x && typeof x === 'object' && !Array.isArray(x))) || {};
    const nl = typeof a === 'string' ? a.split('\n').filter(Boolean).length : 0;
    if (k === 'cards') { const n = a.length, cols = optc.cols || n; H = Math.min(H, Math.ceil(n / cols) * base * (optc.stat ? 7 : 13)); }
    if (k === 'chart') H = Math.min(H, nl * base * 3.2); if (k === 'table') H = Math.min(H, nl * base * 2.8); if (k === 'box') H = Math.min(H, base * 12); if (k === 'cols') H = Math.min(H, base * 18);
    if (k === 'blocks') { const s0 = R(base*0.92); const tot = a.reduce((n, [hd, bd]) => n + R(base*1.1)*1.6 + lines(bd, s0, r.w, 'body') * s0 * 1.5 + base*1.6, 0); H = Math.min(H, tot); } const opt = (sp.it.find((x) => x && typeof x === 'object' && !Array.isArray(x))) || {};
    if (k === 'title' || k === 'quote' || k === 'stat') {
      const font = 'display', lh = k === 'stat' ? 1 : 1.06, max = k === 'stat' ? base * 7 : k === 'quote' ? base * (o.quoteMax||2.4) : base * (o.titleMax||3.8);
      const s = fit(a, r.w, H, max, R(base*1.1), font, lh); const h = lines(a, s, r.w, font) * s * lh; sp.h = h;
      sp.mk = (y) => [T(k, a, { x:r.x, y, w:r.w, h, size:s, font, color:k === 'stat' ? th.stat : th.title, align:tAlign, lh, italic:false })];
    } else if (k === 'bodyfill') {
      sp.h = H; const s = R(base*(o.bodyScale||1)); sp.mk = (y) => [T(opt.key||'body', a, { x:r.x, y, w:r.w, h:H, size:s, color:th.fg, align:just, lh:1.6 })];
    } else if (k === 'img') {
      const w = Math.min(r.w, opt.w ? r.w * opt.w : r.w); sp.h = H;
      sp.mk = (y) => [I(opt.key||'photo', a, { x:ax(w), y, w, h:H, frame:opt.frame || 'round', radius:R(base*0.9), ring:opt.ring || '' })];
    } else if (k === 'table') { sp.h = H; sp.mk = (y) => [TB('table', a, { x:r.x, y, w:r.w, h:H, size:R(base*0.88), color:th.fg, head:th.title, line:th.line })]; }
    else if (k === 'chart') { sp.h = H; sp.mk = (y) => [CH('chart', a, { x:r.x, y, w:r.w, h:H, size:R(base*0.85), color:th.fg, bar:C.pink6, track:th.card })]; }
    else if (k === 'toc') { sp.h = H; sp.mk = (y) => [TOC('toc', a, { x:r.x, y, w:r.w, h:H, size:R(base*0.95), color:th.fg })]; }
    else if (k === 'box') { sp.h = H; const s = R(base*0.95), p = R(base*1.3); sp.mk = (y) => [S('boxbg', { x:r.x, y, w:r.w, h:H, fill:th.card, radius:R(base*1.2) }), T('boxh', a, { x:r.x+p, y:y+p, w:r.w-2*p, h:s*1.6, size:R(s*1.05), weight:800, color:th.cardFg }), T('box', b, { x:r.x+p, y:y+p+s*2, w:r.w-2*p, h:H-2*p-s*2, size:s, color:th.cardFg, lh:1.55 })]; }
    else if (k === 'cols') {
      sp.h = H; const g = base * 1.4, w = (r.w - g) / 2, s = R(base*0.95);
      sp.mk = (y) => [a, b].flatMap((txt, i) => { const [hd, ...bd] = txt.split('\n'); const x = r.x + i * (w + g); const p = R(base); return [S('col'+i+'bg', { x, y, w, h:H, fill:th.card, radius:R(base*1.1) }), T('col'+i+'h', hd, { x:x+p, y:y+p, w:w-2*p, h:s*2.6, size:R(s*1.3), font:'display', color:th.cardFg, lh:1.1 }), T('col'+i, bd.join('\n'), { x:x+p, y:y+p+s*3, w:w-2*p, h:H-2*p-s*3, size:s, color:th.cardFg, lh:1.55 })]; });
    } else if (k === 'cards') {
      sp.h = H; const list = a, n = list.length, g = base * 1.1, cols = opt.cols || (r.w / n < base * 8 ? Math.ceil(n / 2) : n), rows = Math.ceil(n / cols);
      const w = (r.w - g * (cols - 1)) / cols, ch = (H - g * (rows - 1)) / rows, s = R(base*0.85), p = R(base*0.9);
      sp.mk = (y) => list.flatMap((cd, i) => { const x = r.x + (i % cols) * (w + g), yy = y + Math.floor(i / cols) * (ch + g); const out = [S('card'+i+'bg', { x, y:yy, w, h:ch, fill:th.card, radius:R(base) })]; let ty = yy + p;
        if (cd[2] !== undefined) { const ih = ch * 0.5; out.push(I('card'+i+'img', cd[2], { x:x+p, y:yy+p, w:w-2*p, h:ih, frame:'round', radius:R(base*0.6) })); ty = yy + p + ih + p * 0.6; }
        const big = opt.stat; const hs = big ? fit(cd[0], w-2*p, (ch-(ty-yy))*0.45, base*3.2, base, 'display', 1) : R(s*1.25);
        out.push(T('card'+i+'h', cd[0], { x:x+p, y:ty, w:w-2*p, h:hs*(big?1.1:2.5), size:hs, font:big?'display':'body', weight:big?400:800, color:big?th.stat:th.cardFg, lh:big?1:1.2 }));
        out.push(T('card'+i, cd[1], { x:x+p, y:ty+hs*(big?1.25:2.6), w:w-2*p, h:Math.max(s*2, yy+ch-p-(ty+hs*(big?1.25:2.6))), size:s, color:th.cardFg, lh:1.45 })); return out; });
    } else if (k === 'gallery') {
      sp.h = H; const g = base * 0.8, w = (r.w - g) / 2, gh = (H - g) / 2; sp.mk = (y) => a.map((src, i) => I('gal'+i, src, { x:r.x + (i % 2) * (w + g), y:y + Math.floor(i / 2) * (gh + g), w, h:gh, frame:'round', radius:R(base*0.7) }));
    } else if (k === 'blocks') {
      sp.h = H; const bl = a; const s = R(base*0.92), hs = R(base*1.1); const est = bl.map(([hd, bd]) => hs*1.6 + lines(bd, s, r.w, 'body') * s * 1.5 + base*0.9); const tot = est.reduce((n, v) => n + v, 0);
      sp.mk = (y) => { let yy = y; return bl.flatMap(([hd, bd], i) => { const hh = H * est[i] / tot; const out = [T('blk'+i+'h', hd, { x:r.x, y:yy, w:r.w, h:hs*1.5, size:hs, weight:800, upper:true, ls:0.08, color:th.label }), T('blk'+i, bd, { x:r.x, y:yy + hs*1.6, w:r.w, h:hh - hs*1.6 - base*0.6, size:s, color:th.fg, lh:1.5 })]; yy += hh; return out; }); };
    }
  });
  const total = specs.reduce((n, sp) => n + sp.h, 0) + gap * (specs.length - 1);
  let y = valign === 'top' ? r.y : valign === 'bottom' ? r.y + r.h - total : r.y + (r.h - total) / 2; y = Math.max(r.y, y);
  specs.forEach((sp) => { els.push(...sp.mk(y)); y += sp.h + gap; });
  els.forEach((e) => { e.x = R(e.x); e.y = R(e.y); e.w = R(e.w); e.h = R(e.h); });
  return els;
}

/* ---------- graphic composer (social / ads / banners / editorial / web) ---------- */
function ratioClass(W, H) { const ar = W / H; return ar > 2.6 ? 'strip' : ar > 1.3 ? 'wide' : ar < 0.77 ? 'tall' : 'square'; }
function compose(W, H, v) {
  const cls = ratioClass(W, H), mn = Math.min(W, H), m = R(mn * (cls === 'strip' ? 0.14 : 0.07));
  const base = clamp(R(Math.sqrt(W * H) * 0.024), 10, 38); let th = TH[v.theme || 'cream']; const els = []; let bg = th.bg;
  let tr = { x:m, y:m, w:W - 2*m, h:H - 2*m }, valign = 'center'; const media = v.media || 'none', photo = v.photo || PH.cake;
  let items = v.items.slice();
  if (media === 'full') {
    els.push(I('photo', photo, { x:0, y:0, w:W, h:H, scrim:true })); th = TH.photo; bg = C.cocoa; valign = 'bottom';
    if (cls === 'wide') tr = { x:m, y:m, w:W*0.6, h:H - 2*m }; if (cls === 'strip') tr = { x:m, y:m*0.5, w:W*0.62, h:H - m };
    const hasLogo = items.some((i) => i[0] === 'logo'); items = items.filter((i) => i[0] !== 'logo');
    if (hasLogo || cls !== 'strip') { const lg = clamp(mn*0.15, 32, 180); els.push(L('logo', { x:W - m - lg, y:m, w:lg, h:lg, radius:R(lg*0.18), variant:'mark', tile:C.cream })); }
  } else if (media !== 'none') {
    let frame = media === 'arch' ? 'arch' : 'round', mr;
    if (cls === 'tall') { mr = { x:m, y:m, w:W - 2*m, h:H*0.44 }; tr = { x:m, y:mr.y + mr.h + m*0.6, w:W - 2*m, h:H - mr.h - m*2.6 }; }
    else if (cls === 'square') { mr = { x:W*0.53, y:m, w:W*0.47 - m, h:H - 2*m }; tr = { x:m, y:m, w:W*0.53 - m*1.6, h:H - 2*m }; }
    else if (cls === 'wide') { mr = { x:W*0.58, y:m, w:W*0.42 - m, h:H - 2*m }; tr = { x:m, y:m, w:W*0.58 - m*1.6, h:H - 2*m }; }
    else { mr = { x:W*0.76, y:0, w:W*0.24, h:H }; frame = 'none'; tr = { x:m, y:m*0.5, w:W*0.76 - m*1.5, h:H - m }; }
    els.push(I('photo', photo, { x:R(mr.x), y:R(mr.y), w:R(mr.w), h:R(mr.h), frame, ring:v.ring && frame !== 'none' ? C.gold : '', radius:R(base*0.9) }));
  }
  if (cls === 'strip') return { bg, elements:strip(els, tr, items, th, base) };
  stack(els, tr, items, th, base, { valign, align:v.align || 'left', logo:clamp(mn*0.15, 36, 170), mark:media === 'full' });
  return { bg, elements:els };
}
function strip(els, r, items, th, base) {
  const get = (k) => items.find((i) => i[0] === k); const g = Math.min(r.h * 0.28, r.w * 0.03); let x = r.x, right = r.x + r.w;
  { const lg = R(Math.min(r.h, r.w * 0.14)); els.push(L('logo', { x, y:r.y + (r.h - lg) / 2, w:lg, h:lg, radius:R(lg*0.18), tile:th.tile, variant:lg < 70 ? 'mark' : 'full' })); x += lg + g; }
  const cta = get('cta'); if (cta) { const s = clamp(R(r.h*0.24), 9, Math.max(9, Math.min(30, r.w * 0.022))), w = cta[1].length * s * 0.56 + s * 3, h = Math.min(r.h, s * 2.8); if (right - x - w - g >= r.w * 0.3) els.push(T('cta', cta[1], { x:R(right - w), y:R(r.y + (r.h - h)/2), w:R(w), h:R(h), size:s, weight:700, color:th.ctaFg, bg:th.ctaBg, radius:999, align:'center', valign:'center', lh:1.1 })); if (right - x - w - g >= r.w * 0.3) right -= w + g; }
  const tw = right - x, title = get('title') || get('quote') || get('stat'), sub = get('sub'), lab = get('label');
  let showSub = sub && r.h > 110; const showLab = lab && r.h > 150;
  const ss = clamp(R(r.h*0.13), 9, 30), ls = clamp(R(r.h*0.08), 9, 20), lh = showLab ? ls * 1.6 : 0; let sh = showSub ? lines(sub[1], ss, tw, 'body') * ss * 1.35 : 0;
  if (showSub && r.h - sh - lh < r.h * 0.4) { showSub = false; sh = 0; }
  const ts = fit(title ? title[1] : '', tw, (r.h - sh - lh - (showSub ? ss*0.5 : 0)) * 0.96, r.h * 0.5, 9, 'display', 1.05); const th1 = lines(title ? title[1] : '', ts, tw, 'display') * ts * 1.05;
  let y = r.y + (r.h - th1 - sh - lh - (showSub ? ss*0.5 : 0)) / 2;
  if (showLab) { els.push(T('label', lab[1], { x, y, w:tw, h:lh, size:ls, weight:800, upper:true, ls:0.12, color:th.label })); y += lh; }
  if (title) { els.push(T('title', title[1], { x, y, w:tw, h:th1, size:ts, font:'display', color:th.title, lh:1.05 })); y += th1 + ss*0.5; }
  if (showSub) els.push(T('sub', sub[1], { x, y, w:tw, h:sh, size:ss, weight:500, color:th.fg, lh:1.35 }));
  els.forEach((e) => { e.x = R(e.x); e.y = R(e.y); e.w = R(e.w); e.h = R(e.h); }); return els;
}
function avatar(W, H, v) {
  const els = [], p = R(W * (v.pad || 0)); let bg = v.bg;
  if (v.ring) els.push(S('ring', { x:R(W*0.04), y:R(H*0.04), w:R(W*0.92), h:R(H*0.92), fill:'transparent', stroke:v.ring, strokeW:R(W*0.035), radius:999 }));
  if (v.kind === 'initials') els.push(T('title', 'MMA', { x:0, y:0, w:W, h:H, size:R(W*0.3), font:'display', color:C.gold4, align:'center', valign:'center', lh:1 }));
  else els.push(L('logo', { x:p, y:p, w:W - 2*p, h:H - 2*p, variant:v.kind, tile:v.tile || C.cream, radius:v.circle ? 999 : R(W*0.12) }));
  return { bg, elements:els };
}

/* ---------- formats ---------- */
const F = (label, w, h, group, ex) => Object.assign({ label, w, h, group }, ex || {});
const FORMATS = {
  square:F('Square post',1080,1080,'social'), engage:F('Engagement post',1080,1080,'social'), carousel:F('Carousel slide',1080,1080,'social'),
  story:F('Story / Reel',1080,1920,'social'), portrait:F('Portrait feed post',1080,1350,'social'), ytthumb:F('YouTube thumbnail',1280,720,'social'),
  xheader:F('X header',1500,500,'banner'), licover:F('LinkedIn personal cover',1584,396,'banner'), licompany:F('LinkedIn company cover',1128,191,'banner'),
  fbcover:F('Facebook cover',1640,624,'banner'), fbevent:F('Facebook event cover',1920,1005,'banner'), ytbanner:F('YouTube channel banner',2560,1440,'banner'),
  twitch:F('Twitch banner',1200,480,'banner'), podcast:F('Podcast cover',1080,1080,'banner',{ ex:3000 }), nlheader:F('Newsletter header',1200,400,'banner'),
  webbanner:F('Website banner',1920,600,'banner'), eventbanner:F('Event banner',1920,1080,'banner'), community:F('Community banner (Discord/WhatsApp)',960,540,'banner'),
  avatar:F('Avatar',400,400,'avatar'),
  adsq:F('Ad · Feed square',1080,1080,'ad'), adpt:F('Ad · Feed portrait',1080,1350,'ad'), adst:F('Ad · Story',1080,1920,'ad'), adlink:F('Ad · Link (FB/LinkedIn)',1200,628,'ad'),
  admrec:F('Ad · Medium rectangle',300,250,'ad',{ ex:600 }), adleader:F('Ad · Leaderboard',728,90,'ad',{ ex:1456 }), adsky:F('Ad · Wide skyscraper',160,600,'ad',{ ex:320 }),
  adbill:F('Ad · Billboard',970,250,'ad',{ ex:1940 }), admob:F('Ad · Mobile banner',320,50,'ad',{ ex:640 }),
  email:F('Email (600 wide)',600,1400,'email',{ ex:1200 }),
  webhero:F('Web · Desktop hero',1440,900,'web'), websection:F('Web · Section',1440,1100,'web'), webmobile:F('Web · Mobile screen',390,844,'web',{ ex:1170 }), web404:F('Web · Error page',1440,700,'web'),
  xarticle:F('X article image (5:2)',1500,600,'editorial',{ ex:2000 }), liarticle:F('LinkedIn article cover',1920,1080,'editorial'), lipost:F('LinkedIn post image',1200,627,'editorial'),
  medium:F('Medium article header',1400,788,'editorial'), articlehero:F('Website article hero',1600,900,'editorial'), blogpromo:F('Blog promotion (OG)',1200,630,'editorial'),
  nlpromo:F('Newsletter promotion',1200,600,'editorial'), pinterest:F('Pinterest pin',1000,1500,'editorial'),
};
const PAGE_SIZES = { a4:{ label:'A4 portrait', w:794, h:1123 }, letter:{ label:'US Letter', w:816, h:1056 }, a5:{ label:'A5', w:559, h:794 }, ebook:{ label:'Ebook 6×9 in', w:576, h:864 }, slide169:{ label:'Slide 16:9', w:1920, h:1080 }, slide43:{ label:'Slide 4:3', w:1440, h:1080 } };

/* ---------- graphic variant copy (brand voice; unknown facts as [to confirm]) ---------- */
const it = (...a) => a;
const V = {
  announce:{ name:'Announcement', theme:'cocoa', media:'arch', ring:1, photo:PH.cake, items:[it('logo'),it('label','Announcement'),it('title','Something sweet is coming'),it('sub','[Announcement details to confirm] — watch this space.'),it('cta','Turn on notifications')] },
  product:{ name:'Product spotlight', media:'full', photo:PH.cake, items:[it('label','Celebration cakes'),it('title','Pink, gold and a whole lot of love'),it('cta','Plan a celebration cake')] },
  update:{ name:'Product update', theme:'cream', media:'side', photo:PH.bread, items:[it('logo'),it('label','Menu update'),it('title','Now on the menu: Classic Banana Bread'),it('sub','Soft crumb, golden crust. Sliced or whole — [sizes to confirm].'),it('cta','Reserve yours')] },
  launch:{ name:'Launch', theme:'cocoa', media:'arch', ring:1, photo:PH.donut, items:[it('logo'),it('label','New'),it('title','Fresh out of the oven'),it('sub','Meet the newest treat on our menu. [Name and price to confirm]'),it('cta','Order on WhatsApp')] },
  testimonial:{ name:'Testimonial', theme:'cream', items:[it('logo'),it('quotemark'),it('quote','[Paste a genuine customer review here, shared with their permission.]'),it('author','— [Customer name], [occasion]'),it('ribbon')] },
  educational:{ name:'Educational tip', theme:'cream', items:[it('logo'),it('label','Cake care tip'),it('title','How to store your celebration cake'),it('list','Keep it cool and out of direct sun\nCover cut sides to keep the crumb soft\n[Storage time to confirm]'),it('handle',HANDLE)] },
  statistic:{ name:'Statistic', theme:'cocoa', items:[it('logo'),it('label','By the numbers'),it('stat','[00]'),it('sub','[Verified figure to confirm — e.g. celebration cakes baked this year]'),it('handle',HANDLE)] },
  promo:{ name:'Promo offer', theme:'cocoa', media:'arch', ring:1, photo:PH.pastry, items:[it('logo'),it('label','Limited offer'),it('title','[Offer to confirm]'),it('sub','On [product] this [period]. Terms apply.'),it('cta','Order now')] },
  cta:{ name:'Call to action', theme:'cream', media:'side', photo:PH.chops, items:[it('logo'),it('title','Party platters, sorted.'),it('sub','Small chops packed to share. Send your date and headcount.'),it('cta','Order on WhatsApp'),it('handle','0813 107 7321')] },
  menu:{ name:'Menu list', theme:'cream', items:[it('logo'),it('label','On the menu'),it('title','Something sweet for every craving'),it('list','Celebration cakes\nPastries & banana bread\nSmall chops & snacks\nYogurt & yogurt fura'),it('cta','Browse the menu')] },
  founder:{ name:'Founder story', theme:'cream', media:'arch', photo:PH.cake, items:[it('logo'),it('label','Our story'),it('title','Good food brings people together'),it('sub','[Owner to add real founding details.]'),it('handle',HANDLE)] },
  celebration:{ name:'Celebration', theme:'cream', media:'arch', ring:1, photo:PH.cake, items:[it('logo'),it('label','Happy birthday, [name]'),it('title','Your day, your cake, done beautifully'),it('ribbon'),it('handle',HANDLE)] },
  comparison:{ name:'Comparison', theme:'cream', items:[it('logo'),it('label','Which suits you?'),it('title','Slices or a whole cake?'),it('cols','Slices\nA treat-yourself afternoon, ready when you are.','Whole cakes\nMade to order for your celebration. [Lead time to confirm]'),it('handle',HANDLE)] },
  bts:{ name:'Behind the scenes', media:'full', photo:PH.pastry, items:[it('label','Behind the scenes'),it('title','Made with care, batch by batch'),it('handle',HANDLE)] },
  seasonal:{ name:'Seasonal greeting', theme:'cocoa', align:'center', items:[it('logo'),it('label','From all of us'),it('title','Wishing you a sweet [holiday]'),it('ribbon'),it('handle','Treats by MMA')] },
  notice:{ name:'Notice / opening hours', theme:'white', items:[it('logo'),it('label','Please note'),it('title','Order cut-off for [date]'),it('list','Celebration cakes: [lead time to confirm]\nPlatters: [lead time to confirm]\nPickup: Festmed Primary School, Gwuzunu, Suleja'),it('cta','Message us early')] },
  poll:{ name:'Poll — A or B', theme:'cream', items:[it('logo'),it('label','Poll'),it('title','Banana bread or doughnuts?'),it('option','A','Classic banana bread'),it('option','B','Glazed doughnuts'),it('handle','Vote in the comments')] },
  thisorthat:{ name:'This or that', theme:'cocoa', items:[it('logo'),it('title','This or that?'),it('cols','Yogurt fura\nChilled, creamy, fresh.','Small chops\nParty-ready crunch.'),it('handle','Tell us below')] },
  question:{ name:'Question box', theme:'cream', media:'side', photo:PH.donut, items:[it('logo'),it('label','Your turn'),it('title','What should we bake next?'),it('sub','Tell us in the comments — we read every one.')] },
  fillblank:{ name:'Fill in the blank', theme:'cocoa', align:'center', items:[it('logo'),it('title','My perfect birthday cake is ______.'),it('ribbon'),it('handle','Finish the sentence below')] },
  captionthis:{ name:'Caption this', media:'full', photo:PH.donut, items:[it('label','Caption this'),it('title','Best caption gets a shout-out'),it('handle',HANDLE)] },
  spotlight:{ name:'Community spotlight', theme:'cream', media:'arch', ring:1, photo:PH.chops, items:[it('logo'),it('label','Community spotlight'),it('title','[Customer or partner name]'),it('sub','[Why we are celebrating them — shared with permission.]')] },
  rateit:{ name:'Rate it', media:'full', photo:PH.cake, items:[it('label','Rate it'),it('title','1 to 10 — how would you rate this drip cake?'),it('handle','Drop your score below')] },
  countdown:{ name:'Promo countdown', theme:'cocoa', media:'arch', ring:1, photo:PH.pastry, items:[it('logo'),it('label','Offer ends in'),it('stat','[3 days]'),it('sub','[Offer to confirm]'),it('cta','Order now')] },
  steps:{ name:'How to order', theme:'cream', items:[it('logo'),it('label','How to order'),it('title','Three easy steps'),it('list','Message us on WhatsApp with your date\nWe confirm design, price and pickup time\nCollect or arrange delivery [to confirm]'),it('cta','Order on WhatsApp')] },
  brand:{ name:'Brand', theme:'cream', media:'arch', photo:PH.cake, items:[it('logo'),it('title','Treats that make the moment.'),it('sub','Cakes, pastries, small chops & yogurt fura · Suleja, Abuja'),it('cta','Order on WhatsApp')] },
  event:{ name:'Event', theme:'cocoa', media:'arch', ring:1, photo:PH.chops, items:[it('logo'),it('label','[Event date to confirm]'),it('title','[Event name]'),it('sub','Join us at [venue]. [Details to confirm]'),it('cta','Save the date')] },
  process:{ name:'Process / recipe', media:'full', photo:PH.bread, items:[it('label','In the kitchen'),it('title','How we bake banana bread'),it('handle',HANDLE)] },
  reveal:{ name:'Product reveal', theme:'cocoa', media:'arch', ring:1, photo:PH.cake, items:[it('label','The big reveal'),it('title','The pink drip cake')] },
  tutorial:{ name:'Tutorial', theme:'cream', media:'side', photo:PH.cake, items:[it('label','Tutorial'),it('title','3 cake care tips')] },
  vlog:{ name:'Vlog', media:'full', photo:PH.pastry, items:[it('label','Vlog'),it('title','A day in our kitchen')] },
  adproduct:{ name:'Product ad', media:'full', photo:PH.bread, items:[it('label','Classic Banana Bread'),it('title','Soft crumb, golden crust'),it('cta','Reserve yours')] },
  adoffer:{ name:'Offer ad', theme:'cocoa', media:'arch', ring:1, photo:PH.donut, items:[it('logo'),it('label','Limited offer'),it('title','[Offer to confirm]'),it('cta','Order now')] },
  adcake:{ name:'Celebration cake ad', theme:'cream', media:'arch', ring:1, photo:PH.cake, items:[it('logo'),it('title','Your day, your cake'),it('sub','Custom celebration cakes · Suleja, Abuja'),it('cta','Plan a cake')] },
  adplatter:{ name:'Small chops platter ad', theme:'cream', media:'side', photo:PH.chops, items:[it('logo'),it('title','Party platters, sorted.'),it('sub','Packed to share. [Sizes to confirm]'),it('cta','Order on WhatsApp')] },
  edcocoa:{ name:'Editorial · Cocoa', theme:'cocoa', media:'arch', ring:1, photo:PH.cake, items:[it('logo'),it('label','From the Treats by MMA kitchen'),it('title','Article title goes here'),it('sub','Optional subtitle that tells readers what they will learn.')] },
  edcream:{ name:'Editorial · Cream', theme:'cream', media:'side', photo:PH.bread, items:[it('logo'),it('label','Journal'),it('title','Article title goes here'),it('sub','Optional subtitle that tells readers what they will learn.'),it('ribbon')] },
  edphoto:{ name:'Editorial · Photo', media:'full', photo:PH.pastry, items:[it('label','Read the article'),it('title','Article title goes here'),it('sub','Optional subtitle that tells readers what they will learn.')] },
  edtype:{ name:'Editorial · Type only', theme:'white', items:[it('logo'),it('label','New article'),it('title','Article title goes here'),it('sub','Optional subtitle that tells readers what they will learn.'),it('ribbon')] },
};
const AVATARS = {
  'logo-cream':{ name:'Full logo on cream', bg:C.cream, kind:'full', tile:C.cream, pad:0 },
  'mark-cream':{ name:'Monogram on cream', bg:C.cream, kind:'mark', tile:C.cream, pad:0.08, circle:1 },
  'mark-cocoa':{ name:'Monogram on cocoa', bg:C.cocoa, kind:'mark', tile:C.cream, pad:0.12, circle:1 },
  'mark-gold':{ name:'Monogram · gold ring', bg:C.cocoa, kind:'mark', tile:C.cream, pad:0.13, circle:1, ring:C.gold },
  'mark-pink':{ name:'Monogram · pink ring', bg:C.cream, kind:'mark', tile:C.cream0, pad:0.13, circle:1, ring:C.pink },
  'initials':{ name:'MMA initials on cocoa', bg:C.cocoa, kind:'initials', ring:C.gold },
};

/* ---------- document types ---------- */
const K = (label, layout, c, ex) => Object.assign({ label, layout, c }, ex || {});
const tbd = (s) => '[' + s + ']';
const P2 = (a, b) => a + '\n\n' + b;
const DOCS = {
  ebook:{ label:'Ebook / book', size:'ebook', justify:true, seq:['cover','titlepage','copyright','dedication','epigraph','toc','foreword','introduction','part','chapter','body','pullquote','section','figure','callout','takeaways','exercise','chapter','body','table','casestudy','summary','conclusion','appendix','references','acknowledgements','author','finalcta','backcover'], kinds:{
    cover:K('Cover','cover',{ label:'An ebook by Treats by MMA', title:'Sweet Moments, Made with Care', sub:'[Subtitle to confirm]', meta:'[Author name]' }, { numbered:false }),
    titlepage:K('Title page','titlepage',{ title:'Sweet Moments, Made with Care', sub:'[Subtitle to confirm]', meta:'[Author name] · Treats by MMA' }, { numbered:false }),
    copyright:K('Copyright','copyright',{ body:'Copyright © [year] Treats by MMA. All rights reserved.\n\nNo part of this publication may be reproduced without written permission, except brief quotations in reviews.\n\n[ISBN to confirm]\n[Edition to confirm]\n\nFestmed Primary School, Gwuzunu, Kaduna Road, Suleja, Abuja.' }, { numbered:false }),
    dedication:K('Dedication','dedication',{ quote:'For everyone who has ever made a celebration feel special.' }, { numbered:false }),
    epigraph:K('Epigraph','epigraph',{ quote:'[Epigraph quotation]', author:'— [Source]' }, { numbered:false }),
    toc:K('Table of contents','toc',{ heading:'Contents', toc:'Generate from chapters|' }),
    foreword:K('Foreword','text',{ label:'Foreword', heading:'Foreword', body:P2('[Foreword written by a guest contributor. Introduce the author and why this book matters.]','[Continue the foreword here.]') }, { toc:1 }),
    preface:K('Preface','text',{ label:'Preface', heading:'Preface', body:'[Why this book was written and who it is for.]' }, { toc:1 }),
    introduction:K('Introduction','text',{ label:'Introduction', heading:'Introduction', body:P2('Good food brings people together. [Open with the core idea of the book.]','[Explain what the reader will learn, chapter by chapter.]') }, { toc:1 }),
    part:K('Part divider','opener',{ label:'Part One', title:'[Part title]', sub:'[One-line summary of this part]' }, { toc:1, dark:1, numbered:false }),
    chapter:K('Chapter opener','opener',{ label:'Chapter [n]', title:'[Chapter title]', sub:'[Chapter introduction in one or two sentences.]' }, { toc:1 }),
    body:K('Body text','text',{ heading:'[Section heading]', body:P2('[Body paragraph. Describe food with the senses — soft crumb, golden crust — rather than superlatives.]','[Continue the chapter here. Use "Flow overflow to new page" when text runs past the page.]') }),
    section:K('Section + subsection','sections',{ heading:'[Section heading]', blocks:[['[Subsection]','[Subsection text.]'],['[Subsection]','[Subsection text.]']] }),
    pullquote:K('Pull quote','quote',{ quote:'[A line from this chapter worth repeating.]', author:'— [Attribution]' }),
    callout:K('Callout / note','callout',{ heading:'[Section heading]', body:'[Context for the note below.]', boxh:'Note', box:'[Tip, warning or aside for the reader.]' }),
    figure:K('Image / figure','figure',{ heading:'[Figure heading]', img:PH.bread, caption:'Figure [n]: [Caption]. Conceptual image.', body:'[Text that refers to the figure.]' }),
    table:K('Table','table',{ heading:'[Table heading]', body:'[Introduce the table.]', table:'Item | Detail | Note\n[Item] | [Detail] | [Note]\n[Item] | [Detail] | [Note]\n[Item] | [Detail] | [Note]', caption:'Table [n]: [Caption]' }),
    list:K('List','list',{ heading:'[List heading]', list:'[First point]\n[Second point]\n[Third point]' }),
    casestudy:K('Case study','callout',{ heading:'Case study: [Title]', body:'[Background of the case.]', boxh:'What happened', box:'[Describe the situation, actions and outcome. Use only verified details.]' }),
    exercise:K('Exercise','callout',{ heading:'Exercise', body:'[Instructions for the reader.]', boxh:'Try this', box:'1. [Step]\n2. [Step]\n3. [Step]' }),
    reflection:K('Reflection','callout',{ heading:'Reflection', body:'[Prompt the reader to think about the chapter.]', boxh:'Ask yourself', box:'[Reflection question]' }),
    takeaways:K('Key takeaways','list',{ heading:'Key takeaways', list:'[Takeaway one]\n[Takeaway two]\n[Takeaway three]' }),
    summary:K('Chapter summary','text',{ label:'Summary', heading:'Chapter summary', body:'[Summarise the chapter in a short paragraph.]' }),
    conclusion:K('Conclusion','text',{ label:'Conclusion', heading:'Conclusion', body:'[Bring the ideas together and leave the reader with a clear next step.]' }, { toc:1 }),
    appendix:K('Appendix','text',{ label:'Appendix', heading:'Appendix A', body:'[Supporting material.]' }, { toc:1 }),
    references:K('References','list',{ heading:'References', list:'[Author, Title, Year]\n[Author, Title, Year]' }, { toc:1 }),
    bibliography:K('Bibliography','list',{ heading:'Bibliography', list:'[Author, Title, Publisher, Year]' }, { toc:1 }),
    acknowledgements:K('Acknowledgements','text',{ heading:'Acknowledgements', body:'[Thank the people who made this book possible.]' }, { toc:1 }),
    author:K('About the author','figure',{ heading:'About the author', img:'', caption:'[Author photo]', body:'[Author biography — owner to supply real details.]' }, { toc:1 }),
    finalcta:K('Final call to action','closing',{ title:'Ready for something sweet?', sub:'Send us your date and we will take it from there.', cta:'Order on WhatsApp', handle:WA }, { numbered:false }),
    backcover:K('Back cover','back',{ quote:'[Back-cover blurb: two or three sentences that tell readers why this book is worth their time.]', meta:HANDLE + ' · ' + WA }, { numbered:false }),
  } },
  report:{ label:'Report', size:'a4', seq:['cover','toc','execsummary','introduction','methodology','research','analysis','findings','stats','chart','table','recommendations','conclusion','appendix','references'], kinds:{
    cover:K('Cover','cover',{ label:'Report · [Month Year]', title:'[Report title]', sub:'[What this report covers]', meta:'Prepared by Treats by MMA' }, { numbered:false }),
    toc:K('Table of contents','toc',{ heading:'Contents', toc:'Generate from sections|' }),
    execsummary:K('Executive summary','text',{ label:'01', heading:'Executive summary', body:'[The headline findings and recommendations in three or four short paragraphs.]' }, { toc:1 }),
    introduction:K('Introduction','text',{ label:'02', heading:'Introduction', body:'[Purpose, scope and audience of the report.]' }, { toc:1 }),
    methodology:K('Methodology','text',{ label:'03', heading:'Methodology', body:'[How information was gathered. State sources and dates.]' }, { toc:1 }),
    research:K('Research','text',{ label:'04', heading:'Research', body:'[Research summary. Use only verified data.]' }, { toc:1 }),
    analysis:K('Analysis','twocol',{ heading:'Analysis', cols:['Strengths\n[Point]\n[Point]','Opportunities\n[Point]\n[Point]'] }, { toc:1 }),
    findings:K('Key findings','list',{ heading:'Key findings', list:'[Finding one]\n[Finding two]\n[Finding three]' }, { toc:1 }),
    stats:K('Statistics','stats',{ heading:'At a glance', cards:[['[00]','[Metric]'],['[00%]','[Metric]'],['[00]','[Metric]']] }),
    chart:K('Data visualisation','chart',{ heading:'[Chart title]', chart:'Cakes: 40\nPastries: 25\nSmall chops: 20\nYogurt & fura: 15', caption:'Illustrative data — replace with verified figures.' }),
    table:K('Data table','table',{ heading:'[Table title]', body:'', table:'Category | Q1 | Q2\n[Category] | [00] | [00]\n[Category] | [00] | [00]', caption:'Source: [to confirm]' }),
    recommendations:K('Recommendations','list',{ heading:'Recommendations', list:'[Recommendation one]\n[Recommendation two]\n[Recommendation three]' }, { toc:1 }),
    conclusion:K('Conclusion','text',{ heading:'Conclusion', body:'[Close the report with the main point and next steps.]' }, { toc:1 }),
    appendix:K('Appendix','text',{ heading:'Appendix', body:'[Supporting tables, notes or raw data.]' }, { toc:1 }),
    references:K('References','list',{ heading:'References', list:'[Source, date]\n[Source, date]' }, { toc:1 }),
  } },
  whitepaper:{ label:'Whitepaper', size:'a4', seq:['cover','abstract','problem','research','evidence','chart','framework','casestudy','recommendations','conclusion','references','about'], kinds:{
    cover:K('Cover','cover',{ label:'Whitepaper', title:'[Whitepaper title]', sub:'[The question this paper answers]', meta:'Treats by MMA · [Date]' }, { numbered:false }),
    abstract:K('Abstract','text',{ heading:'Abstract', body:'[A one-paragraph summary of the problem, approach and conclusion.]' }, { toc:1 }),
    problem:K('Problem statement','callout',{ heading:'The problem', body:'[Describe the problem clearly.]', boxh:'Why it matters', box:'[Impact on customers or the business.]' }, { toc:1 }),
    research:K('Research','text',{ heading:'Research', body:'[What the research shows. Cite sources.]' }, { toc:1 }),
    evidence:K('Evidence','stats',{ heading:'Evidence', cards:[['[00%]','[Verified data point]'],['[00]','[Verified data point]'],['[00x]','[Verified data point]']] }, { toc:1 }),
    chart:K('Chart','chart',{ heading:'[Chart title]', chart:'[Label]: 60\n[Label]: 30\n[Label]: 10', caption:'Illustrative data.' }),
    framework:K('Solution framework','sections',{ heading:'Solution framework', blocks:[['1 · [Pillar]','[Description]'],['2 · [Pillar]','[Description]'],['3 · [Pillar]','[Description]']] }, { toc:1 }),
    casestudy:K('Case study','callout',{ heading:'Case study', body:'[Context]', boxh:'Result', box:'[Verified outcome]' }, { toc:1 }),
    recommendations:K('Recommendations','list',{ heading:'Recommendations', list:'[Recommendation]\n[Recommendation]\n[Recommendation]' }, { toc:1 }),
    conclusion:K('Conclusion','text',{ heading:'Conclusion', body:'[Summary and call to action.]' }, { toc:1 }),
    references:K('References','list',{ heading:'References', list:'[Source]\n[Source]' }),
    about:K('About / CTA','closing',{ title:'About Treats by MMA', sub:'A warm, dependable treats kitchen in Suleja, Abuja.', cta:'Get in touch', handle:WA }, { numbered:false }),
  } },
  proposal:{ label:'Proposal', size:'a4', seq:['cover','client','overview','objectives','scope','deliverables','timeline','team','pricing','terms','testimonial','nextsteps'], kinds:{
    cover:K('Cover','cover',{ label:'Proposal for [Client name]', title:'[Event] catering & celebration cake', sub:'[Date of event]', meta:'Prepared by Treats by MMA · [Date]' }, { numbered:false }),
    client:K('Client & project info','sections',{ heading:'Client & project', blocks:[['Client','[Client name]\n[Contact person]'],['Event','[Event type], [date], [venue]'],['Guests','[Headcount]']] }),
    overview:K('Project overview','text',{ heading:'Overview', body:'[What you are proposing and why it fits the occasion.]' }),
    objectives:K('Objectives','list',{ heading:'Objectives', list:'[Objective]\n[Objective]\n[Objective]' }),
    scope:K('Scope of work','twocol',{ heading:'Scope', cols:['Included\n[Item]\n[Item]','Not included\n[Item]\n[Item]'] }),
    deliverables:K('Deliverables','table',{ heading:'Deliverables', body:'', table:'Item | Quantity | Notes\n[Celebration cake] | [1] | [Design notes]\n[Small chops platter] | [00] | [Contents to confirm]\n[Yogurt fura] | [00] | [Size]', caption:'' }),
    timeline:K('Timeline & milestones','table',{ heading:'Timeline & milestones', body:'', table:'Milestone | Date\nDesign confirmed | [date]\nDeposit received | [date]\nTasting (optional) | [date]\nDelivery / pickup | [date]', caption:'' }),
    team:K('Team','team',{ heading:'Your team', cards:[['[Name]','[Role]',''],['[Name]','[Role]',''],['[Name]','[Role]','']] }),
    pricing:K('Pricing / investment','table',{ heading:'Investment', body:'All prices to be confirmed before acceptance.', table:'Item | Price\n[Item] | ₦[to confirm]\n[Item] | ₦[to confirm]\nTotal | ₦[to confirm]', caption:'' }),
    terms:K('Terms','list',{ heading:'Terms', list:'[Deposit terms to confirm]\n[Cancellation policy to confirm]\n[Delivery terms to confirm]' }),
    testimonial:K('Testimonial','quote',{ quote:'[Genuine client testimonial, with permission.]', author:'— [Client]' }),
    nextsteps:K('Next steps','closing',{ title:'Next steps', sub:'Confirm your date and we will take it from there.', cta:'Accept proposal', handle:WA }, { numbered:false }),
  } },
  casestudy:{ label:'Case study', size:'a4', seq:['cover','glance','context','challenge','solution','implementation','results','testimonial','lessons','cta'], kinds:{
    cover:K('Cover','cover',{ label:'Case study', title:'[Client]: [Outcome headline]', sub:'[One-line summary]', meta:'Treats by MMA' }, { numbered:false }),
    glance:K('At a glance','sections',{ heading:'At a glance', blocks:[['Client','[Client]'],['Occasion','[Occasion]'],['What we made','[Products]']] }),
    context:K('Customer context','text',{ heading:'Context', body:'[Who the customer is and what they needed.]' }),
    challenge:K('Challenge','callout',{ heading:'The challenge', body:'[What made this order special or difficult.]', boxh:'In their words', box:'[Customer quote, with permission]' }),
    solution:K('Solution','text',{ heading:'Our solution', body:'[How we approached it.]' }),
    implementation:K('Implementation','table',{ heading:'How it came together', body:'', table:'Step | Detail\n[Step] | [Detail]\n[Step] | [Detail]', caption:'' }),
    results:K('Results & metrics','stats',{ heading:'Results', cards:[['[00]','[Verified metric]'],['[00]','[Verified metric]'],['[00]','[Verified metric]']] }),
    testimonial:K('Testimonial','quote',{ quote:'[Genuine customer testimonial.]', author:'— [Customer]' }),
    lessons:K('Lessons learned','list',{ heading:'What we learned', list:'[Lesson]\n[Lesson]' }),
    cta:K('Call to action','closing',{ title:'Planning something similar?', sub:'Send us your date and we will take it from there.', cta:'Order on WhatsApp', handle:WA }, { numbered:false }),
  } },
  presentation:{ label:'Presentation', size:'slide169', slides:true, seq:['cover','agenda','divider','problem','insight','data','chart','comparison','framework','process','timeline','casestudy','quote','team','pricing','summary','closing'], kinds:{
    cover:K('Cover','cover',{ label:'Treats by MMA', title:'[Presentation title]', sub:'[Subtitle]', meta:'[Presenter] · [Date]' }, { numbered:false }),
    agenda:K('Agenda','list',{ heading:'Agenda', list:'[Topic one]\n[Topic two]\n[Topic three]\n[Topic four]' }),
    divider:K('Section divider','opener',{ label:'Section [n]', title:'[Section title]', sub:'' }, { dark:1 }),
    problem:K('Problem','callout',{ heading:'The problem', body:'[Describe the problem in one sentence.]', boxh:'Why now', box:'[Context]' }),
    insight:K('Insight','quote',{ quote:'[The one insight your audience should remember.]', author:'' }),
    data:K('Data / statistics','stats',{ heading:'[Data headline]', cards:[['[00]','[Metric]'],['[00%]','[Metric]'],['[00]','[Metric]']] }),
    chart:K('Chart','chart',{ heading:'[Chart title]', chart:'Cakes: 40\nPastries: 25\nSmall chops: 20\nYogurt & fura: 15', caption:'Illustrative data.' }),
    comparison:K('Comparison','twocol',{ heading:'[Comparison title]', cols:['Option A\n[Point]\n[Point]','Option B\n[Point]\n[Point]'] }),
    framework:K('Framework','stats',{ heading:'[Framework name]', cards:[['1','[Pillar]'],['2','[Pillar]'],['3','[Pillar]']] }),
    process:K('Process','stats',{ heading:'How it works', cards:[['01','Message us with your date'],['02','We confirm design & price'],['03','Pickup or delivery [to confirm]']] }),
    timeline:K('Timeline','table',{ heading:'Timeline', body:'', table:'When | What\n[Date] | [Milestone]\n[Date] | [Milestone]\n[Date] | [Milestone]', caption:'' }),
    casestudy:K('Case study','figure',{ heading:'Case study: [Title]', img:PH.cake, caption:'Conceptual image.', body:'[Context, approach and verified outcome.]' }),
    quote:K('Quote','quote',{ quote:'[Genuine customer quote.]', author:'— [Customer]' }),
    team:K('Team','team',{ heading:'The team', cards:[['[Name]','[Role]',''],['[Name]','[Role]',''],['[Name]','[Role]','']] }),
    pricing:K('Pricing','table',{ heading:'Pricing', body:'', table:'Package | Includes | Price\n[Package] | [Items] | ₦[to confirm]\n[Package] | [Items] | ₦[to confirm]', caption:'Prices to be confirmed.' }),
    summary:K('Summary','list',{ heading:'Summary', list:'[Key point]\n[Key point]\n[Key point]' }),
    closing:K('Closing','closing',{ title:'Thank you', sub:'Questions? We would love to hear from you.', cta:'Order on WhatsApp', handle:HANDLE + ' · ' + WA }, { numbered:false }),
  } },
  article:{ label:'Article / blog post', size:'a4', seq:['hero','body','image','quote','stat','callout','list','gallery','chart','conclusion','related','authorbio','cta'], kinds:{
    hero:K('Hero + title + author/meta','hero',{ img:PH.bread, label:'Journal · [Category]', title:'[Article title]', meta:'By [Author] · [Date] · [0] min read', body:'[Standfirst: one or two sentences that set up the article.]' }, { numbered:false }),
    body:K('Body text','text',{ heading:'[Subheading]', body:P2('[Body paragraph.]','[Body paragraph.]') }),
    image:K('Image','figure',{ heading:'', img:PH.pastry, caption:'[Caption]. Conceptual image.', body:'[Text continues.]' }),
    gallery:K('Gallery','gallery',{ heading:'[Gallery title]', gallery:[PH.cake,PH.bread,PH.chops,PH.fura] }),
    quote:K('Quote','quote',{ quote:'[Pull quote from the article.]', author:'— [Source]' }),
    stat:K('Statistic','stats',{ heading:'[Stat headline]', cards:[['[00]','[Verified figure]'],['[00%]','[Verified figure]']] }),
    chart:K('Chart','chart',{ heading:'[Chart title]', chart:'[Label]: 50\n[Label]: 30\n[Label]: 20', caption:'Illustrative data.' }),
    callout:K('Callout','callout',{ heading:'[Subheading]', body:'[Text]', boxh:'Good to know', box:'[Callout text]' }),
    list:K('List','list',{ heading:'[List heading]', list:'[Item]\n[Item]\n[Item]' }),
    conclusion:K('Conclusion','text',{ heading:'In short', body:'[Conclusion.]' }),
    related:K('Related content','cards',{ heading:'Keep reading', cards:[['[Related article]','[One-line summary]',PH.cake],['[Related article]','[One-line summary]',PH.donut],['[Related article]','[One-line summary]',PH.fura]] }),
    authorbio:K('Author bio','figure',{ heading:'About the author', img:'', caption:'[Author photo]', body:'[Short author bio.]' }),
    cta:K('Call to action','closing',{ title:'Something sweet for every craving', sub:'Message us to reserve yours.', cta:'Order on WhatsApp', handle:WA }, { numbered:false }),
  } },
  newsletter:{ label:'Newsletter', size:'a4', seq:['header','featured','articles','announcement','event','quote','image','stat','cta','footer'], kinds:{
    header:K('Header + introduction','nlheader',{ label:'Issue [00] · [Month Year]', title:'The Sweet Sheet', body:'Hi there! [Short, warm introduction to this issue.]' }, { numbered:false }),
    featured:K('Featured story','hero',{ img:PH.cake, label:'Featured', title:'[Featured story headline]', meta:'', body:'[Featured story summary.]' }),
    articles:K('Article blocks','cards',{ heading:'In this issue', cards:[['[Story]','[Summary]',PH.bread],['[Story]','[Summary]',PH.chops],['[Story]','[Summary]',PH.fura]] }),
    announcement:K('Announcement','callout',{ heading:'News', body:'[Context]', boxh:'Announcement', box:'[Announcement text]' }),
    event:K('Event block','sections',{ heading:'Coming up', blocks:[['[Event name]','[Date] · [Venue]\n[Details to confirm]']] }),
    quote:K('Quote','quote',{ quote:'[Genuine customer quote.]', author:'— [Customer]' }),
    image:K('Image block','figure',{ heading:'', img:PH.donut, caption:'[Caption]. Conceptual image.', body:'' }),
    stat:K('Statistic','stats',{ heading:'This month', cards:[['[00]','[Verified figure]'],['[00]','[Verified figure]']] }),
    cta:K('Call to action','closing',{ title:'Order for the weekend', sub:'Send your order by [day to confirm].', cta:'Order on WhatsApp', handle:WA }),
    footer:K('Footer','nlfooter',{ body:'Treats by MMA · Festmed Primary School, Gwuzunu, Kaduna Road, Suleja, Abuja\n' + WA + ' / 0815 585 6020\nInstagram @treats_by_mma · TikTok @.mmacakeandpastry · Facebook Eze Chinwendu\n[Unsubscribe / preferences link]' }, { numbered:false }),
  } },
  resume:{ label:'Resume / CV', size:'a4', seq:['header','experience','skills','more'], kinds:{
    header:K('Header + profile + contact','resumehead',{ title:'[Full Name]', sub:'[Professional title]', meta:'[Phone] · [Email] · [Location] · [Portfolio]', blocks:[['Profile','[Two-sentence professional profile.]'],['Summary','[Career summary: what you do best and the results you deliver.]']] }, { numbered:false }),
    experience:K('Experience + education','sections',{ heading:'Experience', blocks:[['[Role] · [Company] · [Years]','• [Achievement]\n• [Achievement]'],['[Role] · [Company] · [Years]','• [Achievement]\n• [Achievement]'],['Education','[Qualification], [Institution], [Year]']] }),
    skills:K('Skills + certifications + projects','sections',{ heading:'Skills & credentials', blocks:[['Skills','[Skill] · [Skill] · [Skill]'],['Certifications','[Certification], [Year]'],['Projects','[Project] — [Outcome]']] }),
    more:K('Awards + publications + references','sections',{ heading:'More', blocks:[['Awards','[Award], [Year]'],['Publications','[Title], [Publisher], [Year]'],['References','Available on request']] }),
  } },
};

/* ---------- doc page layouts ---------- */
function docPage(dt, kindId, W, H, ed) {
  const D = DOCS[dt], k = D.kinds[kindId], c = k.c, wide = W > H;
  const base = Math.max(15, R(Math.sqrt(W * H) / (wide ? 48 : 59)));
  const m = R(wide ? W * 0.065 : W * 0.1), r = { x:m, y:m, w:W - 2*m, h:H - 2*m - (k.numbered === false ? 0 : base * 1.6) };
  const darkPage = ed === 'cocoa' && (k.layout === 'cover' || k.layout === 'opener' || k.layout === 'closing' || k.layout === 'back') || k.dark || k.layout === 'back' || k.layout === 'nlfooter';
  const th = darkPage ? TH.cocoa : TH[D.slides ? 'cream' : 'white']; const els = []; const o = { valign:'top', justify:D.justify, base };
  const split = (fr) => { const mr = { x:W*0.54, y:m, w:W*0.46 - m, h:H - 2*m }; const tr = { x:m, y:m, w:W*0.54 - m*1.6, h:H - 2*m }; return [mr, tr]; };
  switch (k.layout) {
    case 'cover':
      if (wide) { const [mr, tr] = split(); els.push(I('photo', PH.cake, { ...mr, frame:'arch', ring:darkPage ? C.gold : '', radius:R(base) })); stack(els, tr, [it('logo'),it('label',c.label),it('title',c.title),it('sub',c.sub),it('meta',c.meta)], th, base, { valign:'center' }); }
      else stack(els, { x:m, y:m, w:W - 2*m, h:H - 2*m }, [it('img',PH.cake,{ frame:'arch', ring:darkPage ? C.gold : '', flex:1.6 }),it('label',c.label),it('title',c.title),it('sub',c.sub),it('meta',c.meta),it('logo')], th, base, { valign:'top', logo:R(base*4.2) });
      break;
    case 'titlepage': stack(els, r, [it('title',c.title),it('sub',c.sub),it('ribbon'),it('meta',c.meta)], th, base, { valign:'center', align:'center', titleMax:3 }); break;
    case 'copyright': stack(els, r, [it('body',c.body)], th, R(base*0.85), { valign:'bottom' }); break;
    case 'dedication': stack(els, r, [it('quote',c.quote)], th, base, { valign:'center', align:'center', quoteMax:1.6 }); els.forEach((e) => { e.italic = true; e.font = 'body'; }); break;
    case 'epigraph': stack(els, r, [it('quote',c.quote),it('author',c.author)], th, base, { valign:'center', align:'center', quoteMax:1.6 }); break;
    case 'toc': stack(els, r, [it('heading',c.heading),it('ribbon'),it('toc',c.toc)], th, base, o); break;
    case 'opener': stack(els, r, [it('label',c.label),it('title',c.title),it('ribbon'),it('sub',c.sub)].filter((x) => x[1] !== ''), th, base, { valign:'center', align:wide ? 'left' : 'left', titleMax:wide ? 3.4 : 3 }); break;
    case 'text': stack(els, r, [c.label ? it('label',c.label) : null, it('heading',c.heading), it('bodyfill',c.body)].filter(Boolean), th, base, o); break;
    case 'sections': stack(els, r, [it('heading',c.heading),it('blocks',c.blocks)], th, base, o); break;
    case 'quote': stack(els, r, [it('quotemark'),it('quote',c.quote),c.author ? it('author',c.author) : null].filter(Boolean), th, base, { valign:'center', quoteMax:wide ? 2.6 : 2.2 }); break;
    case 'callout': stack(els, r, [it('heading',c.heading),it('body',c.body),it('box',c.boxh,c.box)], th, base, o); break;
    case 'figure':
      if (wide) { const [mr, tr] = split(); els.push(I('photo', c.img, { ...mr, frame:'round', radius:R(base) })); stack(els, tr, [it('heading',c.heading),it('body',c.body),it('meta',c.caption,null,'caption')], th, base, { valign:'center' }); }
      else stack(els, r, [c.heading ? it('heading',c.heading) : null, it('img',c.img), it('meta',c.caption,null,'caption'), c.body ? it('bodyfill',c.body,{ flex:1 }) : null].filter(Boolean), th, base, o);
      break;
    case 'table': stack(els, r, [it('heading',c.heading),c.body ? it('body',c.body) : null,it('table',c.table),c.caption ? it('meta',c.caption,null,'caption') : null].filter(Boolean), th, base, o); break;
    case 'chart': stack(els, r, [it('heading',c.heading),it('chart',c.chart),it('meta',c.caption,null,'caption')], th, base, o); break;
    case 'stats': stack(els, r, [it('heading',c.heading),it('cards',c.cards,{ stat:1, cols:wide ? c.cards.length : Math.min(c.cards.length, 2) })], th, base, o); break;
    case 'team': stack(els, r, [it('heading',c.heading),it('cards',c.cards,{ cols:3 })], th, base, o); break;
    case 'cards': stack(els, r, [it('heading',c.heading),it('cards',c.cards,{ cols:wide ? 3 : 1 })], th, base, o); break;
    case 'list': stack(els, r, [it('heading',c.heading),it('ribbon'),it('list',c.list)], th, base, { ...o, listScale:wide ? 1.3 : 1.05 }); break;
    case 'twocol': stack(els, r, [it('heading',c.heading),it('cols',c.cols[0],c.cols[1])], th, base, o); break;
    case 'gallery': stack(els, r, [it('heading',c.heading),it('gallery',c.gallery)], th, base, o); break;
    case 'hero': stack(els, r, [it('img',c.img,{ flex:1.2 }),it('label',c.label),it('title',c.title,{ flex:0.6 }),c.meta ? it('meta',c.meta) : null,it('bodyfill',c.body,{ flex:0.5 })].filter(Boolean), th, base, { ...o, titleMax:2.6 }); break;
    case 'nlheader': stack(els, r, [it('logo'),it('label',c.label),it('title',c.title,{ flex:0.5 }),it('ribbon'),it('bodyfill',c.body)], th, base, { ...o, logo:R(base*5), titleMax:3 }); break;
    case 'nlfooter': stack(els, r, [it('logo'),it('ribbon'),it('body',c.body)], th, base, { valign:'center', align:'center', logo:R(base*5) }); break;
    case 'resumehead': stack(els, r, [it('title',c.title,{ flex:0.35 }),it('sub',c.sub),it('meta',c.meta),it('ribbon'),it('blocks',c.blocks)], th, base, { ...o, titleMax:2.6 }); break;
    case 'closing': stack(els, r, [it('logo'),it('title',c.title),it('sub',c.sub),it('cta',c.cta),it('handle',c.handle)], th, base, { valign:'center', align:'center', titleMax:wide ? 3.6 : 2.8, logo:R(base*(wide ? 6 : 5)) }); break;
    case 'back': stack(els, r, [it('logo'),it('quote',c.quote),it('ribbon'),it('meta',c.meta)], th, base, { valign:'center', align:'center', quoteMax:1.4, logo:R(base*5) }); break;
  }
  if (k.numbered !== false) els.push(PN({ x:m, y:H - m * 0.5 - base, w:W - 2*m, h:base * 1.2, size:R(base*0.75), color:th.muted }));
  els.forEach((e) => { e.x = R(e.x); e.y = R(e.y); e.w = R(e.w); e.h = R(e.h); });
  return { bg:th.bg, elements:els };
}

/* ---------- email & web (single page, stacked) ---------- */
const EMAILS = {
  welcome:{ name:'Welcome', items:[it('logo'),it('img',PH.cake,{ frame:'arch', flex:1.2 }),it('label','Welcome'),it('title','So glad you are here'),it('body','Thank you for joining Treats by MMA. Celebration cakes, pastries, small chops, yogurt and yogurt fura — familiar favourites, done beautifully.'),it('cta','Browse the menu'),it('ribbon'),it('meta','Treats by MMA · Suleja, Abuja · ' + WA + '\n[Unsubscribe link]')] },
  order:{ name:'Order confirmation', items:[it('logo'),it('label','Order received'),it('title','Your order is noted'),it('body','Hi [Name]! Thank you for reaching out to Treats by MMA. Your [item] for [date] is noted — we will confirm the price and pickup time shortly.'),it('table','Item | Qty | Price\n[Item] | [1] | ₦[to confirm]\n[Item] | [1] | ₦[to confirm]'),it('cta','Message us on WhatsApp'),it('meta','Pickup: Festmed Primary School, Gwuzunu, Kaduna Road, Suleja\n[Unsubscribe link]')] },
  ready:{ name:'Order ready', items:[it('logo'),it('img',PH.bread,{ flex:1 }),it('title','Your order is ready for pickup!'),it('body','See you soon. [Pickup hours to confirm]'),it('cta','Get directions'),it('meta','Treats by MMA · ' + WA)] },
  promo:{ name:'Promotion', theme:'cocoa', items:[it('logo'),it('label','Limited offer'),it('title','[Offer to confirm]'),it('img',PH.donut,{ frame:'arch', ring:C.gold, flex:1.2 }),it('body','On [product] this [period]. Terms apply.'),it('cta','Order now'),it('meta','[Unsubscribe link]')] },
  newsletter:{ name:'Newsletter', items:[it('logo'),it('label','The Sweet Sheet · Issue [00]'),it('title','Fresh out of the oven'),it('body','[Intro paragraph]'),it('cards',[['[Story]','[Summary]',PH.bread],['[Story]','[Summary]',PH.fura]],{ cols:2 }),it('cta','Read more'),it('meta','[Unsubscribe link]')] },
  event:{ name:'Event invitation', theme:'cocoa', items:[it('logo'),it('label','You are invited'),it('title','[Event name]'),it('img',PH.chops,{ frame:'round', flex:1 }),it('body','[Date] · [Venue]\n[Details to confirm]'),it('cta','RSVP on WhatsApp'),it('meta','[Unsubscribe link]')] },
  holiday:{ name:'Holiday hours', items:[it('logo'),it('label','Please note'),it('title','Holiday hours'),it('table','Day | Hours\n[Day] | [Hours to confirm]\n[Day] | [Hours to confirm]'),it('body','Order early to secure your date.'),it('cta','Order on WhatsApp'),it('meta','[Unsubscribe link]')] },
  feedback:{ name:'Feedback request', items:[it('logo'),it('title','How was your treat?'),it('body','We would love to hear what you thought. Your honest feedback helps us bake better.'),it('option','A','Loved it'),it('option','B','Could be better'),it('cta','Share feedback'),it('meta','[Unsubscribe link]')] },
};
const WEBS = {
  hero:{ name:'Landing hero', fmt:'webhero', v:{ theme:'cream', media:'arch', ring:1, photo:PH.cake, items:[it('logo'),it('label','Cakes, pastries & treats · Suleja, Abuja'),it('title','Your day, your cake, done beautifully.'),it('sub','Celebration cakes, banana bread, small chops, yogurt and yogurt fura — made with care.'),it('cta','Order on WhatsApp')] } },
  menu:{ name:'Menu section', fmt:'websection', stackItems:[it('label','Our menu'),it('heading','Something sweet for every craving'),it('cards',[['Celebration cakes','Custom and classic. [Prices to confirm]',PH.cake],['Pastries & banana bread','Soft, golden, fresh.',PH.bread],['Small chops','Party-ready platters.',PH.chops],['Yogurt & fura','Chilled and creamy.',PH.fura]],{ cols:4 }),it('cta','Browse the full menu')] },
  about:{ name:'About section', fmt:'webhero', v:{ theme:'white', media:'side', photo:PH.pastry, items:[it('label','Our story'),it('title','Good food brings people together'),it('sub','From a birthday cake that makes someone feel celebrated to a warm loaf on an ordinary afternoon, every treat is made with the same care. [Owner to add real founding details.]'),it('cta','Plan a celebration cake')] } },
  contact:{ name:'Contact & order', fmt:'webhero', stackItems:[it('label','Order'),it('heading','Send cake request'),it('cols','WhatsApp\n0813 107 7321\n0815 585 6020','Find us\nFestmed Primary School, Gwuzunu, Kaduna Road, Suleja, Abuja\nInstagram @treats_by_mma'),it('cta','Order on WhatsApp')] },
  cakes:{ name:'Celebration cakes page', fmt:'websection', v:{ theme:'cocoa', media:'arch', ring:1, photo:PH.cake, items:[it('logo'),it('label','Celebration cakes'),it('title','Pink, gold and a whole lot of love'),it('sub','Tell us the date, the occasion and the vibe. [Lead time and pricing to confirm]'),it('cta','Plan a celebration cake')] } },
  notfound:{ name:'Error / 404 page', fmt:'web404', v:{ theme:'cream', align:'center', items:[it('logo'),it('title','This page went out of the oven'),it('sub','The page you are looking for is not here. Let us get you back to the treats.'),it('cta','Back to the menu')] } },
  mobile:{ name:'Mobile home screen', fmt:'webmobile', v:{ theme:'cream', media:'arch', photo:PH.cake, items:[it('logo'),it('title','Something sweet for every craving'),it('sub','Cakes, pastries, small chops & fura.'),it('cta','Order on WhatsApp')] } },
};

/* ---------- registry ---------- */
const TEMPLATES = []; const BUILD = {};
const reg = (t, build) => { TEMPLATES.push(t); BUILD[t.id] = build; };
const page = (name, bg, elements, ex) => Object.assign({ id:nid('p'), name, bg, elements, numbered:false }, ex || {});
const graphicDoc = (t, fmt, pages) => ({ tpl:t.id, name:t.name, cat:t.cat, mode:'graphic', formatId:fmt, w:FORMATS[fmt].w, h:FORMATS[fmt].h, pages, pageNumbers:{ show:false, start:1 } });
const COMPOSE_FORMATS = Object.keys(FORMATS).filter((f) => FORMATS[f].group !== 'avatar' && FORMATS[f].group !== 'email');
const vpage = (vk, W, H, nm) => { const v = V[vk] || vk; const r = compose(W, H, v); return page(nm || v.name, r.bg, r.elements, { spec:vk }); };
const addSet = (cat, fmt, keys, sub) => keys.forEach((vk) => { const t = { id:fmt + ':' + vk, name:V[vk].name, cat, sub:sub || FORMATS[fmt].label, formatId:fmt, sizes:COMPOSE_FORMATS }; reg(t, (f) => { f = f || fmt; return graphicDoc(t, f, [vpage(vk, FORMATS[f].w, FORMATS[f].h)]); }); });
addSet('social','square',['announce','product','update','launch','testimonial','educational','statistic','promo','cta','menu','founder','celebration','comparison','bts','seasonal','notice']);
addSet('social','engage',['poll','thisorthat','question','fillblank','captionthis','spotlight','rateit']);
addSet('social','portrait',['product','promo','educational','celebration','testimonial','statistic','launch','founder','comparison','announce','update','spotlight']);
addSet('social','story',['announce','product','countdown','poll','question','testimonial','bts','steps','launch','cta','update','celebration']);
addSet('social','ytthumb',['process','reveal','comparison','tutorial','vlog','bts']);
const CAROUSELS = {
  educational:{ name:'Educational carousel', pages:[['Cover',{ theme:'cocoa', items:[it('logo'),it('label','Swipe →'),it('title','Cake care 101'),it('ribbon')] }],['Tip 1',{ theme:'cream', items:[it('label','Tip 1'),it('title','Keep it cool'),it('sub','Store your cake away from direct sun and heat.')] }],['Tip 2',{ theme:'cream', items:[it('label','Tip 2'),it('title','Cover cut sides'),it('sub','It keeps the crumb soft for longer.')] }],['Tip 3',{ theme:'cream', items:[it('label','Tip 3'),it('title','Serve at room temperature'),it('sub','[Timing to confirm]')] }],['CTA',{ theme:'cocoa', items:[it('logo'),it('title','Planning a celebration?'),it('cta','Order on WhatsApp'),it('handle',HANDLE)] }]] },
  menu:{ name:'Menu carousel', pages:[['Cover',{ theme:'cocoa', items:[it('logo'),it('label','Swipe →'),it('title','Something sweet for every craving')] }],['Cakes',{ media:'full', photo:PH.cake, items:[it('label','Celebration cakes'),it('title','Custom & classic')] }],['Bakes',{ media:'full', photo:PH.bread, items:[it('label','Pastries & banana bread'),it('title','Soft crumb, golden crust')] }],['Small chops',{ media:'full', photo:PH.chops, items:[it('label','Small chops'),it('title','Party platters, sorted')] }],['Yogurt & fura',{ media:'full', photo:PH.fura, items:[it('label','Yogurt & fura'),it('title','Chilled, creamy, fresh')] }],['CTA',{ theme:'cream', items:[it('logo'),it('title','Order on WhatsApp'),it('sub','0813 107 7321 · 0815 585 6020')] }]] },
  launch:{ name:'Launch carousel', pages:[['Teaser',{ theme:'cocoa', items:[it('logo'),it('label','Coming soon'),it('title','Something new is in the oven')] }],['Reveal',{ media:'full', photo:PH.donut, items:[it('label','Introducing'),it('title','[Product name]')] }],['Details',{ theme:'cream', items:[it('label','The details'),it('title','[Product name]'),it('list','[Flavour to confirm]\n[Size to confirm]\n₦[Price to confirm]')] }],['CTA',{ theme:'cocoa', items:[it('logo'),it('title','Reserve yours'),it('cta','Order on WhatsApp')] }]] },
  order:{ name:'How to order carousel', pages:[['Cover',{ theme:'cocoa', items:[it('logo'),it('title','How to order'),it('label','Swipe →')] }],['Step 1',{ theme:'cream', items:[it('stat','1'),it('title','Message us on WhatsApp'),it('sub','Send your date, occasion and design ideas.')] }],['Step 2',{ theme:'cream', items:[it('stat','2'),it('title','We confirm the details'),it('sub','Design, price and pickup time.')] }],['Step 3',{ theme:'cream', items:[it('stat','3'),it('title','Pickup or delivery'),it('sub','[Delivery areas to confirm]')] }],['CTA',{ theme:'cocoa', items:[it('logo'),it('title','Ready when you are'),it('cta','0813 107 7321')] }]] },
  founder:{ name:'Founder story carousel', pages:[['Cover',{ theme:'cream', media:'arch', photo:PH.cake, items:[it('logo'),it('label','Our story'),it('title','How Treats by MMA began')] }],['Belief',{ theme:'cocoa', items:[it('quotemark'),it('quote','Good food brings people together.')] }],['Story',{ theme:'cream', items:[it('label','The beginning'),it('title','[Founding details to confirm]'),it('sub','[Owner to add real story.]')] }],['Values',{ theme:'cream', items:[it('label','What we value'),it('list','Quality in every batch\nWarm, honest service\nBeautiful presentation\nShared joy\nConsistency you can trust')] }],['CTA',{ theme:'cocoa', items:[it('logo'),it('title','Sweet moments, made with care.'),it('handle',HANDLE)] }]] },
  testimonials:{ name:'Testimonials carousel', pages:[['Cover',{ theme:'cocoa', items:[it('logo'),it('title','Kind words from our customers'),it('label','Swipe →')] }],['Review 1',{ theme:'cream', items:[it('quotemark'),it('quote','[Genuine review, with permission]'),it('author','— [Name]')] }],['Review 2',{ theme:'cream', items:[it('quotemark'),it('quote','[Genuine review, with permission]'),it('author','— [Name]')] }],['Review 3',{ theme:'cream', items:[it('quotemark'),it('quote','[Genuine review, with permission]'),it('author','— [Name]')] }],['CTA',{ theme:'cocoa', items:[it('logo'),it('title','Your turn?'),it('cta','Order on WhatsApp')] }]] },
};
Object.keys(CAROUSELS).forEach((ck) => { const cs = CAROUSELS[ck]; const t = { id:'carousel:' + ck, name:cs.name, cat:'social', sub:'Carousel · ' + cs.pages.length + ' slides · 1080 × 1080', formatId:'carousel', sizes:['carousel','portrait','square'], multi:1 };
  reg(t, (f) => { f = f || 'carousel'; const { w, h } = FORMATS[f]; return graphicDoc(t, f, cs.pages.map(([nm, v]) => vpage(v, w, h, nm))); }); });
['xheader','licover','licompany','fbcover','fbevent','ytbanner','twitch','podcast','nlheader','webbanner','eventbanner','community'].forEach((f) => addSet('banners', f, ['brand','promo','event']));
Object.keys(AVATARS).forEach((ak) => { const t = { id:'avatar:' + ak, name:AVATARS[ak].name, cat:'avatars', sub:'Avatar · 400 × 400', formatId:'avatar', sizes:['avatar'] }; reg(t, () => { const r = avatar(400, 400, AVATARS[ak]); return graphicDoc(t, 'avatar', [page(t.name, r.bg, r.elements, { spec:ak })]); }); });
['adsq','adpt','adst','adlink','admrec','adleader','adsky','adbill','admob'].forEach((f) => addSet('ads', f, ['adproduct','adoffer','adcake','adplatter']));
Object.keys(EMAILS).forEach((ek) => { const e = EMAILS[ek]; const t = { id:'email:' + ek, name:e.name, cat:'email', sub:'Email · 600 px wide', formatId:'email', sizes:['email'] };
  reg(t, () => { const W = 600, H = 1400, th = TH[e.theme || 'white'], els = []; stack(els, { x:40, y:40, w:520, h:H - 80 }, e.items, th, 20, { valign:'top', logo:110 }); return graphicDoc(t, 'email', [page(e.name, th.bg, els)]); }); });
Object.keys(WEBS).forEach((wk) => { const wb = WEBS[wk]; const t = { id:'web:' + wk, name:wb.name, cat:'web', sub:FORMATS[wb.fmt].label + ' · ' + FORMATS[wb.fmt].w + ' × ' + FORMATS[wb.fmt].h, formatId:wb.fmt, sizes:wb.v ? ['webhero','websection','webmobile','web404'] : [wb.fmt] };
  reg(t, (f) => { f = f || wb.fmt; const { w, h } = FORMATS[f]; if (wb.v) { const r = compose(w, h, wb.v); return graphicDoc(t, f, [page(wb.name, r.bg, r.elements, { spec:wb.v })]); }
    const els = [], m = R(w*0.06); stack(els, { x:m, y:m, w:w - 2*m, h:h - 2*m }, wb.stackItems, TH.white, 22, { valign:'top', align:'left' }); return graphicDoc(t, f, [page(wb.name, C.cream0, els)]); }); });
['xarticle','liarticle','lipost','medium','articlehero','blogpromo','nlpromo','pinterest'].forEach((f) => addSet('editorial', f, ['edcocoa','edcream','edphoto','edtype']));
Object.keys(DOCS).forEach((dt) => { const D = DOCS[dt]; [['cream','Cream edition'],['cocoa','Cocoa edition']].forEach(([ed, en]) => {
  const t = { id:'doc:' + dt + ':' + ed, name:D.label + ' · ' + en, cat:'documents', sub:D.seq.length + ' pages · ' + PAGE_SIZES[D.size].label, docType:dt, edition:ed, sizes:D.slides ? ['slide169','slide43'] : ['a4','letter','a5','ebook'] };
  reg(t, (sz) => { sz = sz || D.size; const { w, h } = PAGE_SIZES[sz]; let ch = 0;
    const pages = D.seq.map((kid) => { const pg = docPage(dt, kid, w, h, ed); const k = D.kinds[kid]; let nm = k.label; if (kid === 'chapter') { ch++; nm = 'Chapter ' + ch; pg.elements.forEach((e) => { if (e.key === 'label') e.text = 'Chapter ' + ch; }); }
      return page(nm, pg.bg, pg.elements, { kind:kid, numbered:k.numbered !== false, toc:!!k.toc }); });
    const rows = pages.map((p, i) => { if (!p.toc) return null; const h = p.elements.find((e) => e.key === 'title') || p.elements.find((e) => e.key === 'heading'); const lab = p.elements.find((e) => e.key === 'label'); let tt = ((h && h.text) || p.name).replace(/\n/g, ' '); if (lab && /^(chapter|part|section)/i.test(lab.text)) tt = lab.text + ' — ' + tt; return tt + '|' + (i + 1); }).filter(Boolean);
    pages.forEach((p) => p.elements.forEach((e) => { if (e.type === 'toc') e.text = rows.join('\n'); }));
    return { tpl:t.id, name:t.name, cat:'documents', mode:'doc', docType:dt, edition:ed, formatId:sz, w, h, pages, pageNumbers:{ show:true, start:1 } }; }); }); });

const CATS = [['social','Social posts'],['banners','Banners & covers'],['avatars','Avatars'],['ads','Advertising'],['email','Email'],['web','Web'],['editorial','Article & editorial'],['documents','Documents']];
const ELEMENT_KINDS = { text:'Text', image:'Image', shape:'Shape', logo:'Logo / mark', ribbon:'Ribbon rule', table:'Table', toc:'Contents list', chart:'Bar chart', pageno:'Page number' };

/* rebuild a single page from its kind/spec at new size, preserving content by key */
function relayout(doc, sizeId) {
  const nd = BUILD[doc.tpl](sizeId); const out = JSON.parse(JSON.stringify(doc)); out.formatId = nd.formatId; out.w = nd.w; out.h = nd.h;
  const sx = nd.w / doc.w, sy = nd.h / doc.h;
  out.pages = doc.pages.map((pg, i) => {
    let fresh = null;
    if (doc.mode === 'doc' && pg.kind) fresh = docPage(doc.docType, pg.kind, nd.w, nd.h, doc.edition);
    else if (pg.spec && V[pg.spec]) fresh = compose(nd.w, nd.h, V[pg.spec]);
    else if (pg.spec && typeof pg.spec === 'object') fresh = compose(nd.w, nd.h, pg.spec);
    else if (nd.pages[i]) fresh = { bg:nd.pages[i].bg, elements:nd.pages[i].elements };
    const scaled = (e) => Object.assign({}, e, { id:nid(), x:R(e.x*sx), y:R(e.y*sy), w:R(e.w*sx), h:R(e.h*sy), size:e.size ? R(e.size*Math.sqrt(sx*sy)) : e.size });
    if (!fresh) return Object.assign({}, pg, { elements:pg.elements.map(scaled) });
    const used = {}; const els = fresh.elements.map((fe) => { const old = pg.elements.find((e) => e.key === fe.key && !used[e.id]); if (!old) return fe; used[old.id] = 1;
      return Object.assign(fe, { text:old.text !== undefined ? old.text : fe.text, src:old.src !== undefined ? old.src : fe.src, color:old.color || fe.color, bg:old.bg !== undefined ? old.bg : fe.bg, fill:old.fill || fe.fill, font:old.font || fe.font, align:old.align || fe.align, weight:old.weight || fe.weight, variant:old.variant || fe.variant }); });
    pg.elements.forEach((e) => { if (!used[e.id] && e.user) els.push(scaled(e)); });
    return Object.assign({}, pg, { bg:pg.bg, elements:els });
  });
  return out;
}
function newPage(doc, kindId) {
  if (doc.mode === 'doc') { const D = DOCS[doc.docType], k = D.kinds[kindId]; const pg = docPage(doc.docType, kindId, doc.w, doc.h, doc.edition); return page(k.label, pg.bg, pg.elements, { kind:kindId, numbered:k.numbered !== false, toc:!!k.toc }); }
  const r = compose(doc.w, doc.h, V[kindId] || V.announce); return page((V[kindId] || V.announce).name, r.bg, r.elements, { spec:kindId });
}
function pageKinds(doc) { if (doc.mode === 'doc') { const ks = DOCS[doc.docType].kinds; return Object.keys(ks).map((k) => [k, ks[k].label]); } if (doc.formatId === 'avatar' || doc.formatId === 'email') return []; return Object.keys(V).map((k) => [k, V[k].name]); }
function newElement(type, doc, page) { const el = newElement0(type, doc, page); if (el) el.user = true; return el; }
function newElement0(type, doc, page) {
  const W = doc.w, H = doc.h, s = Math.max(14, R(Math.sqrt(W*H)*0.03)), dark = isDark(page.bg), fg = dark ? C.cream : C.cocoa;
  const cx = (w) => R((W - w) / 2), cy = (h) => R((H - h) / 2);
  switch (type) {
    case 'heading': return T('heading', 'New heading', { x:cx(W*0.7), y:cy(s*2), w:R(W*0.7), h:R(s*2.4), size:R(s*1.8), font:'display', color:fg, lh:1.1 });
    case 'text': return T('body', 'New paragraph. Click to edit in the panel.', { x:cx(W*0.6), y:cy(s*4), w:R(W*0.6), h:R(s*4), size:R(s*0.7), color:fg, lh:1.55 });
    case 'label': return T('label', 'Label', { x:cx(W*0.4), y:cy(s), w:R(W*0.4), h:R(s*1.1), size:R(s*0.5), weight:800, upper:true, ls:0.12, color:dark ? C.gold4 : C.pink7 });
    case 'cta': return T('cta', 'Order on WhatsApp', { x:cx(s*10), y:cy(s*2), w:R(s*10), h:R(s*2.2), size:R(s*0.7), weight:700, color:C.white, bg:C.pink6, radius:999, align:'center', valign:'center', lh:1.1 });
    case 'image': return I('img', PH.cake, { x:cx(W*0.4), y:cy(H*0.4), w:R(W*0.4), h:R(H*0.4), frame:'round', radius:R(s*0.6) });
    case 'shape': return S('shape', { x:cx(W*0.3), y:cy(H*0.2), w:R(W*0.3), h:R(H*0.2), fill:dark ? C.cocoa7 : C.gold1, radius:R(s*0.6) });
    case 'logo': { const z = R(Math.min(W, H)*0.18); return L('logo', { x:cx(z), y:cy(z), w:z, h:z, radius:R(z*0.18) }); }
    case 'ribbon': return RB('ribbon', { x:cx(W*0.4), y:cy(s), w:R(W*0.4), h:R(s*0.9), color:dark ? C.gold : C.pink });
    case 'table': return TB('table', 'Column | Column\n[Value] | [Value]\n[Value] | [Value]', { x:cx(W*0.7), y:cy(H*0.25), w:R(W*0.7), h:R(H*0.25), size:R(s*0.6), color:fg, head:fg, line:dark ? C.cocoa7 : C.gold3 });
    case 'chart': return CH('chart', '[Label]: 60\n[Label]: 40\n[Label]: 20', { x:cx(W*0.7), y:cy(H*0.25), w:R(W*0.7), h:R(H*0.25), size:R(s*0.6), color:fg, track:dark ? C.cocoa7 : C.pink1 });
    case 'toc': return TOC('toc', 'Entry|1', { x:cx(W*0.7), y:cy(H*0.3), w:R(W*0.7), h:R(H*0.3), size:R(s*0.6), color:fg });
    case 'pageno': return PN({ x:cx(W*0.3), y:H - R(s*2), w:R(W*0.3), h:R(s), size:R(s*0.5), color:dark ? C.cocoa1 : C.cocoa7 });
  }
}
function isDark(hex) { if (!hex || hex[0] !== '#' || hex.length < 7) return false; const n = parseInt(hex.slice(1, 7), 16); const r = n >> 16, g = (n >> 8) & 255, b = n & 255; return (0.299*r + 0.587*g + 0.114*b) < 128; }
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

window.TBM = { C, SWATCHES, FONTS, PH, PHOTOS, LOGO, MARK, FORMATS, PAGE_SIZES, TEMPLATES, BUILD, CATS, DOCS, V, ELEMENT_KINDS, relayout, newPage, newElement, pageKinds, isDark, slug, nid, compose, docPage };
})();
