'use client';
import { useRef, useState, type CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import { Icon } from '@/ds';
import { DOCS, ELEMENT_KINDS, PHOTOS, SWATCHES, TEMPLATES, V, FORMATS, PAGE_SIZES, pageKinds } from '@/lib/studio';
import type { AddKind, Doc, El, ElPatch } from '@/lib/studio';
import { scaleFor } from '@/lib/export';
import { Artboard, type Interact } from './Artboard';
import { EditorTools } from './EditorTools';
import type { Panel, Studio } from './Studio';
import s from './studio.module.css';

const Cap = ({ children }: { children: React.ReactNode }) => <span className={s.cap}>{children}</span>;

function Seg({ on, onClick, children, title, label }: { on?: boolean; onClick: () => void; children: React.ReactNode; title?: string; label?: string }) {
  return <button type="button" title={title} aria-label={label} aria-pressed={!!on} onClick={onClick} className={`${s.seg} ${on ? s.segOn : ''}`}>{children}</button>;
}

function Swatches({ app, label, cur, pick, none }: { app: Studio; label: string; cur?: string; pick: (c: string) => void; none?: boolean }) {
  const list = (none ? [''] : []).concat(SWATCHES);
  return (
    <div className={s.col8}>
      <Cap>{label}</Cap>
      <div className={s.swRow}>
        {list.map((c) => (
          <button key={c || 'none'} type="button" title={c || 'None'} aria-label={c || 'None'} aria-pressed={(cur || '').toUpperCase() === c.toUpperCase()} onClick={() => pick(c)} className={s.swatch}
            style={{ background: c || 'repeating-linear-gradient(45deg,#fff 0 4px,#F59AC6 4px 6px)', boxShadow: (cur || '').toUpperCase() === c.toUpperCase() ? '0 0 0 2px var(--a-surface), 0 0 0 4px #C81F75' : 'none' }} />
        ))}
        <input key={cur || ''} aria-label={label + ' hex value'} defaultValue={cur || ''} className={s.hex} autoCapitalize="off" autoCorrect="off" autoComplete="off" spellCheck={false} enterKeyHint="done"
          onBlur={(e) => { const v = e.target.value.trim(); if (v === (cur || '')) return; if (/^#[0-9a-f]{6}$/i.test(v) || (none && v === '') || v === 'transparent') pick(v); else { app.toast('Use a 6-digit hex value like #3D1D10.', 'error'); e.target.value = cur || ''; } }}
          onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }} />
      </div>
    </div>
  );
}

/** Number input that keeps the typed text while focused (so it can be cleared and retyped).
    `signed` fields skip the decimal keypad, which has no minus key on iPhone. */
function DraftNumber({ value, step, onValue, label, className, style, inputMode = 'decimal', signed }: { value: number | undefined; step: number; onValue: (v: number) => void; label?: string; className?: string; style?: CSSProperties; inputMode?: 'decimal' | 'numeric'; signed?: boolean }) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <input type="number" inputMode={signed ? undefined : inputMode} step={step} aria-label={label} className={className} style={style} enterKeyHint="done"
      value={draft ?? (value ?? '')}
      onFocus={() => setDraft(value == null ? '' : String(value))}
      onBlur={() => setDraft(null)}
      onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
      onChange={(e) => { setDraft(e.target.value); const v = parseFloat(e.target.value); if (!isNaN(v)) onValue(v); }} />
  );
}

