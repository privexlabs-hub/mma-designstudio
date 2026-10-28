'use client';
import { useState, type CSSProperties } from 'react';
import { Icon } from './Icon';

export interface IconButtonProps { icon: string; label: string; variant?: 'soft' | 'solid' | 'ghost' | 'inverse'; size?: number; count?: number; onClick?: () => void; style?: CSSProperties }

export function IconButton({ icon, label, variant = 'soft', size = 44, count, onClick, style }: IconButtonProps) {
  const [hover, setHover] = useState(false);
  const V = { soft: ['var(--cream-200)', 'var(--cream-300)', 'var(--cocoa-800)'], solid: ['var(--action-primary)', 'var(--action-primary-hover)', '#fff'], ghost: ['transparent', 'var(--cream-200)', 'var(--cocoa-800)'], inverse: ['rgba(255,249,241,.12)', 'rgba(255,249,241,.22)', 'var(--cream-50)'] }[variant];
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position: 'relative', width: size, height: size, borderRadius: '50%', border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: hover ? V[1] : V[0], color: V[2], cursor: 'pointer', transition: 'background var(--dur-base)', flex: 'none', ...style }}>
      <Icon name={icon} size={Math.round(size * 0.45)} />
      {count != null && count > 0 && <span style={{ position: 'absolute', top: -2, right: -2, minWidth: 20, height: 20, padding: '0 5px', borderRadius: 10, background: 'var(--icing-600)', color: '#fff', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', boxShadow: '0 0 0 2px var(--cream-0)' }}>{count}</span>}
    </button>
  );
}
