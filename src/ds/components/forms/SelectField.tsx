'use client';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '../core/Icon';

export type SelectOption = string | { value: string; label: string };
export interface SelectFieldProps { label?: string; options?: SelectOption[]; value?: string; defaultValue?: string; onChange?: (v: string) => void; hint?: ReactNode; error?: ReactNode; placeholder?: string; required?: boolean; id?: string; style?: CSSProperties }

export function SelectField({ label, options = [], value, defaultValue, onChange, hint, error, placeholder, required, id, style }: SelectFieldProps) {
  const [focus, setFocus] = useState(false);
  const fid = id || 'sf-' + String(label || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <label htmlFor={fid} style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)', ...style }}>
      {label && <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{label}{required && <span style={{ color: 'var(--icing-600)' }}> *</span>}</span>}
      <span style={{ position: 'relative', display: 'flex' }}>
        <select id={fid} value={value} defaultValue={defaultValue} onChange={(e) => onChange && onChange(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ appearance: 'none', WebkitAppearance: 'none', width: '100%', height: 'var(--input-h)', padding: '0 44px 0 16px', borderRadius: 'var(--radius-md)', background: 'var(--surface-elevated)', border: '2px solid ' + (error ? 'var(--error)' : focus ? 'var(--border-focus)' : 'var(--border-default)'), boxShadow: focus ? '0 0 0 4px var(--icing-100)' : 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--text-primary)', cursor: 'pointer' }}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => { const v = typeof o === 'string' ? o : o.value; const l = typeof o === 'string' ? o : o.label; return <option key={v} value={v}>{l}</option>; })}
        </select>
        <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--cocoa-600)', display: 'flex' }}><Icon name="chevron-down" size={18} /></span>
      </span>
      {(error || hint) && <span style={{ fontSize: 13, color: error ? 'var(--error-fg)' : 'var(--text-secondary)' }}>{error || hint}</span>}
    </label>
  );
}