/** Number field; with `stepper`, touch screens also get −/+ buttons for one-handed nudging. */
function NumField({ label, value, step, onValue, signed, stepper, nudge }: { label: string; value: number | undefined; step: number; onValue: (v: number) => void; signed?: boolean; stepper?: boolean; nudge?: number }) {
  const n = nudge || step, v = value ?? 0, round = (x: number) => +x.toFixed(4);
  if (!stepper) return <label className={s.numLabel}>{label}<DraftNumber value={value} step={step} onValue={onValue} className={s.num} signed={signed} /></label>;
  return (
    <div className={s.numLabel}>
      <span>{label}</span>
      <div className={s.stepper}>
        <button type="button" className={s.stepBtn} aria-label={'Decrease ' + label} onClick={() => onValue(round(v - n))}><Icon name="minus" size={16} /></button>
        <DraftNumber value={value} step={step} onValue={onValue} className={s.num} signed={signed} label={label} />
        <button type="button" className={s.stepBtn} aria-label={'Increase ' + label} onClick={() => onValue(round(v + n))}><Icon name="plus" size={16} /></button>
      </div>
    </div>
  );
}

/** Drag handle on phone sheets: tap to expand/shrink, swipe up to expand, swipe down to shrink or close. */
function SheetHandle({ app }: { app: Studio }) {
  const start = useRef<number | null>(null); const full = app.state.sheetFull;
  return (
    <button type="button" className={s.sheetHandle} aria-label={full ? 'Shrink panel' : 'Expand panel'} aria-expanded={full}
      onPointerDown={(e) => { start.current = e.clientY; try { (e.currentTarget as Element).setPointerCapture(e.pointerId); } catch { /* not supported */ } }}
      onPointerUp={(e) => { const y0 = start.current; start.current = null; if (y0 == null) return; const dy = e.clientY - y0;
        if (Math.abs(dy) < 10) app.setState({ sheetFull: !full }); else if (dy < -40) app.setState({ sheetFull: true }); else if (dy > 40) { if (full) app.setState({ sheetFull: false }); else app.setState({ panel: 'canvas' }); } }}
      onPointerCancel={() => { start.current = null; }}
      onClick={(e) => { if (e.detail === 0) app.setState({ sheetFull: !full }); }}>
      <span />
    </button>
  );
}

/** Phones: once a field is focused, keep it in view above the keyboard. */
const keepInView = (e: React.FocusEvent) => {
  const t = e.target as HTMLElement; if (!/INPUT|TEXTAREA|SELECT/.test(t.tagName) || !matchMedia('(max-width: 899px)').matches) return;
  setTimeout(() => t.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 300);
};

