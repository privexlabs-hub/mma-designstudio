import type { CSSProperties, ReactNode } from 'react';
import { RibbonRule } from './RibbonRule';

export interface SectionHeadingProps { eyebrow?: string; title: ReactNode; body?: ReactNode; align?: 'center' | 'start'; inverse?: boolean; size?: 'lg' | 'md'; style?: CSSProperties }

export function SectionHeading({ eyebrow, title, body, align = 'center', inverse, size = 'lg', style }: SectionHeadingProps) {
  const c = align === 'center';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: c ? 'center' : 'flex-start', textAlign: c ? 'center' : 'left', gap: 14, maxWidth: c ? 720 : undefined, margin: c ? '0 auto' : undefined, ...style }}>
      {eyebrow && <RibbonRule label={eyebrow} tone={inverse ? 'gold' : 'pink'} align={c ? 'center' : 'start'} style={{ width: c ? 'min(100%, 420px)' : 'auto' }} />}
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: size === 'lg' ? 'var(--text-h2)' : 'var(--text-h3)', lineHeight: 1.1, margin: 0, color: inverse ? 'var(--cream-50)' : 'var(--text-primary)', textWrap: 'balance' }}>{title}</h2>
      {body && <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', lineHeight: 1.55, color: inverse ? 'var(--cocoa-300)' : 'var(--text-secondary)', maxWidth: 580, textWrap: 'pretty' }}>{body}</p>}
    </div>
  );
}
