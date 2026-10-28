'use client';
import { useState, type CSSProperties } from 'react';
import { Icon } from '../core/Icon';
import { CAT, type CategoryId } from './categories';

export interface CategoryCardProps { category?: CategoryId; label?: string; image?: string; caption?: string; active?: boolean; onClick?: () => void; style?: CSSProperties }

export function CategoryCard({ category = 'cakes', label, image, caption, active, onClick, style }: CategoryCardProps) {
  const [hover, setHover] = useState(false);
  const cat = CAT[category] || CAT.cakes;
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '0 0 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'center', ...style }}>
      <span style={{ position: 'relative', width: '100%', aspectRatio: '4/5', borderRadius: 'var(--radius-arch)', overflow: 'hidden', background: cat.bg, boxShadow: active ? '0 0 0 3px var(--cream-0), 0 0 0 6px ' + cat.c : hover ? 'var(--shadow-2)' : 'none', transition: 'box-shadow var(--dur-base)' }}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- brand photos are plain static files
          <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hover ? 'scale(1.05)' : 'none', transition: 'transform 600ms var(--ease-out)' }} />
        ) : (
          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cat.fg }}><Icon name={cat.icon} size={40} /></span>
        )}
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 19, lineHeight: 1.15, color: 'var(--text-primary)' }}>{label || cat.label}</span>
        {caption && <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{caption}</span>}
      </span>
    </button>
  );
}
