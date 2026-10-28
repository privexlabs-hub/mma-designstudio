import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../core/Icon';

const T = { success: ['var(--success-bg)', 'var(--success-fg)', 'circle-check'], warning: ['var(--warning-bg)', 'var(--warning-fg)', 'triangle-alert'], error: ['var(--error-bg)', 'var(--error-fg)', 'circle-alert'], info: ['var(--info-bg)', 'var(--info-fg)', 'info'] } as const;

export interface AlertProps { tone?: keyof typeof T; title?: ReactNode; children?: ReactNode; action?: ReactNode; style?: CSSProperties }

export function Alert({ tone = 'info', title, children, action, style }: AlertProps) {
  const t = T[tone] || T.info;
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} style={{ display: 'flex', gap: 12, padding: '14px 16px', borderRadius: 'var(--radius-md)', background: t[0], color: t[1], fontFamily: 'var(--font-body)', ...style }}>
      <span style={{ display: 'flex', paddingTop: 1 }}><Icon name={t[2]} size={20} /></span>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {title && <strong style={{ fontSize: 15, fontWeight: 800 }}>{title}</strong>}
        {children && <span style={{ fontSize: 14, lineHeight: 1.45 }}>{children}</span>}
        {action && <span style={{ marginTop: 6 }}>{action}</span>}
      </div>
    </div>
  );
}
