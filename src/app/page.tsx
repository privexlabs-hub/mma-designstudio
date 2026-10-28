import Link from 'next/link';
import { Icon } from '@/ds';
import { AppHeader } from '@/components/AppHeader';
import { SECTIONS } from '@/components/sections';
import p from '@/components/page.module.css';
import { BRAND } from '@/content/brand';
import { TEMPLATES } from '@/lib/studio';
import h from './home.module.css';

const COUNTS: Record<string, string> = {
  '/studio': TEMPLATES.length + ' templates · 8 categories · 12 export formats',
  '/design-system': '12 sections · 21 components · storefront kit',
  '/playbook': 'Essence, story, audit, packaging, social, checklist',
  '/voice': 'Voice, rules, sample copy, brand facts',
  '/assets': 'Logo, monogram, 6 photos, flyer, tokens',
};

export default function Home() {
  return (
    <div className={p.page}>
      <AppHeader />
      <main>
        <section className={h.hero}>
          <div className={`${p.wrap} ${h.heroInner}`}>
            <div className={h.copy}>
              <span className={p.eyebrow}>Treats by MMA · brand studio</span>
              <h1 className={h.title}>{BRAND.essence}</h1>
              <p className={p.lead} style={{ marginTop: 0 }}>{BRAND.positioning}</p>
              <div className={h.ctas}>
                <Link href="/studio" className={`${p.btn} ${p.btnPink}`} style={{ minHeight: 48, padding: '0 22px', fontSize: 16 }}><Icon name="pen-line" size={18} />Open the Studio</Link>
                <Link href="/design-system" className={p.btn} style={{ minHeight: 48, padding: '0 22px', fontSize: 16 }}><Icon name="swatch-book" size={18} />Design system</Link>
              </div>
            </div>
            <div className={h.logo}>
              {/* eslint-disable-next-line @next/next/no-img-element -- supplied raster logo, shown unaltered */}
              <img src="/assets/ui/logo-768.webp" alt="Treats by MMA — Cakes and Pastries" />
            </div>
          </div>
        </section>
        <section className={p.wrap} style={{ paddingTop: 40, paddingBottom: 80 }}>
          <div className={h.cards}>
            {SECTIONS.map((x) => (
              <Link key={x.href} href={x.href} className={h.card}>
                <span className={h.icon}><Icon name={x.icon} size={22} /></span>
                <b>{x.label}</b>
                <span>{x.sub}</span>
                <small>{COUNTS[x.href]}</small>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <footer className={p.footer}>
        <div className={p.wrap}>
          <span>Treats by MMA · Suleja, Abuja</span>
          <span>Imagery is conceptual · details marked [to confirm] need the owner’s confirmation before publishing.</span>
        </div>
      </footer>
    </div>
  );
}
