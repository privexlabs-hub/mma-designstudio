import type { CSSProperties } from 'react';
import { Icon } from '../core/Icon';

const C: Record<string, [string, string]> = { all: ['var(--cocoa-800)', 'grid-2x2'], cakes: ['var(--cat-cakes)', 'cake'], bakes: ['var(--cat-bakes)', 'croissant'], chops: ['var(--cat-chops)', 'sandwich'], yogurt: ['var(--cat-yogurt)', 'cup-soda'], celebration: ['var(--cat-celebration)', 'gift'] };

export interface CategoryTabsProps { items?: { id: string; label: string }[]; value?: string; onChange?: (id: string) => void; style?: CSSProperties }

export function CategoryTabs({ items = [], value, onChange, style }: CategoryTabsProps) {
  return (
    <div role="tablist" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 2px', scrollbarWidth: 'none', ...style }}>
      {items.map((it) => {
        const on = value === it.id; const c = C[it.id] || C.all;
        return (
          <button key={it.id} role="tab" aria-selected={on} type="button" onClick={() => onChange && onChange(it.id)}
            style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, height: 44, padding: '0 18px 0 14px', borderRadius: 'var(--radius-pill)', cursor: 'pointer', border: '2px solid ' + (on ? 'var(--cocoa-800)' : 'var(--border-default)'), background: on ? 'var(--cocoa-800)' : 'var(--surface)', color: on ? 'var(--cream-50)' : 'var(--cocoa-800)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14.5, transition: 'background var(--dur-base)' }}>
            <span style={{ color: on ? 'var(--gold-400)' : c[0], display: 'flex' }}><Icon name={c[1]} size={18} /></span>{it.label}
          </button>
        );
      })}
    </div>
  );
}
