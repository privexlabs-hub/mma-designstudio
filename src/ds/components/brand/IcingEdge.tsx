import type { CSSProperties } from 'react';

export interface IcingEdgeProps { color?: string; background?: string; height?: number; flip?: boolean; style?: CSSProperties }

/** The icing-drip edge motif — a trim, never a wallpaper. */
export function IcingEdge({ color = 'var(--icing-500)', background = 'transparent', height = 28, flip, style }: IcingEdgeProps) {
  const drips = [0.55, 0.9, 0.4, 0.75, 1, 0.5, 0.85, 0.45, 0.7, 0.95, 0.5, 0.8];
  return (
    <div aria-hidden="true" style={{ position: 'relative', height, background, overflow: 'hidden', transform: flip ? 'scaleY(-1)' : undefined, ...style }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: Math.round(height * 0.35), background: color }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'space-around', padding: '0 2%' }}>
        {drips.map((d, i) => (
          <span key={i} style={{ width: Math.max(8, height * 0.42), height: Math.round(height * d), background: color, borderRadius: '0 0 999px 999px' }} />
        ))}
      </div>
    </div>
  );
}
