'use client';
import { useEffect, useState } from 'react';
import { Checkbox } from '@/ds';
import { CHECKLIST } from '@/content/brand';
import p from '@/components/page.module.css';

const KEY = 'tbm-checklist:v1';

/** The quality checklist from the design system, tickable. Ticks are remembered in this browser only. */
export function Checklist() {
  const [on, setOn] = useState<Record<number, boolean>>({});
  useEffect(() => { try { setOn(JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { /* ignore unreadable storage */ } }, []);
  const set = (i: number, v: boolean) => setOn((o) => { const n = { ...o, [i]: v }; try { localStorage.setItem(KEY, JSON.stringify(n)); } catch { /* storage unavailable */ } return n; });
  const count = CHECKLIST.filter((_, i) => on[i]).length;
  return (
    <div className="ds-stage" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
        <b style={{ fontSize: 15 }}>{count} of {CHECKLIST.length} checked</b>
        <button type="button" className={`${p.btn} ${p.btnSm}`} onClick={() => { setOn({}); try { localStorage.removeItem(KEY); } catch { /* storage unavailable */ } }}>Clear</button>
      </div>
      {CHECKLIST.map((c, i) => <Checkbox key={c} label={c} checked={!!on[i]} onChange={(v) => set(i, v)} />)}
      <span style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>Use it before publishing any layout. Ticks are saved in this browser only.</span>
    </div>
  );
}
