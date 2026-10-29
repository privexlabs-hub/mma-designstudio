import type { CSSProperties } from 'react';
import { Icon } from '../core/Icon';

export interface QuantityStepperProps { value?: number; min?: number; max?: number; onChange?: (v: number) => void; size?: 'sm' | 'md'; style?: CSSProperties }

export function QuantityStepper({ value = 1, min = 1, max = 99, onChange, size = 'md', style }: QuantityStepperProps) {
  const h: number | string = size === 'sm' ? 'var(--tap-sm, 34px)' : 44;
  const b = (dis: boolean): CSSProperties => ({ width: h, height: h, borderRadius: '50%', border: 'none', background: dis ? 'transparent' : 'var(--cream-0)', color: dis ? 'var(--cocoa-300)' : 'var(--cocoa-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: dis ? 'not-allowed' : 'pointer', boxShadow: dis ? 'none' : 'var(--shadow-1)' });
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: 3, background: 'var(--cream-200)', borderRadius: 'var(--radius-pill)', fontFamily: 'var(--font-body)', ...style }}>
      <button type="button" aria-label="Decrease" disabled={value <= min} onClick={() => onChange && onChange(Math.max(min, value - 1))} style={b(value <= min)}><Icon name="minus" size={16} /></button>
      <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 800, fontSize: 16, fontVariantNumeric: 'tabular-nums', color: 'var(--cocoa-800)' }}>{value}</span>
      <button type="button" aria-label="Increase" disabled={value >= max} onClick={() => onChange && onChange(Math.min(max, value + 1))} style={b(value >= max)}><Icon name="plus" size={16} /></button>
    </div>
  );
}
