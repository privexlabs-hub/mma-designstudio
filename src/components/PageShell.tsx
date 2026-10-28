'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import s from './page.module.css';

export interface TocItem { id: string; label: string }

/** Brand page layout: hero, section navigation (sticky sidebar / chip bar on small screens), footer. */
export function PageShell({ eyebrow, title, lead, toc, children }: { eyebrow: string; title: ReactNode; lead?: ReactNode; toc?: TocItem[]; children: ReactNode }) {
  const [active, setActive] = useState(toc?.[0]?.id || '');
  useEffect(() => {
    if (!toc?.length) return;
    const els = toc.map((t) => document.getElementById(t.id)).filter((x): x is HTMLElement => !!x);
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setActive(vis[0].target.id);
    }, { rootMargin: '-130px 0px -55% 0px' });
    els.forEach((e) => io.observe(e)); return () => io.disconnect();
  }, [toc]);
  useEffect(() => {
    // Keep the active chip visible in the horizontal section bar on small screens.
    const a = document.querySelector<HTMLElement>('[data-toc="' + active + '"]');
    const bar = a?.parentElement; if (!a || !bar || bar.scrollWidth <= bar.clientWidth) return;
    bar.scrollTo({ left: a.offsetLeft - bar.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' });
  }, [active]);
  return (
    <div className={s.page}>
      <AppHeader />
      <section className={s.hero}>
        <div className={s.wrap}>
          <span className={s.eyebrow}>{eyebrow}</span>
          <h1 className={s.title}>{title}</h1>
          {lead && <p className={s.lead}>{lead}</p>}
        </div>
      </section>
      <div className={`${s.wrap} ${s.body} ${toc ? '' : s.bodyFull}`}>
        {toc && (
          <nav className={s.toc} aria-label="On this page">
            {toc.map((t, i) => <a key={t.id} href={'#' + t.id} data-toc={t.id} className={active === t.id ? s.tocOn : ''} aria-current={active === t.id ? 'location' : undefined}><span>{String(i + 1).padStart(2, '0')}</span>{t.label}</a>)}
          </nav>
        )}
        <main className={s.content}>{children}</main>
      </div>
      <footer className={s.footer}>
        <div className={s.wrap}>
          <span>Treats by MMA · brand studio</span>
          <span>Imagery is conceptual · details marked [to confirm] need the owner’s confirmation before publishing.</span>
        </div>
      </footer>
    </div>
  );
}

export function Section({ id, num, title, intro, children }: { id: string; num?: string; title: ReactNode; intro?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className={s.section} aria-labelledby={id + '-h'}>
      <div className={s.sectionHead}>
        {num && <span className={s.num}>{num}</span>}
        <h2 id={id + '-h'} className={s.h2}>{title}</h2>
        {intro && <p className={s.p}>{intro}</p>}
      </div>
      {children}
    </section>
  );
}


