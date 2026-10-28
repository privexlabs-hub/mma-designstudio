'use client';
import { Button } from '@/ds';
import { CATS, FORMATS, TEMPLATES, V } from '@/lib/studio';
import type { Studio } from './Studio';
import s from './studio.module.css';

const GEN_VARIANTS = ['edcocoa', 'edcream', 'edphoto', 'edtype'];
const GEN_CHANNELS = ['xarticle', 'liarticle', 'lipost', 'medium', 'articlehero', 'blogpromo', 'nlpromo', 'pinterest'];

export function Library({ app }: { app: Studio }) {
  const st = app.state;
  const q = st.q.trim().toLowerCase();
  // Every typed word must match (name, subtitle or category), e.g. "christmas tiktok".
  const words = q.split(/\s+/).filter(Boolean);
  const hay = (t: (typeof TEMPLATES)[number]) => (t.name + ' ' + t.sub + ' ' + t.cat + ' ' + (CATS.find(([c]) => c === t.cat)?.[1] || '')).toLowerCase().replace(/[’']/g, '');
  const list = TEMPLATES.filter((t) => q ? words.every((w) => hay(t).includes(w.replace(/[’']/g, ''))) : t.cat === st.cat);
  const nb = Object.keys(st.bulk).filter((k) => st.bulk[k]).length;
  const lim = st.limit || 24;
  const phone = st.vw < 560;
  // Thumbnails fit a smaller box on phones so two cards fit per row.
  const tw = phone ? 136 : 216, thh = phone ? 132 : 168, boxH = phone ? 148 : 184;
  const g = st.gen; const setG = (p: Partial<typeof g>) => app.setState({ gen: Object.assign({}, g, p) });
  const toggle = (id: string) => app.setState({ bulk: Object.assign({}, st.bulk, { [id]: !st.bulk[id] }) });
  return (
    <main className={s.libMain}>
      <div className={s.libInner}>
        <div className={s.libHead}>
          <div className={s.libTitle}>
            <span className={s.eyebrow}>Template library</span>
            <h1>Pick a template, make it yours</h1>
          </div>
          <div className={s.libActions}>
            <input type="search" placeholder="Search all templates" value={st.q} onChange={(e) => app.setState({ q: e.target.value })} aria-label="Search templates" className={s.search} />
            <button type="button" onClick={() => app.setState({ selectMode: !st.selectMode })} className={`${s.pill} ${s.pill40} ${st.selectMode ? s.pillOn : ''}`} aria-pressed={st.selectMode}>{st.selectMode ? 'Done selecting' : 'Select for bulk export'}</button>
            <button type="button" onClick={() => document.getElementById('import-in')?.click()} className={`${s.pill} ${s.pill40}`}>Open project file</button>
          </div>
        </div>
        <div role="tablist" aria-label="Template categories" className={s.tabs}>
          {CATS.map(([id, label]) => {
            const on = !q && st.cat === id;
            return (
              <button key={id} role="tab" aria-selected={on} type="button" className={`${s.pill} ${on ? s.pillOn : ''}`}
                onClick={() => { app.setState({ q: '', limit: 24 }); app.props.navigate('/studio?cat=' + id); }}>
                {label} <span style={{ opacity: 0.7, fontWeight: 600 }}>{TEMPLATES.filter((t) => t.cat === id).length}</span>
              </button>
            );
          })}
        </div>
        {st.selectMode && (
          <div className={s.bulkBar}>
            <strong style={{ fontSize: 14 }}>{nb} selected</strong>
            <button type="button" className={s.smallBtn} onClick={() => { const b = Object.assign({}, st.bulk); list.forEach((t) => { b[t.id] = true; }); app.setState({ bulk: b }); }}>Select all shown</button>
            <button type="button" className={s.smallBtn} onClick={() => app.setState({ bulk: {} })}>Clear</button>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 13, color: 'var(--a-fg2)' }}>Download as ZIP:</span>
            {(['png', 'jpeg', 'pdf'] as const).map((t) => <button key={t} type="button" disabled={!nb} className={s.pinkBtn} onClick={() => void app.bulk(t)}>{t === 'jpeg' ? 'JPG' : t.toUpperCase()}</button>)}
          </div>
        )}
        {!q && st.cat === 'editorial' && (
          <section className={s.gen}>
            <div className={s.col}>
              <h2 className={s.h2}>Article banner generator</h2>
              <p className={s.muted}>Type a title and optional subtitle, choose a layout and channels, then open them in the editor or download them all.</p>
              <label className={s.field}>Article title<input value={g.title} onChange={(e) => setG({ title: e.target.value })} placeholder="e.g. How to store your celebration cake" className={s.input40} /></label>
              <label className={s.field}>Subtitle (optional)<input value={g.sub} onChange={(e) => setG({ sub: e.target.value })} placeholder="One line that tells readers what they will learn" className={s.input40} /></label>
            </div>
            <div className={s.col}>
              <span className={s.cap}>Layout</span>
              <div className={s.wrapRow}>{GEN_VARIANTS.map((k) => <button key={k} type="button" className={`${s.seg} ${g.variant === k ? s.segOn : ''}`} aria-pressed={g.variant === k} onClick={() => setG({ variant: k })}>{V[k].name.replace('Editorial · ', '')}</button>)}</div>
              <span className={s.cap}>Channels</span>
              <div className={s.wrapRow}>{GEN_CHANNELS.map((f) => <button key={f} type="button" className={`${s.seg} ${g.ch[f] ? s.segOn : ''}`} aria-pressed={!!g.ch[f]} onClick={() => setG({ ch: Object.assign({}, g.ch, { [f]: !g.ch[f] }) })}>{FORMATS[f].label}</button>)}</div>
              <div className={s.wrapRow} style={{ marginTop: 4, gap: 8 }}>
                <Button variant="primary" size="sm" icon="pen-line" onClick={() => { const ids = app.genDocs(); if (ids.length) { app.openTpl(ids[0]); app.toast(ids.length + ' banner(s) created — find the rest in this category marked “Edited”.', 'ok'); } }}>Open in editor</Button>
                <Button variant="secondary" size="sm" icon="download" onClick={() => { const ids = app.genDocs(); if (ids.length) void app.bulk('png', ids); }}>Download all (ZIP)</Button>
              </div>
            </div>
          </section>
        )}
        <div style={{ fontSize: 13, color: 'var(--a-fg2)' }}>{list.length + ' template' + (list.length === 1 ? '' : 's') + (q ? ' matching “' + st.q + '”' : '') + ' · ' + (st.selectMode ? 'tap to select' : 'click to open in the editor')}</div>
        <div className={s.grid}>
          {list.slice(0, lim).map((t) => {
            const th = app.thumb(t.id, tw, thh); const ck = !!st.bulk[t.id]; const aria = 'Open ' + t.name + ' — ' + t.sub;
            return (
              <div key={t.id} data-tpl={t.id} className={`${s.card} ${ck ? s.cardOn : ''}`}>
                <button type="button" onClick={() => st.selectMode ? toggle(t.id) : app.openTpl(t.id)} aria-label={st.selectMode ? 'Select ' + t.name + ' — ' + t.sub : aria} aria-pressed={st.selectMode ? ck : undefined} className={s.thumbBtn} style={{ height: boxH }}>
                  <div style={{ width: th.w, height: th.h, overflow: 'hidden', borderRadius: 4, boxShadow: '0 4px 14px -4px rgba(30,13,6,.3)', flex: 'none' }}>{th.node}</div>
                </button>
                <div className={s.cardMeta}>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span className={s.cardName}>{t.name}</span>
                    <span className={s.cardSub}>{t.sub}</span>
                  </div>
                  {!!app.saved[t.id] && <span className={s.edited}>Edited</span>}
                  {st.selectMode && <input type="checkbox" checked={ck} onChange={() => toggle(t.id)} aria-label={'Select ' + t.name + ' — ' + t.sub} className={s.check} />}
                </div>
              </div>
            );
          })}
        </div>
        {list.length > lim && <button type="button" onClick={() => app.setState({ limit: lim + 24 })} className={s.more}>{'Show ' + Math.min(24, list.length - lim) + ' more of ' + (list.length - lim)}</button>}
        {!list.length && <div style={{ padding: 48, textAlign: 'center', color: 'var(--a-fg2)' }}>No templates match “{st.q}”.</div>}
      </div>
    </main>
  );
}
