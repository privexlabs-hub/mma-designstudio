'use client';
import { useEffect, useRef } from 'react';
import { Icon } from '@/ds';
import * as X from '@/lib/export';
import type { Doc } from '@/lib/studio';
import type { Studio } from './Studio';
import s from './studio.module.css';

interface Item { label: string; sub: string; onClick: () => void }

export function ExportDialog({ app }: { app: Studio }) {
  const st = app.state, d = st.doc as Doc, multi = d.pages.length > 1, P1 = st.selPage;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const close = () => app.setState({ exportOpen: false });
  const g1: Item[] = [
    { label: 'PNG', sub: 'Page ' + (P1 + 1) + ' · lossless', onClick: () => void app.exportPage(P1, 'png') },
    { label: 'JPG', sub: 'Page ' + (P1 + 1) + ' · smaller file', onClick: () => void app.exportPage(P1, 'jpeg') },
    { label: 'SVG', sub: 'Page ' + (P1 + 1) + ' · vector wrapper*', onClick: () => void app.exportPage(P1, 'svg') },
    { label: 'PDF', sub: 'Page ' + (P1 + 1) + ' only', onClick: () => void app.run('PDF page', () => X.pdf(Object.assign({}, d, { name: d.name + ' p' + (P1 + 1) }), [app.nodes()[P1]])) },
  ];
  const g2: Item[] = [
    { label: 'PDF', sub: 'Multi-page, in order', onClick: () => void app.run('PDF', () => X.pdf(d, app.nodes())) },
    { label: 'PNG (ZIP)', sub: 'One file per page', onClick: () => void app.exportZip('png') },
    { label: 'JPG (ZIP)', sub: 'One file per page', onClick: () => void app.exportZip('jpeg') },
    { label: 'PPTX', sub: 'Editable slides, native text', onClick: () => void app.run('PowerPoint', () => X.pptx(d)) },
  ];
  const g3: Item[] = [];
  if (d.mode === 'doc') g3.push({ label: 'DOCX', sub: 'Word, styles + images', onClick: () => void app.run('Word document', () => X.docx(d)) });
  if (d.mode === 'doc' && (d.docType === 'ebook' || d.docType === 'article' || d.docType === 'newsletter' || d.docType === 'report' || d.docType === 'whitepaper')) g3.push({ label: 'EPUB', sub: 'Reflowable ebook + nav', onClick: () => void app.run('EPUB', () => X.epub(d)) });
  g3.push({ label: 'HTML', sub: d.cat === 'email' ? 'Email layout, images embedded' : 'Layout-exact, self-contained', onClick: () => void app.run('HTML', () => X.html(d, app.nodes())) });
  if (d.mode === 'doc' || d.cat === 'email' || d.cat === 'web' || multi) {
    g3.push({ label: 'Markdown', sub: 'Headings, lists, tables', onClick: () => void app.run('Markdown', async () => X.md(d)) });
    g3.push({ label: 'Plain text', sub: 'Copy-ready', onClick: () => void app.run('Text', async () => X.txt(d)) });
  }
  g3.push({ label: 'Project file', sub: 'JSON — reopen & keep editing', onClick: () => void app.run('Project file', async () => X.json(d)) });
  const groups: [string, Item[]][] = [['Current page', g1], [multi ? 'All ' + d.pages.length + ' pages' : 'Whole design', g2], ['Editable & text formats', g3]];
  return (
    <div onClick={close} className={s.modalScrim}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="export-title" onClick={(e) => e.stopPropagation()} className={s.modal}>
        <div className={s.rowBetween} style={{ gap: 12 }}>
          <h2 id="export-title" className={s.h2} style={{ fontSize: 26 }}>Export</h2>
          <button type="button" onClick={close} aria-label="Close" className={s.round}><Icon name="x" size={18} /></button>
        </div>
        <p className={s.muted} style={{ fontSize: 13 }}>{'Exports use your current edits. Page ' + (P1 + 1) + ' of ' + d.pages.length + ' is selected. Fonts and export libraries are bundled with the app, so exports also work offline.'}</p>
        <div className={s.wrapRow} style={{ alignItems: 'center' }}>
          <span className={s.fieldInline}>Image scale</span>
          {[1, 2, 3].map((x) => <button key={x} type="button" aria-pressed={st.scale === x} onClick={() => app.setState({ scale: x })} className={`${s.seg} ${st.scale === x ? s.segOn : ''}`}>{x}×</button>)}
          <label className={s.fieldInline} style={{ marginLeft: 8, display: 'flex', alignItems: 'center', gap: 6 }}>JPG quality<input type="range" min="0.5" max="1" step="0.02" value={st.jpgQ} onChange={(e) => app.setState({ jpgQ: +e.target.value })} style={{ width: 90, accentColor: '#C81F75' }} /></label>
        </div>
        {groups.map(([title, items]) => (
          <div key={title} className={s.col8}>
            <span className={s.cap}>{title}</span>
            <div className={s.exGrid}>
              {items.map((x) => <button key={x.label} type="button" onClick={x.onClick} className={s.exBtn}><span style={{ font: '700 14px var(--font-body)' }}>{x.label}</span><span style={{ font: '12px var(--font-body)', color: 'var(--a-fg2)' }}>{x.sub}</span></button>)}
            </div>
          </div>
        ))}
        <p className={s.hint}>* SVG wraps the HTML layout inside an SVG, so some vector tools can’t edit it. PDF pages are images. DOCX and EPUB keep text, headings, lists, tables and images but not the exact layout.</p>
      </div>
    </div>
  );
}
