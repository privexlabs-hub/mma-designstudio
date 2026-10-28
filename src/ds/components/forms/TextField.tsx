'use client';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '../core/Icon';

export interface TextFieldProps {
  label?: string; hint?: ReactNode; error?: ReactNode; placeholder?: string; value?: string; defaultValue?: string; onChange?: (v: string) => void;
  type?: string; multiline?: boolean; rows?: number; icon?: string; required?: boolean; disabled?: boolean; id?: string; style?: CSSProperties;
}

export function TextField({ label, hint, error, placeholder, value, defaultValue, onChange, type = 'text', multiline, rows = 4, icon, required, disabled, id, style }: TextFieldProps) {
  const [focus, setFocus] = useState(false);
  const fid = id || 'tf-' + String(label || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const bd = error ? 'var(--error)' : focus ? 'var(--border-focus)' : 'var(--border-default)';
  const inputStyle: CSSProperties = { width: '100%', minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--text-primary)', padding: multiline ? '12px 0' : 0, resize: 'vertical', minHeight: multiline ? rows * 24 : undefined, lineHeight: 1.5 };
  const common = { id: fid, placeholder, value, defaultValue, disabled, onFocus: () => setFocus(true), onBlur: () => setFocus(false), style: inputStyle };
  return (
    <label htmlFor={fid} style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)', ...style }}>
      {label && <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{label}{required && <span style={{ color: 'var(--icing-600)' }}> *</span>}</span>}
      <span style={{ display: 'flex', alignItems: multiline ? 'flex-start' : 'center', gap: 10, minHeight: 'var(--input-h)', padding: '0 16px', background: disabled ? 'var(--cream-200)' : 'var(--surface-elevated)', borderRadius: 'var(--radius-md)', border: '2px solid ' + bd, boxShadow: focus ? '0 0 0 4px var(--icing-100)' : 'none', transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)' }}>
        {icon && <span style={{ color: 'var(--text-muted)', display: 'flex', paddingTop: multiline ? 14 : 0 }}><Icon name={icon} size={18} /></span>}
        {multiline
          ? <textarea rows={rows} {...common} onChange={(e) => onChange && onChange(e.target.value)} />
          : <input type={type} {...common} onChange={(e) => onChange && onChange(e.target.value)} />}
      </span>
      {(error || hint) && <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: error ? 'var(--error-fg)' : 'var(--text-secondary)' }}>{error && <Icon name="circle-alert" size={14} />}{error || hint}</span>}
    </label>
  );
}
