'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { Icon } from '@/ds';
import { useTheme } from '@/lib/theme';
import { SECTIONS } from './sections';
import s from './AppHeader.module.css';


/** Site header: brand, section nav (a drawer below 1100px), page-specific tools and the theme toggle. */
export function AppHeader({ children, compactBrand, tightBrand, collapseNav }: { children?: ReactNode; compactBrand?: boolean; tightBrand?: boolean; collapseNav?: boolean }) {
  const path = usePathname() || '/';
  const [theme, toggle] = useTheme();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, [open]);
  const on = (href: string) => path === href || path.startsWith(href + '/');
  const themeLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  return (
    <>
      <header className={s.header}>
        <Link href="/" className={`${s.brand} ${compactBrand ? s.compactBrand : ''} ${tightBrand ? s.tightBrand : ''}`} aria-label="Treats Studio home">
          {/* eslint-disable-next-line @next/next/no-img-element -- raster brand mark served as a static file */}
          <img src="/assets/ui/monogram-96.webp" alt="" />
          <span>Treats Studio</span>
        </Link>
        <nav className={`${s.nav} ${collapseNav ? s.navHidden : ''}`} aria-label="Sections">
          {SECTIONS.map((x) => <Link key={x.href} href={x.href} className={`${s.link} ${on(x.href) ? s.on : ''}`} aria-current={on(x.href) ? 'page' : undefined}>{x.label}</Link>)}
        </nav>
        <div className={s.spacer} />
        {children && <div className={s.tools}>{children}</div>}
        <button type="button" className={s.round} onClick={toggle} aria-label={themeLabel} title={themeLabel}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} /></button>
        <button type="button" className={`${s.round} ${s.menuBtn} ${collapseNav ? s.menuShown : ''}`} onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}><Icon name="menu" size={18} /></button>
      </header>
      {open && (
        <>
          <div className={s.scrim} onClick={() => setOpen(false)} />
          <nav className={s.drawer} aria-label="Sections" role="dialog" aria-modal="true">
            <div className={s.drawerHead}><strong>Treats Studio</strong><button type="button" className={s.round} onClick={() => setOpen(false)} aria-label="Close menu"><Icon name="x" size={18} /></button></div>
            {SECTIONS.map((x) => (
              <Link key={x.href} href={x.href} onClick={() => setOpen(false)} className={`${s.drawerLink} ${on(x.href) ? s.drawerOn : ''}`} aria-current={on(x.href) ? 'page' : undefined}>
                <Icon name={x.icon} size={20} /><span>{x.label}<small>{x.sub}</small></span>
              </Link>
            ))}
          </nav>
        </>
      )}
    </>
  );
}
