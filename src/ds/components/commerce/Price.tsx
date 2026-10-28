import type { CSSProperties } from 'react';

const fmt = (n: number | string) => Number(n).toLocaleString('en-NG');

export interface PriceProps { amount?: number | string | null; compareAt?: number | null; from?: boolean; currency?: string; size?: 'sm' | 'md' | 'lg'; tone?: 'default' | 'inverse'; style?: CSSProperties }

/** Naira price: ₦ directly before the amount, thousands commas. Missing amounts show a placeholder. */
export function Price({ amount, compareAt, from, currency = '₦', size = 'md', tone = 'default', style }: PriceProps) {
  const fs = { sm: 16, md: 'var(--text-price)', lg: 'var(--text-price-lg)' }[size];
  const col = tone === 'inverse' ? 'var(--gold-400)' : 'var(--cocoa-800)';
  const missing = amount === undefined || amount === null || amount === '';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8, fontFamily: 'var(--font-body)', fontVariantNumeric: 'tabular-nums', ...style }}>
      {from && <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: tone === 'inverse' ? 'var(--cocoa-300)' : 'var(--text-secondary)' }}>From</span>}
      <span style={{ fontSize: fs, fontWeight: 800, color: missing ? 'var(--text-muted)' : col, lineHeight: 1 }}>{missing ? currency + ' [price]' : currency + fmt(amount)}</span>
      {compareAt != null && <s style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)' }}>{currency + fmt(compareAt)}</s>}
    </span>
  );
}
