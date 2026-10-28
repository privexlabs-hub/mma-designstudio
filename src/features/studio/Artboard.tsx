/* Shared artboard renderer used by the canvas, thumbnails and exports (Artboard.dc.html + the
   prototype's elView/artView). Element geometry is in artboard pixels; `z` scales the whole board. */
import type { CSSProperties, PointerEvent as RPointerEvent, ReactNode } from 'react';
import { FONTS, LOGO, MARK } from '@/lib/studio';
import type { Doc, El, Page } from '@/lib/studio';
import { pageNum } from '@/lib/export';

export interface Interact {
  /** Element is selected and selection chrome should be drawn. */
  selected: (el: El) => boolean;
  onElDown: (e: RPointerEvent, el: El, mode: 'move' | 'resize') => void;
  onElDbl: (el: El) => void;
  onBoardDown: (e: RPointerEvent) => void;
  preview: boolean;
}

function tStyle(e: El): CSSProperties {
  return { fontFamily: e.font === 'display' ? FONTS.display : FONTS.body, fontSize: e.size, color: e.color, lineHeight: e.lh || 1.4, letterSpacing: (e.ls || 0) + 'em' };
}

/* Small interface copies of the logo files, for previews that are never exported (see scripts/make-ui-images.mjs). */
const LITE = { logo: '/assets/ui/logo-320.webp', mark: '/assets/ui/monogram-256.webp' };

