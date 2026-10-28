import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../core/Icon';

const T = { cocoa: ['var(--cocoa-800)', 'var(--cream-50)', 'var(--gold-400)'], pink: ['var(--icing-600)', '#fff', '#fff'], gold: ['var(--gold-400)', 'var(--cocoa-900)', 'var(--cocoa-900)'], cream: ['var(--cream-200)', 'var(--cocoa-800)', 'var(--icing-600)'] } as const;

export interface AnnouncementBannerProps { tone?: keyof typeof T; icon?: string | null; children?: ReactNode; actionLabel?: string; onAction?: () => void; onDismiss?: () => void; style?: CSSProperties }

export function AnnouncementBanner({ tone = 'cocoa', icon = 'sparkles', children, actionLabel, onAction, onDismiss, style }: AnnouncementBannerProps) {
  const t = T[tone] || T.cocoa;
  return (
    <div role="status" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 12, minHeight: 44, padding: '8px 48px', position: 'relative', background: t[0], color: t[1], fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, textAlign: 'center', ...style }}>
      {icon && <span style={{ color: t[2], display: 'flex' }}><Icon name={icon} size={16} /></span>}
      <span>{children}</span>
      {actionLabel && <button type="button" onClick={onAction} style={{ background: 'none', border: 'none', color: t[1], fontFamily: 'inherit', fontSize: 14, fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer', padding: 0 }}>{actionLabel}</button>}
      {onDismiss && <button type="button" aria-label="Dismiss" onClick={onDismiss} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, border: 'none', background: 'transparent', color: t[1], cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="x" size={16} /></button>}
    </div>
  );
}
