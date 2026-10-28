'use client';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '../core/Icon';

export interface OptionCardProps { title: ReactNode; description?: ReactNode; icon?: string; selected?: boolean; onClick?: () => void; meta?: ReactNode; style?: CSSProperties }

export function OptionCard({ title, description, icon, selected, onClick, meta, style }: OptionCardProps) {
  const [hover, setHover] = useState(false);
  return (
    <button type="button" role="radio" aria-checked={!!selected} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 12, width: '100%', padding: '14px 16px', textAlign: 'left', fontFamily: 'var(--font-body)', cursor: 'pointer', background: selected ? 'var(--icing-50)' : 'var(--surface-elevated)', borderRadius: 'var(--radius-md)', border: '2px solid ' + (selected ? 'var(--icing-600)' : hover ? 'var(--border-strong)' : 'var(--border-default)'), transition: 'border-color var(--dur-fast), background var(--dur-fast)', ...style }}>
      {icon && <span style={{ width: 40, height: 40, flex: 'none', borderRadius: 12, background: selected ? 'var(--icing-100)' : 'var(--cream-200)', color: selected ? 'var(--icing-700)' : 'var(--cocoa-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={20} /></span>}
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{title}</span>
        {description && <span style={{ fontSize: 13.5, lineHeight: 1.4, color: 'var(--text-secondary)' }}>{description}</span>}
        {meta && <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--cocoa-800)', marginTop: 2 }}>{meta}</span>}
      </span>
      <span style={{ width: 22, height: 22, flex: 'none', borderRadius: 11, border: '2px solid ' + (selected ? 'var(--icing-600)' : 'var(--border-strong)'), background: selected ? 'var(--icing-600)' : 'transparent', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
        {selected && <Icon name="check" size={14} />}
      </span>
    </button>
  );
}