function element(el: El, pg: Page, pi: number, d: Doc, z: number, it: Interact | null, lite: boolean): ReactNode {
  const inter = !!it;
  const box: CSSProperties = { position: 'absolute', left: el.x, top: el.y, width: el.w, height: el.h, opacity: el.opacity == null ? 1 : el.opacity, boxSizing: 'border-box', cursor: inter && !it.preview ? 'move' : undefined, touchAction: inter ? 'none' : undefined };
  const sel = !!it && it.selected(el);
  let body: ReactNode = null;
  if (el.type === 'text' || el.type === 'pageno') {
    let text = el.text || '';
    if (el.type === 'pageno') { const n = pageNum(d, pi); text = n == null ? '' : text.replace('{n}', String(n)); }
    Object.assign(box, { display: 'flex', flexDirection: 'column', justifyContent: el.valign === 'center' ? 'center' : el.valign === 'bottom' ? 'flex-end' : 'flex-start', background: el.bg || 'transparent', borderRadius: el.radius, padding: el.pad || 0, overflow: 'hidden' });
    const inner: CSSProperties = Object.assign(tStyle(el), { fontWeight: el.weight, textAlign: el.align, textTransform: el.upper ? 'uppercase' : 'none', fontStyle: el.italic ? 'italic' : 'normal', whiteSpace: 'pre-wrap', overflowWrap: 'break-word', hyphens: el.align === 'justify' ? 'auto' : 'manual', textWrap: el.align === 'justify' ? 'wrap' : 'pretty' } as CSSProperties);
    body = <div id={inter ? 'tx-' + el.id : undefined} style={inner}>{text}</div>;
  } else if (el.type === 'image') {
    const r = el.radius || 0;
    const br = el.frame === 'arch' ? (el.w / 2) + 'px ' + (el.w / 2) + 'px ' + r + 'px ' + r + 'px / ' + Math.min(el.w / 2, el.h - r) + 'px ' + Math.min(el.w / 2, el.h - r) + 'px ' + r + 'px ' + r + 'px' : el.frame === 'circle' ? '50%' : el.frame === 'round' ? r : 0;
    const rw = Math.max(3, Math.round(Math.min(el.w, el.h) * 0.018));
    Object.assign(box, { borderRadius: br, overflow: 'hidden', boxShadow: el.ring ? '0 0 0 ' + rw + 'px ' + pg.bg + ', 0 0 0 ' + (rw * 2) + 'px ' + el.ring : 'none' });
    body = (
      <>
        {el.src
          // eslint-disable-next-line @next/next/no-img-element -- artboard images must be plain <img> so exports can capture them
          ? <img src={el.src} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: el.fit || 'cover', display: 'block', pointerEvents: 'none' }} />
          : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', background: '#FDE3F0', color: '#AD1660', fontFamily: FONTS.body, fontWeight: 700, fontSize: Math.max(11, Math.min(el.w, el.h) * 0.08), border: Math.max(1, el.w * 0.006) + 'px dashed #F59AC6', boxSizing: 'border-box', borderRadius: 'inherit' }}>Add image</div>}
        {el.scrim && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(43,20,10,.9) 0%, rgba(43,20,10,.6) 38%, rgba(43,20,10,0) 72%)', pointerEvents: 'none' }} />}
      </>
    );
  } else if (el.type === 'shape') {
    Object.assign(box, { background: el.fill, borderRadius: el.radius, border: el.stroke ? el.strokeW + 'px solid ' + el.stroke : 'none' });
  } else if (el.type === 'logo') {
    Object.assign(box, { background: el.tile, borderRadius: el.radius, overflow: 'hidden' });
    // eslint-disable-next-line @next/next/no-img-element -- artboard images must be plain <img> so exports can capture them
    body = <img src={el.variant === 'mark' ? (lite ? LITE.mark : MARK) : (lite ? LITE.logo : LOGO)} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: el.variant === 'mark' ? 'cover' : 'contain', display: 'block', pointerEvents: 'none' }} />;
  } else if (el.type === 'ribbon') {
    Object.assign(box, { display: 'flex', alignItems: 'center', gap: el.h * 0.3 });
    const line: CSSProperties = { flex: 1, height: Math.max(1.5, el.h * 0.09), background: el.color, borderRadius: 2 };
    body = <><div style={line} /><div style={{ color: el.color, fontSize: el.h * 0.8, lineHeight: 1, fontFamily: 'Arial, sans-serif' }}>♥</div><div style={line} /></>;
  } else if (el.type === 'table' || el.type === 'toc' || el.type === 'chart') {
    Object.assign(box, { overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: el.type === 'chart' ? 'space-around' : 'flex-start' });
    const base = tStyle(el), size = el.size || 15; const lines = String(el.text || '').split('\n').filter((l) => l.trim());
    if (el.type === 'table') {
      body = lines.map((l, i) => (
        <div key={i} style={{ display: 'flex', borderBottom: (i === 0 ? 2 : 1) + 'px solid ' + (i === 0 ? el.head : el.line) }}>
          {l.split('|').map((c, j) => <div key={j} style={Object.assign({}, base, { flex: 1, minWidth: 0, padding: (size * 0.55) + 'px ' + (size * 0.5) + 'px', fontWeight: i === 0 ? 800 : 400, color: i === 0 ? el.head : el.color, lineHeight: 1.35 })}>{c.trim()}</div>)}
        </div>
      ));
    } else if (el.type === 'toc') {
      body = lines.map((l, i) => {
        const [a, b] = l.split('|');
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: (size * 0.45) + 'px 0' }}>
            <div style={Object.assign({}, base, { flex: '0 1 auto', fontWeight: 600, lineHeight: 1.3 })}>{(a || '').trim()}</div>
            <div style={{ flex: 1, borderBottom: '2px dotted ' + el.color, opacity: 0.35, minWidth: 20, transform: 'translateY(-4px)' }} />
            <div style={Object.assign({}, base, { flex: 'none', fontWeight: 800 })}>{(b || '').trim()}</div>
          </div>
        );
      });
    } else {
      const rows = lines.map((l): [string, number] => { const i = l.lastIndexOf(':'); return [l.slice(0, i).trim(), parseFloat(l.slice(i + 1)) || 0]; });
      const mx = Math.max(1, ...rows.map((r) => r[1]));
      body = rows.map(([lab, val], i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: size * 0.8 }}>
          <div style={Object.assign({}, base, { width: '30%', fontWeight: 700, lineHeight: 1.2 })}>{lab}</div>
          <div style={{ flex: 1, height: size * 1.5, background: el.track, borderRadius: 999, overflow: 'hidden', position: 'relative' }}><div style={{ width: (val / mx * 100) + '%', height: '100%', background: el.bar, borderRadius: 999 }} /></div>
          <div style={Object.assign({}, base, { width: '10%', textAlign: 'right', fontWeight: 800 })}>{String(val)}</div>
        </div>
      ));
    }
  }
  const selChrome = sel && (
    <>
      <div data-sel="1" style={{ position: 'absolute', inset: 0, outline: (2 / z) + 'px solid #C81F75', outlineOffset: (1 / z) + 'px', pointerEvents: 'none' }} />
      {/* Resize handle: larger hit area on touch screens, same visual size. */}
      <div data-sel="1" onPointerDown={(e) => it.onElDown(e, el, 'resize')} style={{ position: 'absolute', right: -7 / z, bottom: -7 / z, width: 14 / z, height: 14 / z, borderRadius: 999, background: '#fff', border: (2 / z) + 'px solid #C81F75', boxSizing: 'border-box', cursor: 'nwse-resize', touchAction: 'none' }}>
        <div style={{ position: 'absolute', inset: -10 / z }} />
      </div>
    </>
  );
  return (
    <div key={el.id} id={inter ? 'el-' + el.id : undefined} style={box}
      onPointerDown={it ? (e) => it.onElDown(e, el, 'move') : undefined}
      onDoubleClick={it ? () => it.onElDbl(el) : undefined}>
      {body}
      {selChrome}
    </div>
  );
}

export interface ArtboardProps {
  doc: Doc; page: Page; index: number; z: number; prefix: string; interact?: Interact | null;
  /** Preview only (library thumbnails, design-system previews): use small logo copies. Never set on boards that get exported. */
  lite?: boolean;
}

export function Artboard({ doc, page, index, z, prefix, interact, lite }: ArtboardProps) {
  return (
    <div id={prefix + page.id} onPointerDown={interact ? interact.onBoardDown : undefined}
      style={{ position: 'relative', width: doc.w, height: doc.h, background: page.bg, overflow: 'hidden', transform: z === 1 ? 'none' : 'scale(' + z + ')', transformOrigin: '0 0', fontFamily: FONTS.body, userSelect: 'none', WebkitUserSelect: 'none' }}>
      {page.elements.map((el) => element(el, page, index, doc, z, interact || null, !!lite))}
    </div>
  );
}
