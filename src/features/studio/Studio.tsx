'use client';
/* Treats Studio — application state and behaviour (port of the prototype's DCLogic component).
   One instance lives in the /studio layout, so the open document, undo history and library
   selection survive moving between the library and editor routes. */
import { Component, type ReactNode } from 'react';
import { BUILD, CATS, DOCS, TEMPLATES, V, newElement, newPage, normalizeDoc, pageKinds, relayout, nid } from '@/lib/studio';
import type { AddKind, CatId, Doc, El, ElPatch, Page } from '@/lib/studio';
import * as X from '@/lib/export';
import { Editor } from './Editor';
import { Library } from './Library';
import { ExportDialog } from './ExportDialog';
import { Artboard } from './Artboard';
import { AppHeader } from '@/components/AppHeader';
import { Icon } from '@/ds';
import { EditorTools } from './EditorTools';
import s from './studio.module.css';

export type Panel = 'pages' | 'canvas' | 'edit';
export interface Toast { msg: string; kind: 'ok' | 'error' }
export interface GenState { title: string; sub: string; variant: string; ch: Record<string, number | boolean> }
export interface StudioState {
  ready: boolean; route: 'library' | 'edit'; cat: CatId; q: string; doc: Doc | null; selPage: number; selEl: string | null;
  zoomMode: string; canvasW: number; canvasH: number; vw: number; panel: Panel; preview: boolean; exportOpen: boolean; exporting: boolean;
  busy: string; toast: Toast | null; selectMode: boolean; bulk: Record<string, boolean>; gen: GenState; addKind: string; overflow: boolean;
  offDoc: Doc | null; scale: number; jpgQ: number; dragOver: number | null; hist: Doc[]; fut: Doc[]; limit: number;
  /** Phone editor: expanded bottom sheet, measured sheet height, a file waiting to be shared. */
  sheetFull: boolean; sheetH: number; sheetW: number; share: { file: File; title: string } | null;
}
export interface StudioProps { route: 'library' | 'edit'; tplId: string | null; cat: string | null; navigate: (href: string, replace?: boolean) => void }

const STORE = 'tbm-studio:v1';
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));
const isCat = (c: string | null): c is CatId => !!c && CATS.some(([id]) => id === c);
export const NARROW = 900;

interface Drag { mode: 'move' | 'resize'; pi: number; id: string; sx: number; sy: number; o: { x: number; y: number; w: number; h: number }; z: number; moved: boolean; touch: boolean }
interface Pinch { d0: number; z0: number; mx: number; my: number; sl: number; st: number }

export class Studio extends Component<StudioProps, StudioState> {
  state: StudioState = {
    ready: false, route: 'library', cat: 'social', q: '', doc: null, selPage: 0, selEl: null, zoomMode: 'fit', canvasW: 800, canvasH: 600, vw: 1200, panel: 'canvas',
    preview: false, exportOpen: false, exporting: false, busy: '', toast: null, selectMode: false, bulk: {},
    gen: { title: '', sub: '', variant: 'edcocoa', ch: { xarticle: 1, liarticle: 1, lipost: 1, medium: 1, articlehero: 1, blogpromo: 1, nlpromo: 1 } },
    addKind: '', overflow: false, offDoc: null, scale: 1, jpgQ: 0.92, dragOver: null, hist: [], fut: [], limit: 24,
    sheetFull: false, sheetH: 0, sheetW: 0, share: null,
  };
  saved: Record<string, Doc> = {};
  thumbs: Record<string, { node: ReactNode; w: number; h: number; key: string }> = {};
  lastHist = 0;
  drag: Drag | null = null;
  dragFrom: number | null = null;
  pendingCenter = false;
  pendingSmooth = false;
  ro: ResizeObserver | null = null;
  roEl: HTMLElement | null = null;
  iv: ReturnType<typeof setInterval> | undefined;
  pt: ReturnType<typeof setTimeout> | undefined;
  tt: ReturnType<typeof setTimeout> | undefined;

  private h = {
    resize: () => this.setState({ vw: innerWidth }),
    key: (e: KeyboardEvent) => this.key(e),
    move: (e: PointerEvent) => this.dragMove(e),
    up: () => this.dragEnd(),
    unload: () => this.flush(),
    vv: () => this.keyboard(),
    tStart: (e: TouchEvent) => this.pinchStart(e),
    tMove: (e: TouchEvent) => this.pinchMove(e),
    tEnd: (e: TouchEvent) => { if (e.touches.length < 2) this.pinch = null; },
  };
  pinch: Pinch | null = null;
  pinchEl: HTMLElement | null = null;
  prevOverscroll = '';

