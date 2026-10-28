import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../core/Icon';

export interface CheckboxProps { label?: ReactNode; checked?: boolean; onChange?: (v: boolean) => void; disabled?: boolean; style?: CSSProperties }

export function Checkbox({ label, checked, onChange, disabled, style }: CheckboxProps) {
  return (
    <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 10, minHeight: 44, fontFamily: 'var(--font-body)', fontSize: 15, color: disabled ? 'var(--text-muted)' : 'var(--text-primary)', cursor: disabled ? 'not-allowed' : 'pointer', ...style }}>
      <input type="checkbox" checked={!!checked} disabled={disabled} onChange={(e) => onChange && onChange(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} />
      <span style={{ width: 22, height: 22, borderRadius: 7, flex: 'none', border: '2px solid ' + (checked ? 'var(--icing-600)' : 'var(--border-strong)'), background: checked ? 'var(--icing-600)' : 'var(--surface-elevated)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background var(--dur-fast)' }}>
        {checked && <Icon name="check" size={15} />}
      </span>
      {label}
    </label>
  );
}