function PagesPanel({ app }: { app: Studio }) {
  const st = app.state, d = st.doc as Doc, pg = d.pages[st.selPage] || d.pages[0], narrow = app.narrow();
  const kinds = pageKinds(d);
  const kindLabel = (p: Doc['pages'][number]) => d.mode === 'doc' && p.kind && d.docType ? DOCS[d.docType].kinds[p.kind].label : (typeof p.spec === 'string' && V[p.spec] ? V[p.spec].name : 'Page');
  return (
    <aside className={`${s.nav} ${narrow ? s.sheet : ''} ${narrow && st.sheetFull ? s.sheetFull : ''}`} aria-label="Pages and layers" data-sheet={narrow ? '' : undefined} onFocus={keepInView}>
      {narrow && <SheetHandle app={app} />}
      <div className={s.navHead}>
        <div className={s.rowBetween}><Cap>Pages · {d.pages.length}</Cap>{narrow && <button type="button" className={s.close} onClick={() => app.setState({ panel: 'canvas' })}>Close</button>}</div>
        {kinds.length > 0 && (
          <select aria-label="Page type to add" value={st.addKind} onChange={(e) => app.setState({ addKind: e.target.value })} className={s.select36}>
            <option value="">Duplicate of current page</option>
            {kinds.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        )}
        <div style={{ display: 'flex', gap: 6 }}>
          <button type="button" onClick={() => app.addPage(true)} className={`${s.smallBtn} ${s.flex1}`}>+ Before</button>
          <button type="button" onClick={() => app.addPage(false)} className={`${s.pinkBtn} ${s.flex1}`}>+ After</button>
        </div>
      </div>
      <div className={s.pageList}>
        {d.pages.map((p, i) => {
          const on = i === st.selPage; const n = app.pageNum(d, i);
          return (
            <div key={p.id} draggable onDragStart={(e) => { app.dragFrom = i; e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', String(i)); } catch { /* some browsers refuse */ } }}
              onDragOver={(e) => { e.preventDefault(); if (st.dragOver !== i) app.setState({ dragOver: i }); }} onDrop={(e) => { e.preventDefault(); app.movePage(app.dragFrom, i); }} onDragEnd={() => app.setState({ dragOver: null })}
              className={s.pageRow} style={{ background: on ? 'var(--a-sunken)' : 'transparent', boxShadow: on ? 'inset 3px 0 0 #C81F75' : st.dragOver === i ? 'inset 0 2px 0 #C81F75' : 'none' }}>
              <button type="button" onClick={() => app.goPage(i)} className={s.pageBtn} aria-current={on ? 'page' : undefined}>
                <span className={s.pageNum}>{i + 1}</span>
                <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <span className={s.ellipsis} style={{ font: '700 13px var(--font-body)' }}>{p.name}</span>
                  <span className={s.ellipsis} style={{ fontSize: 11, color: 'var(--a-fg2)' }}>{kindLabel(p) + (n != null ? ' · p.' + n : '') + (p.toc ? ' · in contents' : '')}</span>
                </span>
              </button>
              {on && (
                <div className={s.pageActs}>
                  <button type="button" title="Move up" aria-label="Move page up" onClick={() => app.movePage(i, i - 1)} className={s.mini}><Icon name="chevron-up" size={14} /></button>
                  <button type="button" title="Move down" aria-label="Move page down" onClick={() => app.movePage(i, i + 1)} className={s.mini}><Icon name="chevron-down" size={14} /></button>
                  <button type="button" title="Duplicate" aria-label="Duplicate page" onClick={() => app.dupPage(i)} className={s.mini}><Icon name="copy" size={14} /></button>
                  <button type="button" title="Delete" aria-label="Delete page" onClick={() => app.delPage(i)} className={s.mini}><Icon name="trash-2" size={14} /></button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className={s.layers}>
        <span className={s.cap} style={{ padding: '0 6px 6px' }}>Layers on this page</span>
        {pg.elements.slice().reverse().map((e) => (
          <div key={e.id} className={s.layerRow} style={{ background: st.selEl === e.id ? 'var(--a-sunken)' : 'transparent' }}>
            <button type="button" onClick={() => app.setState({ selEl: e.id, panel: narrow ? 'edit' : st.panel })} className={s.layerBtn}>
              <strong style={{ fontWeight: 700 }}>{ELEMENT_KINDS[e.type]}</strong> {e.type === 'text' ? '“' + String(e.text).slice(0, 28) + '”' : e.type === 'image' ? (e.src ? '' : '(empty)') : ''}
            </button>
            <button type="button" title="Bring forward" aria-label="Bring forward" onClick={() => app.zEl(e.id, 'up')} className={s.mini}><Icon name="arrow-up" size={13} /></button>
            <button type="button" title="Send backward" aria-label="Send backward" onClick={() => app.zEl(e.id, 'down')} className={s.mini}><Icon name="arrow-down" size={13} /></button>
          </div>
        ))}
      </div>
    </aside>
  );
}

function Canvas({ app }: { app: Studio }) {
  const st = app.state, d = st.doc as Doc, z = app.zoom(), narrow = app.narrow();
  const touch = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;
  const interact = (pi: number): Interact => ({
    preview: st.preview, touch,
    selected: (el) => !st.preview && !st.exporting && st.selPage === pi && st.selEl === el.id,
    onElDown: (e, el, mode) => app.startDrag(e, pi, el.id, mode),
    onElDbl: () => { app.setState({ panel: 'edit' }); setTimeout(() => { const t = document.getElementById('insp-text'); if (t) t.focus(); }, 50); },
    onBoardDown: (e) => { if (e.button) return; app.setState({ selPage: pi, selEl: null }); },
  });
  const col: CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: narrow ? 28 : 48, padding: narrow ? '72px ' + (12 + st.sheetW) + 'px ' + (110 + st.sheetH) + 'px 12px' : '40px 32px', minWidth: 'fit-content', boxSizing: 'border-box', minHeight: '100%', justifyContent: d.pages.length === 1 ? 'center' : 'flex-start' };
  return (
    <div className={s.canvasWrap}>
      {narrow && <EditorTools app={app} floating />}
      {narrow && !st.preview && st.panel === 'canvas' && st.selEl && <SelectionBar app={app} />}
      <div id="canvas-scroll" className={s.canvas} onPointerDown={(e) => { if (e.target === e.currentTarget || e.target === e.currentTarget.firstChild) app.setState({ selEl: null }); }}>
        <div style={col}>
          {d.pages.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
              {!st.preview && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: '700 12px var(--font-body)', color: 'var(--a-fg2)' }}>
                  <span>{(i + 1) + ' · ' + p.name}</span>
                  <button type="button" onClick={() => void app.exportPage(i, 'png')} title="Download this page as PNG" className={s.pngBtn}>PNG</button>
                </div>
              )}
              <div id={'pw-' + p.id} style={{ width: d.w * z, height: d.h * z, flex: 'none', boxShadow: '0 16px 36px -12px rgba(30,13,6,.35)', outline: i === st.selPage && !st.preview ? '3px solid #C81F75' : 'none', outlineOffset: 4 }}>
                <Artboard doc={d} page={p} index={i} z={z} prefix="ab-" interact={interact(i)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Phones: actions for the selected element, so nothing needs a double-tap or a hidden menu. */
function SelectionBar({ app }: { app: Studio }) {
  const el = app.curEl(); if (!el) return null;
  const textual = ['text', 'table', 'toc', 'chart', 'pageno'].includes(el.type);
  const edit = () => {
    // Render the sheet synchronously so the text field can take focus inside this tap (iOS only opens the keyboard then).
    flushSync(() => app.setState({ panel: 'edit' }));
    if (textual) { const t = document.getElementById('insp-text') as HTMLTextAreaElement | null; if (t) { t.focus(); const n = t.value.length; try { t.setSelectionRange(n, n); } catch { /* not a text field */ } } }
  };
  const B = ({ icon, label, onClick, cls }: { icon: string; label: string; onClick: () => void; cls?: string }) => <button type="button" className={`${s.selBtn} ${cls || ''}`} onClick={onClick}><Icon name={icon} size={18} />{label}</button>;
  return (
    <div className={s.selBar} role="toolbar" aria-label="Selected element">
      <B icon={textual ? 'pencil' : 'sliders-horizontal'} label={textual ? 'Edit text' : 'Edit'} onClick={edit} cls={s.selBtnPink} />
      <B icon="copy" label="Duplicate" onClick={() => app.dupEl()} />
      <B icon="arrow-up" label="Forward" onClick={() => app.zEl(el.id, 'up')} />
      <B icon="arrow-down" label="Back" onClick={() => app.zEl(el.id, 'down')} />
      <B icon="trash-2" label="Delete" onClick={() => app.delEl()} cls={s.selBtnDanger} />
      <B icon="check" label="Done" onClick={() => app.setState({ selEl: null })} />
    </div>
  );
}

const ADD: [AddKind, string, string][] = [['heading', 'Heading', 'heading'], ['text', 'Paragraph', 'pilcrow'], ['label', 'Label', 'tag'], ['cta', 'Button / CTA', 'mouse-pointer-click'], ['image', 'Image', 'image'], ['shape', 'Shape', 'square'], ['logo', 'Logo', 'cake'], ['ribbon', 'Ribbon', 'heart'], ['table', 'Table', 'table'], ['chart', 'Chart', 'chart-column'], ['toc', 'Contents', 'list-ordered'], ['pageno', 'Page no.', 'hash']];
const TEXT_LABEL: Record<string, string> = { text: 'Text', table: 'Table rows', toc: 'Contents entries', chart: 'Chart data', pageno: 'Page number format' };
const TEXT_HINT: Record<string, string> = { text: 'Line breaks are kept. Blank lines separate paragraphs.', table: 'One row per line · separate cells with |  · first row is the header.', toc: 'One entry per line: Title | page. Use “Update contents page” to rebuild from pages.', chart: 'One bar per line: Label: value. Illustrative until real data is supplied.', pageno: '{n} is replaced by the page number.' };
const SWATCH_KEYS: Record<string, [string, keyof El, boolean?][]> = { text: [['Text colour', 'color'], ['Background', 'bg', true]], pageno: [['Text colour', 'color']], image: [['Ring', 'ring', true]], shape: [['Fill', 'fill'], ['Outline', 'stroke', true]], logo: [['Tile', 'tile']], ribbon: [['Colour', 'color']], table: [['Text', 'color'], ['Header', 'head'], ['Rules', 'line']], toc: [['Text', 'color']], chart: [['Text', 'color'], ['Bar', 'bar'], ['Track', 'track']] };

function ElementInspector({ app, el }: { app: Studio; el: El }) {
  const st = app.state, d = st.doc as Doc, t = el.type;
  const upd = (p: ElPatch, mode?: 'hist' | 'coalesce') => app.updEl(p, mode);
  const isText = t === 'text' || t === 'pageno', hasTextField = ['text', 'table', 'toc', 'chart', 'pageno'].includes(t);
  return (
    <>
      <div className={s.wrapRow}>
        <button type="button" onClick={() => app.dupEl()} className={s.smallBtn}><Icon name="copy" size={14} />Duplicate</button>
        <button type="button" onClick={() => app.zEl(el.id, 'top')} className={s.smallBtn}>To front</button>
        <button type="button" onClick={() => app.zEl(el.id, 'bottom')} className={s.smallBtn}>To back</button>
        <button type="button" onClick={() => app.delEl()} className={s.dangerBtn}><Icon name="trash-2" size={14} />Delete</button>
      </div>
      {hasTextField && (
        <label className={s.fieldCap}>{TEXT_LABEL[t] || 'Text'}
          <textarea id="insp-text" autoCapitalize="sentences" value={el.text || ''} onChange={(e) => upd({ text: e.target.value }, 'coalesce')} rows={t === 'text' && (el.text || '').length > 120 ? 8 : 4} className={s.textarea} />
          <span className={s.hint}>{TEXT_HINT[t]}</span>
        </label>
      )}
      {hasTextField && st.overflow && t === 'text' && (
        <div className={s.overflow}>
          <strong>Text is overflowing this box.</strong><span>Enlarge the box, reduce the size, or move the extra paragraphs to a new page.</span>
          <button type="button" onClick={() => app.flow()} className={s.overflowBtn}>Flow overflow to new page</button>
        </div>
      )}
      {isText && (
        <div className={s.col10}>
          <Cap>Typography</Cap>
          <div className={s.grid2}>
            <select aria-label="Font" value={el.font} onChange={(e) => upd({ font: e.target.value as El['font'] })} className={s.select36}><option value="display">Caprasimo (display)</option><option value="body">Figtree (body)</option></select>
            <select aria-label="Weight" value={String(el.weight)} onChange={(e) => upd({ weight: +e.target.value })} className={s.select36}><option value="400">Regular 400</option><option value="500">Medium 500</option><option value="600">Semibold 600</option><option value="700">Bold 700</option><option value="800">Black 800</option></select>
          </div>
          <div className={s.numGrid}>
            {([['Size', 'size', 1, 4, 2], ['Line height', 'lh', 0.05, 0.6, 0.05], ['Letter sp. (em)', 'ls', 0.01, undefined, 0.01], ['Padding', 'pad', 1, 0, 2], ['Radius', 'radius', 1, 0, 2]] as [string, keyof ElPatch, number, number | undefined, number][]).map(([label, k, step, mn, nudge]) => (
              <NumField key={k} label={label} step={step} nudge={nudge} stepper signed={k === 'ls'} value={el[k] as number | undefined} onValue={(v) => upd({ [k]: mn != null ? Math.max(mn, v) : v }, 'coalesce')} />
            ))}
          </div>
          <div className={s.wrapRow4}>
            {([['left', 'Align left', 'align-left'], ['center', 'Align centre', 'align-center'], ['right', 'Align right', 'align-right'], ['justify', 'Justify', 'align-justify']] as const).map(([v, title, icon]) => <Seg key={v} title={title} label={title} on={el.align === v} onClick={() => upd({ align: v })}><Icon name={icon} size={16} /></Seg>)}
            {([['top', 'Top', 'align-vertical-justify-start'], ['center', 'Middle', 'align-vertical-justify-center'], ['bottom', 'Bottom', 'align-vertical-justify-end']] as const).map(([v, title, icon]) => <Seg key={v} title={'Vertical ' + title} label={'Vertical ' + title} on={el.valign === v} onClick={() => upd({ valign: v })}><Icon name={icon} size={16} /></Seg>)}
          </div>
          <div className={s.wrapRow4}>
            <Seg on={!!el.upper} onClick={() => upd({ upper: !el.upper })}>UPPERCASE</Seg>
            <Seg on={!!el.italic} onClick={() => upd({ italic: !el.italic })}>Italic</Seg>
          </div>
        </div>
      )}
      {t === 'image' && (
        <div className={s.col10}>
          <Cap>Image</Cap>
          <div className={s.photoGrid}>
            {PHOTOS.map(([name, src]) => (
              <button key={src} type="button" onClick={() => upd({ src })} title={name} aria-label={name} aria-pressed={el.src === src} className={s.photo} style={{ border: '2px solid ' + (el.src === src ? '#C81F75' : 'transparent') }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- static brand photo */}
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </button>
            ))}
          </div>
          <div className={s.wrapRow}>
            <button type="button" onClick={() => document.getElementById('file-in')?.click()} className={s.pinkBtn}><Icon name="upload" size={14} />Upload / replace</button>
            <button type="button" onClick={() => upd({ src: '' })} className={s.smallBtn}>Empty placeholder</button>
          </div>
          <span className={s.hint}>Brand photos are conceptual crops from the original flyer — replace with real product photography before publishing.</span>
          <div className={s.wrapRow4}>
            {([['none', 'Square'], ['round', 'Rounded'], ['arch', 'Arch'], ['circle', 'Circle']] as const).map(([v, l]) => <Seg key={v} on={el.frame === v} onClick={() => upd({ frame: v })}>{l}</Seg>)}
            {([['cover', 'Fill'], ['contain', 'Fit']] as const).map(([v, l]) => <Seg key={v} on={el.fit === v} onClick={() => upd({ fit: v })}>{l}</Seg>)}
          </div>
          <div className={s.wrapRow4}><Seg on={!!el.scrim} onClick={() => upd({ scrim: !el.scrim })}>Photo scrim</Seg></div>
        </div>
      )}
      {t === 'logo' && (
        <div className={s.col10}>
          <Cap>Logo</Cap>
          <div className={s.wrapRow4}>
            <Seg on={el.variant === 'full'} onClick={() => upd({ variant: 'full' })}>Full logo</Seg>
            <Seg on={el.variant === 'mark'} onClick={() => upd({ variant: 'mark' })}>Monogram (provisional)</Seg>
          </div>
          <span className={s.hint}>The official logo is raster with a cream ground — it always sits on a cream tile. The monogram crop is provisional.</span>
        </div>
      )}
      {(SWATCH_KEYS[t] || []).map(([label, k, none]) => <Swatches key={label} app={app} label={label} cur={el[k] as string | undefined} none={none} pick={(c) => upd({ [k]: c })} />)}
      <div className={s.col8}>
        <Cap>Position & size (px)</Cap>
        <div className={s.grid4}>
          {([['X', 'x'], ['Y', 'y'], ['W', 'w'], ['H', 'h']] as const).map(([label, k]) => <NumField key={k} label={label} step={1} nudge={5} stepper signed={k === 'x' || k === 'y'} value={el[k]} onValue={(v) => upd({ [k]: k === 'w' || k === 'h' ? Math.max(8, Math.round(v)) : Math.round(v) }, 'coalesce')} />)}
        </div>
        <div className={s.wrapRow4}>
          <button type="button" className={s.smallBtn} onClick={() => upd({ x: Math.round((d.w - el.w) / 2) })}>Centre horizontally</button>
          <button type="button" className={s.smallBtn} onClick={() => upd({ y: Math.round((d.h - el.h) / 2) })}>Centre vertically</button>
          <button type="button" className={s.smallBtn} onClick={() => upd({ x: 0, y: 0, w: d.w, h: d.h })}>Fill page</button>
        </div>
        <label className={s.rangeLabel}>Opacity<input type="range" min="0.1" max="1" step="0.05" value={el.opacity == null ? 1 : el.opacity} onChange={(e) => upd({ opacity: +e.target.value }, 'coalesce')} /></label>
      </div>
    </>
  );
}

function PageInspector({ app }: { app: Studio }) {
  const st = app.state, d = st.doc as Doc, pg = d.pages[st.selPage] || d.pages[0];
  const ft = d.pages[0].elements.find((e) => e.key === 'title'), fs = d.pages[0].elements.find((e) => e.key === 'sub');
  const tpl = TEMPLATES.find((t) => t.id === d.tpl); const sizes = (tpl && tpl.sizes) || [d.formatId];
  const sc = scaleFor(d);
  return (
    <>
      <div className={s.col10}>
        <Cap>Add element</Cap>
        <div className={s.addGrid}>
          {ADD.map(([k, label, icon]) => <button key={k} type="button" onClick={() => app.addEl(k)} className={s.addBtn}><Icon name={icon} size={18} />{label}</button>)}
        </div>
      </div>
      {d.cat === 'editorial' && (
        <div className={s.article}>
          <Cap>Article</Cap>
          <input aria-label="Article title" value={ft ? ft.text : ''} onChange={(e) => app.setArticle('title', e.target.value)} placeholder="Article title" className={s.input38} />
          <input aria-label="Article subtitle" value={fs ? fs.text : ''} onChange={(e) => app.setArticle('sub', e.target.value)} placeholder="Subtitle (optional)" className={s.input38} />
        </div>
      )}
      <div className={s.col8}>
        <Cap>This page</Cap>
        <input aria-label="Page name" value={pg.name} onChange={(e) => app.updPage({ name: e.target.value }, 'coalesce')} className={s.input36} />
        <div className={s.wrapRow4}>
          {d.mode === 'doc' && <>
            <Seg on={pg.numbered !== false} onClick={() => app.updPage({ numbered: pg.numbered === false })}>Numbered</Seg>
            <Seg on={!!pg.toc} onClick={() => app.updPage({ toc: !pg.toc })}>In contents</Seg>
          </>}
          {(pg.kind || pg.spec) && <Seg onClick={() => app.reapplyLayout()}>Re-apply page layout</Seg>}
        </div>
      </div>
      <Swatches app={app} label="Page background" cur={pg.bg} pick={(c) => app.updPage({ bg: c })} />
      <div className={s.col8}>
        <Cap>Document</Cap>
        <label className={s.field}>Name<input value={d.name} onChange={(e) => app.mut((dd) => { dd.name = e.target.value; }, 'coalesce')} className={s.input36} /></label>
        <label className={s.field}>Size / aspect ratio
          <select value={d.formatId} onChange={(e) => app.setSize(e.target.value)} className={s.select36}>
            {sizes.map((k) => { const f = FORMATS[k] || PAGE_SIZES[k]; return <option key={k} value={k}>{f.label + ' · ' + f.w + '×' + f.h}</option>; })}
          </select>
        </label>
        <span style={{ fontSize: 12, color: 'var(--a-fg2)' }}>{'Canvas ' + d.w + ' × ' + d.h + ' px · exports at ' + Math.round(d.w * sc) + ' × ' + Math.round(d.h * sc) + ' px (1×)'}</span>
        {d.mode === 'doc' && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <Seg on={d.pageNumbers && d.pageNumbers.show} onClick={() => app.mut((dd) => { dd.pageNumbers.show = !dd.pageNumbers.show; })}>Page numbers</Seg>
            <label className={s.numLabel}>Start at<DraftNumber inputMode="numeric" step={1} value={d.pageNumbers ? d.pageNumbers.start : 1} onValue={(v) => app.mut((dd) => { dd.pageNumbers.start = Math.max(0, Math.round(v) || 1); })} className={s.num} style={{ width: 70 }} /></label>
            <button type="button" onClick={() => app.regenToc()} className={s.smallBtn}>Update contents page</button>
          </div>
        )}
        <button type="button" onClick={() => app.resetTpl()} className={s.dangerBtn} style={{ alignSelf: 'flex-start', marginTop: 4 }}><Icon name="rotate-ccw" size={14} />Reset template to original</button>
      </div>
    </>
  );
}

function Inspector({ app }: { app: Studio }) {
  const st = app.state, el = app.curEl(), narrow = app.narrow();
  return (
    <aside className={`${s.insp} ${narrow ? s.sheet : ''} ${narrow && st.sheetFull ? s.sheetFull : ''}`} aria-label="Properties" data-sheet={narrow ? '' : undefined} onFocus={keepInView}>
      {narrow && <SheetHandle app={app} />}
      <div className={s.inspHead}>
        <Cap>{el ? ELEMENT_KINDS[el.type] : 'Page & document'}</Cap>
        <div style={{ display: 'flex', gap: 6 }}>
          {el && <button type="button" onClick={() => app.setState({ selEl: null })} className={s.linkBtn}>Page settings</button>}
          {narrow && <button type="button" className={s.close} onClick={() => app.setState({ panel: 'canvas' })}>Close</button>}
        </div>
      </div>
      <div className={s.inspBody}>
        {el ? <ElementInspector key={el.id} app={app} el={el} /> : <PageInspector key={'p' + st.selPage} app={app} />}
      </div>
    </aside>
  );
}

const TABS: [Panel | 'export', string, string][] = [['pages', 'Pages', 'layers'], ['canvas', 'Canvas', 'square-pen'], ['edit', 'Edit', 'sliders-horizontal'], ['export', 'Export', 'download']];

export function Editor({ app }: { app: Studio }) {
  const st = app.state, narrow = app.narrow(), side = !st.preview;
  const showNav = side && (!narrow || st.panel === 'pages'), showInsp = side && (!narrow || st.panel === 'edit');
  return (
    <div className={s.editor}>
      {showNav && <PagesPanel app={app} />}
      <Canvas app={app} />
      {showInsp && <Inspector app={app} />}
      {narrow && (
        <nav className={s.tabbar} aria-label="Editor">
          {TABS.map(([id, label, icon]) => (
            <button key={id} type="button" aria-pressed={st.panel === id} onClick={() => id === 'export' ? app.setState({ exportOpen: true }) : app.setState({ panel: st.panel === id && id !== 'canvas' ? 'canvas' : id })} className={s.tab} style={{ color: st.panel === id ? '#C81F75' : 'var(--a-fg)' }}>
              <Icon name={icon} size={18} />{label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
