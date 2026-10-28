'use client';
/* Storefront UI kit shell. The kit's own index.html was not part of the supplied project, so this
   shell only wires the supplied pages together: home → menu → product → celebration cake request,
   plus the order bag. No pages, copy or data were added. */
import { useEffect, useRef, useState } from 'react';
import { NavBar } from '@/ds';
import { CakeOrderPage } from './CakeOrder';
import { CartDrawer } from './Cart';
import { type CartItem, type Product, type Route } from './data';
import { Footer, HomePage } from './Home';
import { MenuPage, ProductPage } from './Menu';
import s from './storefront.module.css';

const LINKS = [{ id: 'home', label: 'Home' }, { id: 'menu', label: 'Menu' }, { id: 'celebrations', label: 'Celebration cakes' }];

export function Storefront() {
  const [route, setRoute] = useState<Route>('home');
  const [arg, setArg] = useState('');
  const [cat, setCat] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = top.current; if (!el) return;
    const ro = new ResizeObserver(() => setCompact(el.clientWidth < 860)); ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const go = (r: Route, a?: string) => {
    if (r === 'menu') setCat(a || 'all');
    setRoute(r); setArg(a || '');
    top.current?.scrollIntoView({ block: 'start' });
  };
  const add = (p: Product) => setCart((c) => { const ex = c.find((x) => x.id === p.id); return ex ? c.map((x) => x.id === p.id ? { ...x, qty: x.qty + 1 } : x) : c.concat([{ ...p, qty: 1 }]); });
  const setQty = (id: string, q: number) => setCart((c) => q <= 0 ? c.filter((x) => x.id !== id) : c.map((x) => x.id === id ? { ...x, qty: q } : x));
  const count = cart.reduce((a, b) => a + b.qty, 0);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div ref={top} className={s.root}>
      <NavBar logoSrc="/assets/ui/logo-320.webp" links={LINKS} active={route === 'product' ? 'menu' : route} onNavigate={(id) => { setMenuOpen(false); go(id as Route); }} cartCount={count} onCart={() => setOpen(true)} onMenu={() => setMenuOpen((v) => !v)} compact={compact} />
      {compact && menuOpen && (
        <nav aria-label="Storefront" style={{ display: 'flex', flexDirection: 'column', padding: '8px var(--page-margin) 16px', background: 'var(--bg-page)', borderBottom: '1px solid var(--border-subtle)' }}>
          {LINKS.map((l) => <a key={l.id} href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); go(l.id as Route); }} style={{ padding: '12px 4px', minHeight: 44, textDecoration: 'none', fontWeight: route === l.id ? 800 : 600, color: route === l.id ? 'var(--icing-700)' : 'var(--cocoa-800)' }}>{l.label}</a>)}
        </nav>
      )}
      <main>
        {route === 'home' && <HomePage go={go} add={add} />}
        {route === 'menu' && <MenuPage go={go} add={add} cat={cat} setCat={setCat} />}
        {route === 'product' && <ProductPage key={arg} id={arg} go={go} add={add} />}
        {route === 'celebrations' && <CakeOrderPage go={go} />}
      </main>
      <Footer go={go} />
      <CartDrawer open={open} items={cart} setQty={setQty} close={() => setOpen(false)} go={go} />
    </div>
  );
}
