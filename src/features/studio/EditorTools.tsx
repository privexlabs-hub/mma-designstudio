'use client';
import { Button, Icon } from '@/ds';
import type { Studio } from './Studio';
import s from './studio.module.css';

/** Undo / redo / zoom / preview / export. In the header on wide screens, a floating bar on narrow ones. */
export function EditorTools({ app, floating }: { app: Studio; floating?: boolean }) {
  const st = app.state, d = st.doc; if (!d) return null;
  const z = app.zoom();
  const opts = [{ v: 'fit', l: 'Fit (' + Math.round(z * 100) + '%)' }].concat([0.25, 0.5, 0.75, 1, 1.5].map((x) => ({ v: String(x), l: x * 100 + '%' })));
  // A pinch-zoom level isn't one of the presets: list it so the menu shows the real zoom.
  if (st.zoomMode !== 'fit' && !opts.some((o) => o.v === String(st.zoomMode))) opts.splice(1, 0, { v: String(st.zoomMode), l: Math.round(z * 100) + '%' });
  return (
    <div className={floating ? s.floatTools : s.tools}>
      {!floating && st.vw >= 1150 && <span className={s.docName}>{d.name}</span>}
      <button type="button" className={s.round} title="Undo (Ctrl+Z)" aria-label="Undo" disabled={!st.hist.length} onClick={() => app.undo()}><Icon name="undo-2" size={16} /></button>
      <button type="button" className={s.round} title="Redo (Ctrl+Shift+Z)" aria-label="Redo" disabled={!st.fut.length} onClick={() => app.redo()}><Icon name="redo-2" size={16} /></button>
      <select aria-label="Zoom" className={s.zoom} value={String(st.zoomMode)} onChange={(e) => { app.setState({ zoomMode: e.target.value }); app.pendingCenter = true; }}>
        {opts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
      <button type="button" className={`${s.seg} ${st.preview ? s.segOn : ''} ${s.segTall}`} aria-pressed={st.preview} aria-label="Preview" onClick={() => app.setState({ preview: !st.preview, selEl: null })}>
        <Icon name="eye" size={16} /><span className={floating ? 'sr-only' : ''}>Preview</span>
      </button>
      {!floating && <Button variant="primary" size="sm" icon="download" onClick={() => app.setState({ exportOpen: true })}>Export</Button>}
    </div>
  );
}
