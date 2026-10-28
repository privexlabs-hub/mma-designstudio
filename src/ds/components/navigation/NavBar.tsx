import type { CSSProperties } from 'react';
import { IconButton } from '../core/IconButton';

export interface NavBarProps { logoSrc?: string; links?: { id: string; label: string }[]; active?: string; onNavigate?: (id: string) => void; cartCount?: number; onCart?: () => void; onMenu?: () => void; compact?: boolean; style?: CSSProperties }

/** Storefront header — desktop links, or compact (logo + bag + menu). */
export function NavBar({ logoSrc, links = [], active, onNavigate, cartCount = 0, onCart, onMenu, compact, style }: NavBarProps) {
  return (
    <header style={{ display: 'flex', alignItems: 'center', gap: 24, height: compact ? 64 : 80, padding: '0 var(--page-margin)', background: 'var(--bg-page)', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--font-body)', ...style }}>
      <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('home'); }} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flex: 'none' }}>
        {logoSrc
          // eslint-disable-next-line @next/next/no-img-element -- the raster logo is a plain static file
          ? <img src={logoSrc} alt="Treats by MMA" style={{ height: compact ? 48 : 62, width: 'auto', display: 'block', mixBlendMode: 'multiply' }} />
          : <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--cocoa-800)' }}>Treats by MMA</span>}
      </a>
      {!compact && (
        <nav style={{ display: 'flex', gap: 4, flex: 1, justifyContent: 'center' }}>
          {links.map((l) => {
            const on = active === l.id;
            return <a key={l.id} href="#" onClick={(e) => { e.preventDefault(); onNavigate?.(l.id); }} style={{ padding: '10px 14px', borderRadius: 'var(--radius-pill)', textDecoration: 'none', fontSize: 15, fontWeight: on ? 800 : 600, color: on ? 'var(--icing-700)' : 'var(--cocoa-800)', background: on ? 'var(--icing-50)' : 'transparent' }}>{l.label}</a>;
          })}
        </nav>
      )}
      <div style={{ display: 'flex', gap: 8, marginLeft: compact ? 'auto' : 0 }}>
        <IconButton icon="shopping-bag" label="Your order" count={cartCount} onClick={onCart} />
        {compact && <IconButton icon="menu" label="Menu" variant="ghost" onClick={onMenu} />}
      </div>
    </header>
  );
}
