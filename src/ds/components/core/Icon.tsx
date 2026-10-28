import type { CSSProperties } from 'react';

/** Lucide 0.460.0 icons, self-hosted in /public/icons and drawn as a CSS mask tinted with `color`. */
const BASE = '/icons/';

export interface IconProps { name: string; size?: number; color?: string; label?: string; style?: CSSProperties }

export function Icon({ name, size = 20, color = 'currentColor', label, style }: IconProps) {
  const url = 'url(' + BASE + name + '.svg)';
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{
        display: 'inline-block', flex: 'none', width: size, height: size, background: color,
        WebkitMaskImage: url, maskImage: url, WebkitMaskSize: 'contain', maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center',
        ...style,
      }}
    />
  );
}
