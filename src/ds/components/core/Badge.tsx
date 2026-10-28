import type { CSSProperties, ReactNode } from 'react';
import { Icon } from './Icon';

const T = {
  pink: ['var(--icing-100)', 'var(--icing-700)', 'var(--icing-600)'],
  gold: ['var(--gold-100)', 'var(--gold-700)', 'var(--gold-500)'],
  cocoa: ['var(--cocoa-100)', 'var(--cocoa-800)', 'var(--cocoa-800)'],
  milk: ['var(--milk-100)', 'var(--milk-700)', 'var(--milk-600)'],
  leaf: ['var(--leaf-100)', 'var(--leaf-700)', 'var(--leaf-600)'],
  neutral: ['var(--cream-200)', 'var(--cocoa-700)', 'var(--cocoa-600)'],
  success: ['var(--success-bg)', 'var(--success-fg)', 'var(--success)'],
  warning: ['var(--warning-bg)', 'var(--warning-fg)', 'var(--gold-500)'],
  error: ['var(--error-bg)', 'var(--error-fg)', 'var(--error)'],
  info: ['var(--info-bg)', 'var(--info-fg)', 'var(--info)'],
} as const;
export type BadgeTone = keyof typeof T;

export interface BadgeProps { tone?: BadgeTone; variant?: 'soft' | 'solid'; icon?: string; size?: 'sm' | 'md'; children?: ReactNode; style?: CSSProperties }

export function Badge({ tone = 'pink', variant = 'soft', icon, size = 'md', children, style }: BadgeProps) {
  const t = T[tone] || T.pink;
  const solid = variant === 'solid';
  const fg = solid ? (tone === 'gold' || tone === 'warning' ? 'var(--cocoa-900)' : '#fff') : t[1];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: size === 'sm' ? 22 : 28, padding: size === 'sm' ? '0 9px' : '0 12px', borderRadius: 'var(--radius-pill)', background: solid ? t[2] : t[0], color: fg, fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: size === 'sm' ? 10.5 : 12, letterSpacing: '.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', ...style }}>
      {icon && <Icon name={icon} size={size === 'sm' ? 12 : 14} />}
      {children}
    </span>
  );
}
