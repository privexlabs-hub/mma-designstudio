import type { CSSProperties } from 'react';

export type RibbonTone = 'pink' | 'gold' | 'cocoa' | 'cream';
export interface RibbonRuleProps { label?: string; tone?: RibbonTone; align?: 'center' | 'start' | 'end'; style?: CSSProperties }

/** Ribbon rule: pink line + heart, lifted from the logo underline. */
export function RibbonRule({ label, tone = 'pink', align = 'center', style }: RibbonRuleProps) {
  const c = { pink: 'var(--icing-500)', gold: 'var(--gold-500)', cocoa: 'var(--cocoa-800)', cream: 'var(--cream-50)' }[tone];
  const line: CSSProperties = { flex: 1, height: 3, borderRadius: 3, background: c, maxWidth: align === 'center' ? undefined : 40 };
  return (
    <div role="separator" style={{ display: 'flex', alignItems: 'center', gap: 12, color: c, fontFamily: 'var(--font-body)', ...style }}>
      {align !== 'start' && <span style={line} />}
      {label ? (
        <span style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '.16em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: tone === 'pink' ? 'var(--icing-700)' : c }}>{label}</span>
      ) : (
        <span style={{ fontSize: 16, lineHeight: 1, fontVariantEmoji: 'text' } as CSSProperties}>{'♥︎'}</span>
      )}
      {align !== 'end' && <span style={line} />}
    </div>
  );
}
