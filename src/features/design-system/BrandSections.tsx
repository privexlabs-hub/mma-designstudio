/* Design System sections 6–8 and 10–12. Section 9 (components) is ComponentGallery. */
import Link from 'next/link';
import { Badge, Button, CategoryCard, Icon, IcingEdge, PhotoFrame, RibbonRule } from '@/ds';
import { Section } from '@/components/PageShell';
import p from '@/components/page.module.css';
import { CATEGORIES, CATEGORY_RULE, CHECKLIST, ICONS, IMAGERY, MOTIF_RULE, MOTIFS, MOTION, PACKAGING, SOCIAL } from '@/content/brand';
import { BUILD, PHOTOS } from '@/lib/studio';
import { Artboard } from '@/features/studio/Artboard';
import { CAT_CAPTION, CAT_IMG } from '@/ds/storefront/data';
import f from './ds.module.css';

export function MotifSection() {
  return (
    <Section id="motifs" num="06 · Brand" title="Graphic motifs" intro={MOTIF_RULE}>
      <div className={p.grid2}>
        <div className={p.card}>
          <b>{MOTIFS[0].name}</b>
          <div className="ds-stage" style={{ overflow: 'hidden', padding: 0 }}>
            <IcingEdge color="var(--icing-500)" height={32} />
            <div style={{ padding: '28px 18px', textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 22 }}>Fresh out of the oven.</div>
          </div>
          <p className={p.small}>{MOTIFS[0].body}</p>
        </div>
        <div className={p.card}>
          <b>{MOTIFS[1].name}</b>
          <div className="ds-stage" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <RibbonRule />
            <RibbonRule label="Celebration cakes" />
            <div style={{ background: 'var(--cocoa-800)', padding: 12, borderRadius: 12 }}><RibbonRule tone="gold" label="Celebrations" /></div>
          </div>
          <p className={p.small}>{MOTIFS[1].body}</p>
        </div>
        <div className={p.card}>
          <b>{MOTIFS[2].name}</b>
          <div className="ds-stage" style={{ padding: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <PhotoFrame shape="arch" src={CAT_IMG.cakes} conceptual />
            <PhotoFrame shape="arch" src={CAT_IMG.celebration} ring="var(--gold-500)" />
          </div>
          <p className={p.small}>{MOTIFS[2].body}</p>
        </div>
        <div className={p.card}>
          <b>{MOTIFS[3].name}</b>
          <div className={p.note}><Icon name="package" size={18} /><span>{MOTIFS[3].body} The supplied design system describes this motif for packaging but does not include a drawn component or artwork for it, so none is shown here.</span></div>
        </div>
      </div>
    </Section>
  );
}

export function IconSection() {
  return (
    <Section id="icons" num="07 · Brand" title="Iconography" intro={ICONS.system}>
      <div className="ds-stage" style={{ padding: 18 }}>
        <div className={f.iconGrid}>
          {ICONS.core.map(([n, l]) => <div key={n} className={f.iconCell}><span className={f.well}><Icon name={n} size={24} /></span><span>{l}</span></div>)}
        </div>
      </div>
      <div className={p.grid3}>
        <div className={p.card}><span className={p.cap}>Style</span><p className={p.p}>{ICONS.style}</p>
          <div className={p.stageRow}>
            <span className={f.well} style={{ background: 'var(--icing-100)', color: 'var(--icing-700)' }}><Icon name="cake" size={22} /></span>
            <span className={f.well}><Icon name="truck" size={22} /></span>
            <span className={f.well} style={{ background: 'var(--cocoa-800)', color: 'var(--gold-400)' }}><Icon name="gift" size={22} /></span>
          </div>
        </div>
        <div className={p.card}><span className={p.cap}>Roles</span><p className={p.p}>{ICONS.roles}</p><p className={p.small}>{ICONS.ornament}</p></div>
        <div className={p.card}><span className={p.cap}>Not used</span><ul className={p.list}>{ICONS.notUsed.map((x) => <li key={x}>{x}</li>)}</ul></div>
      </div>
    </Section>
  );
}

export function PhotoSection() {
  return (
    <Section id="photography" num="08 · Brand" title="Photography & imagery" intro={IMAGERY.direction}>
      <div className={f.photoGrid}>
        {PHOTOS.map(([name, src]) => <figure key={src} style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}><PhotoFrame src={src} alt={name} shape="rounded" ratio="1/1" conceptual /><figcaption className={p.small}>{name}</figcaption></figure>)}
      </div>
      <div className={p.grid3}>
        <div className={p.card}><span className={p.cap}>Imagery vibe</span><p className={p.p}>{IMAGERY.vibe}</p></div>
        <div className={p.card}><span className={p.cap}>Avoid</span><p className={p.p}>{IMAGERY.avoid}</p></div>
        <div className={p.card}><span className={p.cap}>Mood board</span><p className={p.p}>{IMAGERY.moodboard}</p></div>
      </div>
      <div className={p.note}><Icon name="camera" size={18} /><span>{IMAGERY.conceptual} The photos are 300 px crops, so they look soft at large sizes — replace them with real photography.</span></div>
    </Section>
  );
}

export function CategorySection() {
  return (
    <Section id="categories" num="10 · Brand" title="Product categories" intro="Five families · one master brand.">
      <div className="ds-stage" style={{ padding: 18 }}>
        <div className={f.photoGrid}>{CATEGORIES.map((c) => <CategoryCard key={c.id} category={c.id} image={CAT_IMG[c.id]} caption={CAT_CAPTION[c.id]} />)}</div>
      </div>
      <div className={p.tableWrap}>
        <table className={p.table}>
          <thead><tr><th>Family</th><th>Accent</th><th>Token</th><th>Icon</th></tr></thead>
          <tbody>{CATEGORIES.map((c) => <tr key={c.id}><td><b>{c.family}</b></td><td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span className={f.chip} style={{ background: 'var(--cat-' + c.id + ')' }} />{c.accent}</span></td><td><code>--cat-{c.id}</code></td><td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name={c.icon} size={18} />{c.icon}</span></td></tr>)}</tbody>
        </table>
      </div>
      <p className={p.p}>{CATEGORY_RULE}</p>
    </Section>
  );
}

export function ApplicationSection() {
  return (
    <Section id="applications" num="11 · Applications" title="Packaging & social" intro={SOCIAL.formats + ' Four post families — each one opens in the Studio.'}>
      <div className={f.social}>
        {SOCIAL.families.map((fam) => {
          const d = BUILD[fam.tpl](); const z = Math.min(200 / d.w, 250 / d.h);
          return (
            <div key={fam.name} className={f.socialCard}>
              <Link href={'/studio/edit/' + encodeURIComponent(fam.tpl)} className={f.socialThumb} aria-label={'Open the ' + fam.name + ' template in the Studio'}>
                <div style={{ width: Math.round(d.w * z), height: Math.round(d.h * z), overflow: 'hidden', borderRadius: 4, boxShadow: '0 4px 14px -4px rgba(30,13,6,.3)' }}><Artboard doc={d} page={d.pages[0]} index={0} z={z} prefix="ds-" lite /></div>
              </Link>
              <b>{fam.name} · <span style={{ fontWeight: 600, color: 'var(--a-fg2)' }}>{fam.rule}</span></b>
              <span className={p.small}>{fam.detail}</span>
            </div>
          );
        })}
      </div>
      <div className={p.card}><span className={p.cap}>Social rules</span><ul className={p.list}>{SOCIAL.rules.map((r) => <li key={r}>{r}</li>)}</ul></div>
      <div className={p.grid2}>
        {PACKAGING.tiers.map((t) => <div key={t.name} className={p.card}><span className={p.cap}>{t.name} packaging</span><p className={p.p}>{t.body}</p></div>)}
      </div>
      <div className={p.card}><span className={p.cap}>Packaging rules</span><ul className={p.list}>{PACKAGING.rules.map((r) => <li key={r}>{r}</li>)}</ul></div>
      <div className={p.tableWrap}>
        <table className={p.table}>
          <thead><tr><th>Application concept</th><th>Description</th></tr></thead>
          <tbody>{PACKAGING.items.map(([n, d]) => <tr key={n}><td><b>{n}</b></td><td>{d}</td></tr>)}</tbody>
        </table>
      </div>
      <p className={p.small}>Packaging concepts are provisional. The mock-up artwork was not part of the supplied files, so only the descriptions are listed.</p>
    </Section>
  );
}

export function MotionSection() {
  return (
    <Section id="motion" num="12 · Behaviour" title="Motion, states & accessibility" intro={MOTION.rule}>
      <div className={p.grid3}>
        {[['--dur-fast', '120ms'], ['--dur-base', '200ms'], ['--dur-slow', '360ms']].map(([n, v]) => <div key={n} className={p.card}><code>{n}</code><b>{v}</b></div>)}
      </div>
      <div className={p.grid2}>
        <div className={p.card}>
          <span className={p.cap}>Hover lift · hover or focus the card</span>
          <div className="ds-stage" style={{ padding: 18 }}>
            <div className={f.lift} tabIndex={0}><b style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 20 }}>Classic Banana Bread</b><span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Lifts 3px to shadow-3 with the brand ease.</span></div>
          </div>
        </div>
        <div className={p.card}>
          <span className={p.cap}>States</span>
          <div className="ds-stage" style={{ padding: 18, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <Button>Order now</Button>
            <span className={f.focusDemo} style={{ display: 'inline-flex', alignItems: 'center' }}>Focus ring</span>
            <Button disabled>Disabled</Button>
          </div>
          <ul className={p.list}>{MOTION.states.map((x) => <li key={x.name}><b>{x.name}:</b> {x.body}</li>)}</ul>
        </div>
      </div>
      <div className={p.note}><Icon name="layers" size={18} /><span><b>Transparency & blur. </b>{MOTION.transparency}</span></div>
      <div className={p.card}>
        <span className={p.cap}>Accessibility</span>
        <ul className={p.list}>
          <li>AA contrast for all text — see the pairings in Colour.</li>
          <li>Touch targets of at least 44px.</li>
          <li>Visible focus: 2px cream gap + 2px pink ring.</li>
          <li>Motion respects the system “reduce motion” setting in this app.</li>
        </ul>
      </div>
      <div className={p.card} style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Badge tone="pink" size="sm">UI kit</Badge>
          <b style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 24 }}>Online storefront</b>
          <span className={p.small}>Interactive: home → menu → product → celebration cake request → order bag. Built entirely from the components above.</span>
        </div>
        <Link href="/design-system/storefront" className={`${p.btn} ${p.btnPink}`}><Icon name="store" size={16} />Open the storefront</Link>
      </div>
      <details className={p.card}>
        <summary style={{ cursor: 'pointer', fontWeight: 800 }}>Quality checklist</summary>
        <ul className={p.list} style={{ marginTop: 10 }}>{CHECKLIST.map((c) => <li key={c}>{c}</li>)}</ul>
      </details>
    </Section>
  );
}
