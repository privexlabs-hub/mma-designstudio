import type { CSSProperties } from 'react';
import { Icon } from '../core/Icon';

const R = { arch: 'var(--radius-arch)', rounded: 'var(--radius-xl)', circle: '50%', square: 'var(--radius-sm)' };

export interface PhotoFrameProps { src?: string; alt?: string; shape?: keyof typeof R; ratio?: string; conceptual?: boolean; placeholder?: string; ring?: string; style?: CSSProperties }

export function PhotoFrame({ src, alt = '', shape = 'rounded', ratio = '4/5', conceptual, placeholder = 'Product photography', ring, style }: PhotoFrameProps) {
  return (
    <figure style={{ margin: 0, position: 'relative', aspectRatio: ratio, borderRadius: R[shape], overflow: 'hidden', background: 'var(--cream-200)', boxShadow: ring ? '0 0 0 4px var(--cream-0), 0 0 0 7px ' + ring : undefined, ...style }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- brand photos are plain static files
        <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--cocoa-500)', fontFamily: 'var(--font-body)', backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 14px, rgba(61,29,16,.05) 14px 15px)' }}>
          <Icon name="camera" size={28} />
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>{placeholder}</span>
        </div>
      )}
      {conceptual && (
        <figcaption style={{ position: 'absolute', left: 10, bottom: 10, padding: '3px 9px', borderRadius: 999, background: 'rgba(30,13,6,.72)', color: 'var(--cream-50)', fontFamily: 'var(--font-body)', fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>Conceptual image</figcaption>
      )}
    </figure>
  );
}
