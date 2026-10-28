import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../core/Icon';

export interface EmptyStateProps { icon?: string; title: ReactNode; body?: ReactNode; action?: ReactNode; tone?: 'cream' | 'error'; style?: CSSProperties }

export function EmptyState({ icon = 'shopping-bag', title, body, action, tone = 'cream', style }: EmptyStateProps) {
  const err = tone === 'error';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12, padding: '40px 24px', fontFamily: 'var(--font-body)', ...style }}>
      <span style={{ width: 76, height: 76, borderRadius: '38px 38px 20px 20px', background: err ? 'var(--error-bg)' : 'var(--icing-100)', color: err ? 'var(--error-fg)' : 'var(--icing-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}><Icon name={icon} size={32} /></span>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 24, margin: 0, color: 'var(--text-primary)' }}>{title}</h3>
      {body && <p style={{ margin: 0, maxWidth: 340, fontSize: 15, lineHeight: 1.5, color: 'var(--text-secondary)' }}>{body}</p>}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}