  componentDidMount() {
    try { this.saved = JSON.parse(localStorage.getItem(STORE) || '{}'); } catch { this.saved = {}; }
    Object.values(this.saved).forEach((d) => d && d.pages && normalizeDoc(d));
    addEventListener('resize', this.h.resize); addEventListener('keydown', this.h.key); addEventListener('pointermove', this.h.move); addEventListener('pointerup', this.h.up); addEventListener('pointercancel', this.h.up); addEventListener('pagehide', this.h.unload);
    this.setState({ ready: true, vw: innerWidth }, () => this.route());
    this.iv = setInterval(() => { try { this.tick(); } catch { /* measurement only */ } }, 150);
    // Phones: stop pull-to-refresh while dragging on the canvas, and track the on-screen keyboard (iOS).
    this.prevOverscroll = document.documentElement.style.overscrollBehaviorY; document.documentElement.style.overscrollBehaviorY = 'contain';
    window.visualViewport?.addEventListener('resize', this.h.vv); window.visualViewport?.addEventListener('scroll', this.h.vv);
  }
  /** iOS keeps the layout viewport when the keyboard opens; shrink the app to the visible part instead. */
  keyboard() {
    const vv = window.visualViewport; if (!vv) return; const root = document.documentElement;
    const kb = Math.max(0, Math.round(innerHeight - vv.height - vv.offsetTop));
    if (kb > 80) { root.style.setProperty('--kb', kb + 'px'); root.setAttribute('data-kb', ''); } else { root.style.removeProperty('--kb'); root.removeAttribute('data-kb'); }
  }
  pinchStart(e: TouchEvent) {
    if (e.touches.length !== 2 || !this.pinchEl) return;
    this.drag = null; const [a, b] = [e.touches[0], e.touches[1]]; const r = this.pinchEl.getBoundingClientRect();
    this.pinch = { d0: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) || 1, z0: this.zoom(), mx: (a.clientX + b.clientX) / 2 - r.left, my: (a.clientY + b.clientY) / 2 - r.top, sl: this.pinchEl.scrollLeft, st: this.pinchEl.scrollTop };
  }
  /** Two fingers: pinch to zoom around the fingers, move both to pan. */
  pinchMove(e: TouchEvent) {
    const p = this.pinch, sc = this.pinchEl; if (!p || !sc || e.touches.length !== 2) return; e.preventDefault();
    const [a, b] = [e.touches[0], e.touches[1]]; const r = sc.getBoundingClientRect();
    const z = Math.max(0.05, Math.min(3, p.z0 * Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) / p.d0));
    const mx = (a.clientX + b.clientX) / 2 - r.left, my = (a.clientY + b.clientY) / 2 - r.top, k = z / p.z0;
    this.setState({ zoomMode: String(+z.toFixed(3)) }, () => { sc.scrollLeft = (p.sl + p.mx) * k - mx; sc.scrollTop = (p.st + p.my) * k - my; });
  }
  componentWillUnmount() {
    const h = this.h; removeEventListener('resize', h.resize); removeEventListener('keydown', h.key); removeEventListener('pointermove', h.move); removeEventListener('pointerup', h.up); removeEventListener('pointercancel', h.up); removeEventListener('pagehide', h.unload);
    this.ro?.disconnect(); clearInterval(this.iv); this.flush();
    document.documentElement.style.overscrollBehaviorY = this.prevOverscroll;
    window.visualViewport?.removeEventListener('resize', this.h.vv); window.visualViewport?.removeEventListener('scroll', this.h.vv);
    this.bindPinch(null); document.documentElement.style.removeProperty('--kb'); document.documentElement.removeAttribute('data-kb');
  }
  bindPinch(el: HTMLElement | null) {
    if (this.pinchEl === el) return; const o = this.pinchEl, h = this.h;
    if (o) { o.removeEventListener('touchstart', h.tStart); o.removeEventListener('touchmove', h.tMove); o.removeEventListener('touchend', h.tEnd); o.removeEventListener('touchcancel', h.tEnd); }
    this.pinchEl = el;
    if (el) { el.addEventListener('touchstart', h.tStart, { passive: true }); el.addEventListener('touchmove', h.tMove, { passive: false }); el.addEventListener('touchend', h.tEnd); el.addEventListener('touchcancel', h.tEnd); }
  }
  componentDidUpdate(prev: StudioProps, prevState: StudioState) {
    if (prev.route !== this.props.route || prev.tplId !== this.props.tplId || prev.cat !== this.props.cat) this.route();
    if (prevState.route !== this.state.route || prevState.doc?.name !== this.state.doc?.name || prevState.ready !== this.state.ready) this.title();
    const st = this.state;
    if (this.narrow() && (prevState.panel !== st.panel || prevState.sheetFull !== st.sheetFull || Math.abs(prevState.sheetH - st.sheetH) > 24 || Math.abs(prevState.sheetW - st.sheetW) > 24 || (prevState.selEl !== st.selEl && st.selEl && st.panel !== 'canvas'))) { this.pendingCenter = true; this.pendingSmooth = true; }
    this.tick();
  }
  /** Tab title (URL changes inside the studio don't re-run server metadata). */
  title() {
    const st = this.state; if (!st.ready) return;
    document.title = (st.route === 'edit' && st.doc ? 'Editing ' + st.doc.name : 'Template library') + ' — Treats by MMA';
  }

  /** Keep canvas size in state, centre the selected page when asked, and detect text overflow. */
  tick() {
    const sc = document.getElementById('canvas-scroll');
    this.bindPinch(sc);
    // A phone sheet covers the bottom of the canvas, or the right side when the phone is held sideways.
    const sheet = document.querySelector<HTMLElement>('[data-sheet]'); const side = !!sheet && sheet.getBoundingClientRect().left > 1;
    const sh = sheet && !side ? sheet.offsetHeight : 0, sw = sheet && side ? sheet.offsetWidth : 0;
    if (Math.abs(sh - this.state.sheetH) > 2 || Math.abs(sw - this.state.sheetW) > 2) this.setState({ sheetH: sh, sheetW: sw });
    if (sc && sc !== this.roEl) {
      this.ro?.disconnect(); this.roEl = sc;
      this.ro = new ResizeObserver(() => { const w = sc.clientWidth, h = sc.clientHeight; if (Math.abs(w - this.state.canvasW) > 2 || Math.abs(h - this.state.canvasH) > 2) { this.pendingCenter = true; this.setState({ canvasW: w, canvasH: h }); } });
      this.ro.observe(sc);
    }
    if (sc && sc.clientWidth && (Math.abs(sc.clientWidth - this.state.canvasW) > 2 || Math.abs(sc.clientHeight - this.state.canvasH) > 2)) { this.pendingCenter = true; this.setState({ canvasW: sc.clientWidth, canvasH: sc.clientHeight }); return; }
    if (this.pendingCenter && sc) { this.pendingCenter = false; const sm = this.pendingSmooth; this.pendingSmooth = false; setTimeout(() => this.center(sm), 60); }
    const el = this.curEl(); let of = false;
    if (el && el.type === 'text') { const n = document.getElementById('el-' + el.id); if (n) of = n.scrollHeight > n.clientHeight + 2; }
    if (of !== this.state.overflow) this.setState({ overflow: of });
  }

  route() {
    const { route, tplId, cat } = this.props;
    if (route === 'edit' && tplId) {
      if (BUILD[tplId]) { if (!this.state.doc || this.state.doc.tpl !== tplId) this.openTpl(tplId, true); else this.setState({ route: 'edit' }); return; }
      this.toast('That template does not exist — showing the library.', 'error'); this.props.navigate('/studio', true);
    }
    const c = isCat(cat) ? cat : route === 'library' && cat == null ? this.state.cat : 'social';
    this.setState({ route: 'library', cat: c });
  }
  toast(msg: string, kind: Toast['kind']) { clearTimeout(this.tt); this.setState({ toast: { msg, kind } }); this.tt = setTimeout(() => this.setState({ toast: null }), 4200); }
  goLibrary = () => this.props.navigate('/studio?cat=' + this.state.cat);
  goEditor = () => { if (this.state.doc) this.props.navigate('/studio/edit/' + encodeURIComponent(this.state.doc.tpl)); };

  openTpl(id: string, fromRoute?: boolean) {
    const doc = this.saved[id] ? clone(this.saved[id]) : BUILD[id]();
    const kinds = pageKinds(doc);
    this.setState({ route: 'edit', doc, selPage: 0, selEl: null, hist: [], fut: [], preview: false, panel: 'canvas', addKind: kinds.length ? kinds[0][0] : '' });
    if (!fromRoute) this.props.navigate('/studio/edit/' + encodeURIComponent(id));
    this.pendingCenter = true;
  }
  persist(d: Doc) { clearTimeout(this.pt); this.pt = setTimeout(() => { this.pt = undefined; this.saved[d.tpl] = d; delete this.thumbs[d.tpl]; this.writeSaved(); }, 250); }
  /** Write any pending edit immediately (page hide / unmount) so nothing is lost. */
  flush() { if (this.pt && this.state.doc) { clearTimeout(this.pt); this.pt = undefined; this.saved[this.state.doc.tpl] = this.state.doc; this.writeSaved(); } }
  writeSaved() { try { localStorage.setItem(STORE, JSON.stringify(this.saved)); } catch { this.toast('Browser storage is full — export a project file (JSON) to keep your work.', 'error'); } }
  mut(fn: (d: Doc) => void, mode: 'hist' | 'coalesce' = 'hist'): Doc {
    const prev = this.state.doc as Doc; const d = clone(prev); fn(d);
    const push = mode === 'hist' || (mode === 'coalesce' && Date.now() - this.lastHist > 900); if (mode === 'coalesce') this.lastHist = Date.now();
    this.setState((st) => ({ doc: d, hist: push ? st.hist.slice(-60).concat([prev]) : st.hist, fut: push ? [] : st.fut })); this.persist(d); return d;
  }
  undo() { const st = this.state; if (!st.hist.length || !st.doc) return; const prev = st.hist[st.hist.length - 1]; this.setState({ doc: prev, hist: st.hist.slice(0, -1), fut: [st.doc].concat(st.fut), selEl: null, selPage: Math.min(st.selPage, prev.pages.length - 1) }); this.persist(prev); }
  redo() { const st = this.state; if (!st.fut.length || !st.doc) return; const nx = st.fut[0]; this.setState({ doc: nx, fut: st.fut.slice(1), hist: st.hist.concat([st.doc]), selEl: null, selPage: Math.min(st.selPage, nx.pages.length - 1) }); this.persist(nx); }
  curPage(): Page | undefined { const d = this.state.doc; return d ? d.pages[this.state.selPage] : undefined; }
  curEl(): El | null { const p = this.curPage(); return p && this.state.selEl ? p.elements.find((e) => e.id === this.state.selEl) || null : null; }
  narrow() { return this.state.vw < NARROW; }
  zoom(): number {
    const st = this.state, d = st.doc; if (!d) return 1; if (st.zoomMode !== 'fit') return +st.zoomMode;
    const nar = this.narrow(), pad = nar ? 24 : 64;
    return Math.max(0.05, Math.min((st.canvasW - pad) / d.w, (st.canvasH - pad - (nar ? 60 : 30)) / d.h, 2));
  }
  center(smooth?: boolean) {
    const sc = document.getElementById('canvas-scroll'), pg = this.curPage(); if (!sc || !pg) return; const w = document.getElementById('pw-' + pg.id); if (!w) return;
    // On phones the tab bar and an open sheet cover the bottom of the canvas: centre in what's visible.
    const nar = this.narrow(), bar = nar ? (document.querySelector<HTMLElement>('nav[aria-label="Editor"]')?.offsetHeight || 0) : 0;
    const visH = Math.max(80, sc.clientHeight - bar - (nar ? this.state.sheetH : 0)), visW = Math.max(80, sc.clientWidth - (nar ? this.state.sheetW : 0));
    let top = Math.max(0, w.offsetTop - (visH - w.offsetHeight) / 2), left = Math.max(0, w.offsetLeft - (visW - w.offsetWidth) / 2);
    const elNode = nar && this.state.selEl && this.state.panel !== 'canvas' ? document.getElementById('el-' + this.state.selEl) : null;
    if (elNode) { const er = elNode.getBoundingClientRect(), sr = sc.getBoundingClientRect(); top = Math.max(0, sc.scrollTop + er.top - sr.top + er.height / 2 - visH / 2); left = Math.max(0, sc.scrollLeft + er.left - sr.left + er.width / 2 - visW / 2); }
    const far = Math.abs(sc.scrollTop - top) > sc.clientHeight * 2.5 || document.hidden || matchMedia('(prefers-reduced-motion: reduce)').matches;
    sc.scrollTo({ top, left, behavior: smooth && !far ? 'smooth' : 'auto' });
  }
  goPage(i: number) { this.setState({ selPage: i, selEl: null, panel: this.narrow() ? 'canvas' : this.state.panel }); this.pendingCenter = true; this.pendingSmooth = true; }
  updEl(patch: ElPatch | ((e: El) => ElPatch), mode?: 'hist' | 'coalesce') {
    const { selPage, selEl } = this.state;
    this.mut((d) => { const e = d.pages[selPage].elements.find((x) => x.id === selEl); if (e) Object.assign(e, typeof patch === 'function' ? patch(e) : patch); }, mode);
  }
  updPage(patch: Partial<Page>, mode?: 'hist' | 'coalesce') { const i = this.state.selPage; this.mut((d) => { Object.assign(d.pages[i], patch); }, mode); }
  pageNum(d: Doc, i: number) { return X.pageNum(d, i); }

  key(e: KeyboardEvent) {
    const st = this.state; if (st.route !== 'edit' || !st.doc) return;
    const t = e.target as HTMLElement | null, typing = !!t && (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.isContentEditable); const mod = e.metaKey || e.ctrlKey;
    if (e.key === 'Escape') { if (st.exportOpen) this.setState({ exportOpen: false }); else if (st.preview) this.setState({ preview: false }); else if (this.narrow() && st.panel !== 'canvas') this.setState({ panel: 'canvas' }); else this.setState({ selEl: null }); return; }
    if (typing) return;
    if (mod && e.key.toLowerCase() === 'z') { e.preventDefault(); if (e.shiftKey) this.redo(); else this.undo(); return; }
    if (mod && e.key.toLowerCase() === 'y') { e.preventDefault(); this.redo(); return; }
    if (!st.selEl) { if (e.key === 'PageDown' || e.key === 'PageUp') { e.preventDefault(); const n = Math.max(0, Math.min(st.doc.pages.length - 1, st.selPage + (e.key === 'PageDown' ? 1 : -1))); this.goPage(n); } return; }
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); this.delEl(); return; }
    if (mod && e.key.toLowerCase() === 'd') { e.preventDefault(); this.dupEl(); return; }
    const stp = e.shiftKey ? 10 : 1, mv = ({ ArrowLeft: [-stp, 0], ArrowRight: [stp, 0], ArrowUp: [0, -stp], ArrowDown: [0, stp] } as Record<string, number[]>)[e.key];
    if (mv) { e.preventDefault(); this.updEl((x) => ({ x: x.x + mv[0], y: x.y + mv[1] }), 'coalesce'); }
  }
  startDrag(e: React.PointerEvent, pi: number, id: string, mode: 'move' | 'resize') {
    const st = this.state; if (st.preview || e.button || !st.doc) return; e.stopPropagation(); const el = st.doc.pages[pi].elements.find((x) => x.id === id); if (!el) return;
    if (st.selEl !== id || st.selPage !== pi) this.setState({ selPage: pi, selEl: id });
    this.drag = { mode, pi, id, sx: e.clientX, sy: e.clientY, o: { x: el.x, y: el.y, w: el.w, h: el.h }, z: this.zoom(), moved: false, touch: e.pointerType !== 'mouse' };
  }
  dragMove(e: PointerEvent) {
    const g = this.drag; if (!g) return; const dx = (e.clientX - g.sx) / g.z, dy = (e.clientY - g.sy) / g.z; if (!g.moved && Math.abs(dx) + Math.abs(dy) < (g.touch ? 8 : 3) / g.z) return; // a finger jitters more than a mouse
    if (!g.moved) { g.moved = true; this.mut(() => {}, 'hist'); }
    const prev = this.state.doc; if (!prev) return; const d = clone(prev); const el = d.pages[g.pi].elements.find((x) => x.id === g.id); if (!el) return;
    if (g.mode === 'move') { el.x = Math.round(g.o.x + dx); el.y = Math.round(g.o.y + dy); } else { el.w = Math.max(8, Math.round(g.o.w + dx)); el.h = Math.max(8, Math.round(g.o.h + dy)); }
    this.setState({ doc: d }); this.persist(d);
  }
  dragEnd() { this.drag = null; }

  dupEl() {
    const { selPage, selEl } = this.state; let id: string | undefined;
    this.mut((d) => { const els = d.pages[selPage].elements, i = els.findIndex((x) => x.id === selEl); if (i < 0) return; const c = clone(els[i]); c.id = id = nid(); c.x += 24; c.y += 24; c.key = c.key + '-copy'; c.user = true; els.splice(i + 1, 0, c); });
    setTimeout(() => { if (id) this.setState({ selEl: id }); }, 0);
  }
  delEl() { const { selPage, selEl } = this.state; this.mut((d) => { d.pages[selPage].elements = d.pages[selPage].elements.filter((x) => x.id !== selEl); }); this.setState({ selEl: null }); }
  zEl(id: string, dir: 'top' | 'bottom' | 'up' | 'down') {
    const i = this.state.selPage;
    this.mut((d) => { const els = d.pages[i].elements, k = els.findIndex((x) => x.id === id); if (k < 0) return; const [e] = els.splice(k, 1); const n = dir === 'top' ? els.length : dir === 'bottom' ? 0 : Math.max(0, Math.min(els.length, k + (dir === 'up' ? 1 : -1))); els.splice(n, 0, e); });
  }
  addEl(type: AddKind) { const st = this.state, d = st.doc, pg = this.curPage(); if (!d || !pg) return; const el = newElement(type, d, pg); this.mut((dd) => { dd.pages[st.selPage].elements.push(el); }); this.setState({ selEl: el.id, panel: this.narrow() ? 'edit' : st.panel }); }
  addPage(before: boolean) {
    const st = this.state; if (!st.doc) return; const at = before ? st.selPage : st.selPage + 1; let pg: Page;
    if (st.addKind) pg = newPage(st.doc, st.addKind); else { pg = clone(this.curPage() as Page); pg.id = nid('p'); pg.elements.forEach((e) => { e.id = nid(); }); pg.name += ' copy'; }
    this.mut((d) => { d.pages.splice(at, 0, pg); }); this.setState({ selPage: at, selEl: null }); this.pendingCenter = true; this.pendingSmooth = true; this.toast('Page added: ' + pg.name, 'ok');
  }
  dupPage(i: number) { this.mut((d) => { const c = clone(d.pages[i]); c.id = nid('p'); c.elements.forEach((e) => { e.id = nid(); }); c.name += ' copy'; d.pages.splice(i + 1, 0, c); }); this.setState({ selPage: i + 1, selEl: null }); this.pendingCenter = true; this.pendingSmooth = true; }
  delPage(i: number) {
    if (!this.state.doc || this.state.doc.pages.length < 2) { this.toast('A document needs at least one page.', 'error'); return; }
    this.mut((d) => { d.pages.splice(i, 1); }); this.setState((st) => ({ selPage: Math.min(i, (st.doc as Doc).pages.length - 1), selEl: null })); this.pendingCenter = true; this.toast('Page deleted — Undo to restore.', 'ok');
  }
  movePage(from: number | null, to: number | null) {
    if (from == null || to == null || from === to || !this.state.doc || to < 0 || to >= this.state.doc.pages.length) return;
    this.mut((d) => { const [p] = d.pages.splice(from, 1); d.pages.splice(to, 0, p); }); this.setState({ selPage: to, dragOver: null }); this.pendingCenter = true; this.pendingSmooth = true;
  }
  regenToc() {
    this.mut((d) => {
      const rows: string[] = [];
      d.pages.forEach((p, i) => { if (!p.toc) return; const hd = p.elements.find((e) => e.key === 'title') || p.elements.find((e) => e.key === 'heading'); const lab = p.elements.find((e) => e.key === 'label'); let t = ((hd && hd.text) || p.name).replace(/\n/g, ' '); if (lab && /^(chapter|part|section)/i.test(lab.text || '')) t = lab.text + ' — ' + t; const n = this.pageNum(d, i); rows.push(t + '|' + (n == null ? '' : n)); });
      let found = 0; d.pages.forEach((p) => p.elements.forEach((e) => { if (e.type === 'toc') { e.text = rows.join('\n'); found++; } }));
      if (!found) setTimeout(() => this.toast('No contents page in this document — add one from the page menu.', 'error'), 0);
    });
    this.toast('Contents updated from pages marked “In contents”.', 'ok');
  }
  flow() {
    const st = this.state, el = this.curEl(), pg = this.curPage(); if (!el || !pg) return; const box = document.getElementById('el-' + el.id), tx = document.getElementById('tx-' + el.id); if (!box || !tx) return;
    const text = el.text || ''; const sep = text.includes('\n\n') ? '\n\n' : text.includes('\n') ? '\n' : ' '; const parts = text.split(sep); const rest: string[] = []; const orig = tx.textContent;
    while (parts.length > 1 && box.scrollHeight > box.clientHeight + 2) { rest.unshift(parts.pop() as string); tx.textContent = parts.join(sep); }
    tx.textContent = orig; if (!rest.length) { this.toast('Could not split further — enlarge the box or shorten a paragraph.', 'error'); return; }
    const top = Math.min.apply(null, pg.elements.filter((e) => e.type !== 'pageno').map((e) => e.y)); const np = clone(pg); np.id = nid('p'); np.name = pg.name + ' (cont.)'; np.toc = false;
    np.elements = np.elements.filter((e) => e.id === el.id || e.type === 'pageno').map((e) => Object.assign(e, { id: nid() })); const ne = np.elements.find((e) => e.type === 'text') as El; ne.text = rest.join(sep); ne.h = el.y + el.h - top; ne.y = top;
    const i = st.selPage;
    this.mut((d) => { (d.pages[i].elements.find((e) => e.id === el.id) as El).text = parts.join(sep); d.pages.splice(i + 1, 0, np); });
    this.setState({ selPage: i + 1, selEl: ne.id }); this.pendingCenter = true; this.pendingSmooth = true; this.toast(rest.length + ' paragraph(s) moved to a new page.', 'ok');
  }
  setSize(id: string) { if (!this.state.doc) return; const nd = relayout(this.state.doc, id); this.mut((d) => { (Object.keys(nd) as (keyof Doc)[]).forEach((k) => { (d as unknown as Record<string, unknown>)[k] = nd[k]; }); }); this.setState({ selEl: null }); this.pendingCenter = true; }
  resetTpl() {
    const doc = this.state.doc; if (!doc) return;
    if (!confirm('Reset “' + doc.name + '” to its original template? Your edits will be cleared (you can still Undo).')) return;
    const d0 = BUILD[doc.tpl]();
    this.mut((d) => { Object.keys(d).forEach((k) => { delete (d as unknown as Record<string, unknown>)[k]; }); Object.assign(d, d0); });
    delete this.saved[d0.tpl]; this.setState({ selPage: 0, selEl: null }); this.pendingCenter = true;
    setTimeout(() => { delete this.saved[d0.tpl]; delete this.thumbs[d0.tpl]; this.writeSaved(); }, 300); this.toast('Template reset to original.', 'ok');
  }
  reapplyLayout() {
    const st = this.state, d = st.doc, pg = this.curPage(); if (!d || !pg) return;
    if (!confirm('Rebuild this page from its layout? Text and images are kept where possible.')) return;
    const tmp = clone(d); tmp.pages = [pg]; const nd = relayout(tmp, d.formatId);
    this.mut((dd) => { dd.pages[st.selPage] = Object.assign(nd.pages[0], { id: pg.id }); });
  }
  setArticle(key: string, v: string) { this.mut((d) => d.pages.forEach((p) => p.elements.forEach((e) => { if (e.key === key) e.text = v; })), 'coalesce'); }
  readImage(file: File): Promise<string> {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => { const im = new Image(); im.onload = () => { const m = 1800, sc = Math.min(1, m / Math.max(im.width, im.height)); const c = document.createElement('canvas'); c.width = Math.round(im.width * sc); c.height = Math.round(im.height * sc); const ctx = c.getContext('2d'); if (!ctx) { rej(new Error('canvas')); return; } ctx.drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.88)); }; im.onerror = rej; im.src = r.result as string; };
      r.onerror = rej; r.readAsDataURL(file);
    });
  }
  async onFile(f: File | undefined) { if (!f) return; try { const src = await this.readImage(f); this.updEl({ src }); this.toast('Image replaced.', 'ok'); } catch { this.toast('Could not read that image.', 'error'); } }
  async onImport(f: File | undefined) {
    if (!f) return;
    try { const d = normalizeDoc(JSON.parse(await f.text())); if (!d.tpl || !BUILD[d.tpl] || !Array.isArray(d.pages)) throw new Error('bad'); this.saved[d.tpl] = d; delete this.thumbs[d.tpl]; this.writeSaved(); this.openTpl(d.tpl); this.toast('Project opened: ' + d.name, 'ok'); }
    catch { this.toast('That file is not a Treats Studio project.', 'error'); }
  }

  /* ---------- exports ---------- */
  frames(ms?: number) { return new Promise((r) => setTimeout(r, (ms || 40) + 30)); }
  async imgsReady(prefix: string, doc: Doc) {
    const imgs: HTMLImageElement[] = []; doc.pages.forEach((p) => { const n = document.getElementById(prefix + p.id); if (n) imgs.push(...Array.from(n.querySelectorAll('img'))); });
    await Promise.all(imgs.map((i) => i.complete ? Promise.resolve() : new Promise((r) => { i.onload = i.onerror = r; })));
    if (document.fonts) await document.fonts.ready;
  }
  nodes(prefix?: string, doc?: Doc): HTMLElement[] { const d = doc || this.state.doc; if (!d) return []; return d.pages.map((p) => document.getElementById((prefix || 'ab-') + p.id) as HTMLElement); }
  async run(label: string, fn: () => Promise<unknown>) {
    this.setState({ busy: label + '…', exporting: true, exportOpen: false }); await this.frames(60);
    try { if (this.state.doc) await this.imgsReady('ab-', this.state.doc); await fn(); this.toast(label + ' — download started.', 'ok'); }
    catch (e) { console.error(e); this.toast('Export failed: ' + ((e as Error)?.message || e), 'error'); }
    this.setState({ busy: '', exporting: false });
  }
  async exportPage(i: number, type: X.ImageType) { const d = this.state.doc as Doc; await this.run(type.toUpperCase() + ' page ' + (i + 1), async () => { const b = await X.capture(this.nodes()[i], d, type, this.state.scale, this.state.jpgQ); X.save(b, X.fname(d, 'p' + String(i + 1).padStart(2, '0'), type === 'jpeg' ? 'jpg' : type)); }); }
  /** Phones: render the page, then offer the native share sheet (needs a fresh tap, so it's a second step). */
  async sharePage(i: number, type: 'png' | 'jpeg' | 'pdf') {
    const d = this.state.doc as Doc; const label = (type === 'jpeg' ? 'JPG' : type.toUpperCase()) + ' page ' + (i + 1);
    this.setState({ busy: 'Preparing ' + label + '…', exporting: true, exportOpen: false }); await this.frames(60);
    try {
      await this.imgsReady('ab-', d); const node = this.nodes()[i];
      const blob = type === 'pdf' ? await X.pdf(Object.assign({}, d, { name: d.name + ' p' + (i + 1) }), [node], true) : await X.capture(node, d, type, this.state.scale, this.state.jpgQ);
      const name = type === 'pdf' ? X.fname(Object.assign({}, d, { name: d.name + ' p' + (i + 1) }), '', 'pdf') : X.fname(d, 'p' + String(i + 1).padStart(2, '0'), type === 'jpeg' ? 'jpg' : 'png');
      this.setState({ share: { file: new File([blob], name, { type: type === 'pdf' ? 'application/pdf' : 'image/' + type }), title: d.name } });
    } catch (e) { console.error(e); this.toast('Could not prepare the file: ' + ((e as Error)?.message || e), 'error'); }
    this.setState({ busy: '', exporting: false });
  }
  async shareNow() {
    const sh = this.state.share; if (!sh) return;
    try { const r = await X.shareFile(sh.file, sh.title); this.setState({ share: null }); if (r === 'shared') this.toast('Shared.', 'ok'); }
    catch (e) { this.toast('Sharing is not available here — use Download instead. (' + ((e as Error)?.message || e) + ')', 'error'); }
  }
  async exportZip(type: X.ImageType) {
    const d = this.state.doc as Doc;
    await this.run('All pages (' + type.toUpperCase() + ' ZIP)', async () => { const ns = this.nodes(), files = []; for (let i = 0; i < ns.length; i++) files.push({ name: X.fname(d, 'p' + String(i + 1).padStart(2, '0'), type === 'jpeg' ? 'jpg' : type), blob: await X.capture(ns[i], d, type, this.state.scale, this.state.jpgQ) }); await X.zipOf(files, X.fname(d, 'pages', 'zip')); });
  }
  async bulk(type: 'png' | 'jpeg' | 'pdf', ids?: string[]) {
    ids = ids || Object.keys(this.state.bulk).filter((k) => this.state.bulk[k]); if (!ids.length) return; const files: { name: string; blob: Blob }[] = [];
    this.setState({ busy: 'Exporting ' + ids.length + ' template(s)…', exporting: true });
    try {
      for (let n = 0; n < ids.length; n++) {
        const id = ids[n]; const doc = this.saved[id] || BUILD[id](); this.setState({ offDoc: doc, busy: 'Exporting ' + (n + 1) + ' of ' + ids.length + '…' }); await this.frames(60); await this.imgsReady('off-', doc); const ns = this.nodes('off-', doc);
        if (type === 'pdf') files.push({ name: X.fname(doc, '', 'pdf'), blob: await X.pdf(doc, ns, true) });
        else for (let i = 0; i < ns.length; i++) files.push({ name: X.fname(doc, ns.length > 1 ? 'p' + String(i + 1).padStart(2, '0') : '', type === 'jpeg' ? 'jpg' : type), blob: await X.capture(ns[i], doc, type, 1, this.state.jpgQ) });
      }
      await X.zipOf(files, 'treats-by-mma_templates_' + new Date().toISOString().slice(0, 10) + '.zip'); this.toast(files.length + ' file(s) zipped — download started.', 'ok');
    } catch (e) { console.error(e); this.toast('Bulk export failed: ' + ((e as Error)?.message || e), 'error'); }
    this.setState({ busy: '', exporting: false, offDoc: null });
  }
  genDocs(): string[] {
    const g = this.state.gen; const ids = Object.keys(g.ch).filter((k) => g.ch[k]).map((f) => f + ':' + g.variant); if (!ids.length) { this.toast('Choose at least one channel.', 'error'); return []; }
    ids.forEach((id) => {
      const d = this.saved[id] || BUILD[id]();
      d.pages.forEach((p) => p.elements.forEach((e) => { if (e.key === 'title' && g.title.trim()) e.text = g.title.trim(); if (e.key === 'sub') e.text = g.sub.trim(); }));
      if (!g.sub.trim()) d.pages.forEach((p) => { p.elements = p.elements.filter((e) => e.key !== 'sub'); });
      this.saved[id] = d; delete this.thumbs[id];
    });
    this.writeSaved(); return ids;
  }

  /** Library thumbnail of a template's first page (cached until the template is edited). */
  thumb(id: string, maxW: number, maxH: number) {
    const key = maxW + 'x' + maxH, c = this.thumbs[id]; if (c && c.key === key) return c;
    const d = this.saved[id] || BUILD[id](); const z = Math.min(maxW / d.w, maxH / d.h);
    return (this.thumbs[id] = { node: <Artboard doc={d} page={d.pages[0]} index={0} z={z} prefix="th-" lite />, w: Math.round(d.w * z), h: Math.round(d.h * z), key });
  }

  render() {
    const st = this.state;
    const isEdit = st.ready && st.route === 'edit' && !!st.doc;
    return (
      <div className={s.app}>
        <AppHeader compactBrand={isEdit} tightBrand={!!st.doc} collapseNav={isEdit}>
          <div className={s.subnav}>
            <button type="button" onClick={this.goLibrary} className={`${s.pill} ${st.route === 'library' ? s.pillOn : ''}`}>Templates</button>
            {st.doc && <button type="button" onClick={this.goEditor} className={`${s.pill} ${st.route === 'edit' ? s.pillOn : ''}`}>Editor</button>}
          </div>
          {isEdit && !this.narrow() && <EditorTools app={this} />}
        </AppHeader>
        {!st.ready && <div className={s.loading}>Loading studio…</div>}
        {st.ready && st.route === 'library' && <Library app={this} />}
        {isEdit && <Editor app={this} />}
        <div aria-hidden="true" style={{ position: 'fixed', left: -200000, top: 0, pointerEvents: 'none' }}>
          {st.offDoc && st.offDoc.pages.map((p, i) => <Artboard key={p.id} doc={st.offDoc as Doc} page={p} index={i} z={1} prefix="off-" />)}
        </div>
        <input type="file" accept="image/*" id="file-in" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; void this.onFile(f); }} />
        <input type="file" accept="application/json,.json" id="import-in" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; void this.onImport(f); }} />
        {isEdit && st.exportOpen && <ExportDialog app={this} />}
        {st.share && (
          <div role="dialog" aria-label="Share" className={s.shareCard}>
            <b>Ready to share</b>
            <span className={s.hint} style={{ overflowWrap: 'anywhere' }}>{st.share.file.name}</span>
            <div className={s.wrapRow} style={{ gap: 8 }}>
              <button type="button" className={s.pinkBtn} style={{ flex: 1 }} onClick={() => void this.shareNow()}><Icon name="share-2" size={16} />Share</button>
              <button type="button" className={s.smallBtn} style={{ flex: 1 }} onClick={() => { const f = st.share!.file; X.save(f, f.name); this.setState({ share: null }); }}><Icon name="download" size={16} />Download</button>
              <button type="button" className={s.smallBtn} onClick={() => this.setState({ share: null })} aria-label="Close">Close</button>
            </div>
          </div>
        )}
        {!!st.busy && <div role="status" className={s.busy}><span className={s.spin} aria-hidden="true" />{st.busy}</div>}
        {st.toast && <div role="status" className={`${s.toast} ${st.toast.kind === 'error' ? s.toastErr : s.toastOk} ${isEdit && this.narrow() ? s.toastRaised : ''}`}>{st.toast.msg}</div>}
      </div>
    );
  }
}

export { TEMPLATES, CATS, DOCS, V };
