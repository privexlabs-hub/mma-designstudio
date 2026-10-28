'use client';
import { useState, type CSSProperties } from 'react';
import { Badge, type BadgeTone } from '../core/Badge';
import { Icon } from '../core/Icon';
import { CAT, type CategoryId } from './categories';
import { Price } from './Price';

export interface ProductCardProps {
  image?: string; name: string; description?: string; price?: number | string | null; priceFrom?: boolean; category?: CategoryId;
  badge?: string; badgeTone?: BadgeTone; layout?: 'vertical' | 'horizontal'; onAdd?: () => void; onClick?: () => void; addLabel?: string; style?: CSSProperties;
}

export function ProductCard({ image, name, description, price, priceFrom, category = 'cakes', badge, badgeTone = 'pink', layout = 'vertical', onAdd, onClick, addLabel = 'Add', style }: ProductCardProps) {
  const [hover, setHover] = useState(false);
  const cat = CAT[category] || CAT.cakes;
  const h = layout === 'horizontal';
  return (
    <article onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', flexDirection: h ? 'row' : 'column', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: hover ? 'var(--shadow-3)' : 'var(--shadow-1)', transform: hover ? 'translateY(-3px)' : 'none', border: '1px solid var(--border-subtle)', transition: 'box-shadow var(--dur-slow) var(--ease-out), transform var(--dur-slow) var(--ease-out)', cursor: onClick ? 'pointer' : 'default', ...style }}>
      <div style={{ position: 'relative', flex: 'none', width: h ? 132 : '100%', aspectRatio: h ? '1/1' : '4/3.4', background: cat.bg, overflow: 'hidden' }}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- brand photos are plain static files
          <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hover ? 'scale(1.04)' : 'none', transition: 'transform 600ms var(--ease-out)' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: cat.fg }}>
            <Icon name={cat.icon} size={32} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>Product photo</span>
          </div>
        )}
        {badge && !h && <Badge tone={badgeTone} variant="solid" size="sm" style={{ position: 'absolute', top: 12, left: 12 }}>{badge}</Badge>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: h ? '14px 16px' : '16px 18px 18px', flex: 1, minWidth: 0 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: cat.fg }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: cat.c }} />{cat.label}
        </span>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'var(--text-product-name)', lineHeight: 1.15, margin: 0, color: 'var(--text-primary)' }}>{name}</h3>
        {description && <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45, color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{description}</p>}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 'auto', paddingTop: 8 }}>
          <Price amount={price} from={priceFrom} />
          {onAdd && (
            <button type="button" aria-label={addLabel + ' ' + name} onClick={(e) => { e.stopPropagation(); onAdd(); }}
              style={{ height: 40, padding: '0 14px 0 10px', borderRadius: 20, border: 'none', background: 'var(--action-primary)', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              <Icon name="plus" size={18} />{addLabel}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
