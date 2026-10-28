import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge, Icon } from '@/ds';
import { PageShell, Section } from '@/components/PageShell';
import p from '@/components/page.module.css';
import { AUDIT, BRAND, CATEGORIES, CATEGORY_RULE, PACKAGING, SOCIAL, STATUS } from '@/content/brand';
import { Checklist } from '@/features/brand/Checklist';

export const metadata: Metadata = { title: 'Brand Playbook', description: 'Treats by MMA positioning, story, values, brand audit, packaging and social rules, and the quality checklist.' };

const TOC = [{ id: 'essence', label: 'Essence & positioning' }, { id: 'story', label: 'Story, mission & values' }, { id: 'audit', label: 'Brand audit' }, { id: 'architecture', label: 'Brand architecture' }, { id: 'packaging', label: 'Packaging' }, { id: 'social', label: 'Social media' }, { id: 'checklist', label: 'Quality checklist' }, { id: 'status', label: 'Final vs provisional' }];

export default function PlaybookPage() {
  return (
    <PageShell eyebrow="Brand playbook" title={<>Sweet moments, made <span style={{ color: '#C81F75' }}>with care.</span></>} lead={BRAND.positioning} toc={TOC}>
      <Section id="essence" num="01" title="Essence & positioning">
        <div className={p.grid2}>
          <div className={p.card} style={{ background: '#3D1D10', borderColor: '#3D1D10', color: '#FFF9EA' }}>
            <span className={p.cap} style={{ color: '#F2C94C' }}>Brand essence</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3vw,34px)', lineHeight: 1.1 }}>{BRAND.essence}</span>
          </div>
          <div className={p.card}>
            <span className={p.cap}>Brand promise</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1.15 }}>{BRAND.promise}</span>
          </div>
        </div>
        <div className={p.card}><span className={p.cap}>Positioning statement</span><p className={p.p} style={{ fontSize: 18, color: 'var(--a-fg)' }}>{BRAND.positioningStatement}</p></div>
        <div className={p.card}>
          <span className={p.flag}><Icon name="triangle-alert" size={12} /> Recommendation — not official</span>
          <span className={p.cap}>Tagline</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 28 }}>{BRAND.tagline}</span>
          <span className={p.small}>Alternatives: {BRAND.taglineAlternatives.map((t) => '“' + t + '”').join(' · ')}</span>
        </div>
        <div className={p.card}><span className={p.cap}>Creative direction</span><p className={p.p}>{BRAND.creativeDirection}</p></div>
      </Section>
      <Section id="story" num="02" title="Story, mission & values">
        <div className={p.card}>
          <span className={p.cap}>Brand story</span>
          <p className={p.p} style={{ color: 'var(--a-fg)' }}>{BRAND.story}</p>
          <span className={p.flag}><Icon name="pen-line" size={12} /> {BRAND.storyNote}</span>
        </div>
        <div className={p.card}><span className={p.cap}>Mission</span><p className={p.p} style={{ color: 'var(--a-fg)' }}>{BRAND.mission}</p></div>
        <div className={p.auto}>
          {BRAND.values.map((v, i) => <div key={v} className={p.card}><span className={p.num}>{String(i + 1).padStart(2, '0')}</span><b style={{ fontSize: 17 }}>{v}</b></div>)}
        </div>
      </Section>
      <Section id="audit" num="03" title="Brand audit" intro={AUDIT.anatomy}>
        <div className={p.grid2}>
          <div className={p.card}><span className={p.cap}>Strengths</span><ul className={p.list}>{AUDIT.strengths.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div className={p.card}><span className={p.cap}>Limitations (documented, not altered)</span><ul className={p.list}>{AUDIT.limitations.map((x) => <li key={x}>{x}</li>)}</ul></div>
        </div>
        <Link href="/design-system#logo" className={p.btn} style={{ alignSelf: 'flex-start' }}><Icon name="swatch-book" size={16} />Logo rules in the design system</Link>
      </Section>
      <Section id="architecture" num="04" title="Brand architecture" intro="Five product families under one master brand.">
        <div className={p.auto}>
          {CATEGORIES.map((c) => <div key={c.id} className={p.card}><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: 5, background: 'var(--cat-' + c.id + ')' }} /><span className={p.cap}>{c.accent}</span></span><b>{c.family}</b><Icon name={c.icon} size={22} /></div>)}
        </div>
        <p className={p.p}>{CATEGORY_RULE}</p>
      </Section>
      <Section id="packaging" num="05" title="Packaging">
        <div className={p.grid2}>{PACKAGING.tiers.map((t) => <div key={t.name} className={p.card}><Badge tone={t.name === 'Celebration' ? 'pink' : 'neutral'} size="sm">{t.name}</Badge><p className={p.p}>{t.body}</p></div>)}</div>
        <div className={p.card}><span className={p.cap}>Rules</span><ul className={p.list}>{PACKAGING.rules.map((r) => <li key={r}>{r}</li>)}</ul></div>
      </Section>
      <Section id="social" num="06" title="Social media" intro={SOCIAL.formats}>
        <div className={p.grid4}>{SOCIAL.families.map((f) => <div key={f.name} className={p.card}><b>{f.name}</b><span className={p.small}>{f.detail}</span><Link href={'/studio/edit/' + encodeURIComponent(f.tpl)} className={p.btn} style={{ alignSelf: 'flex-start', minHeight: 36, fontSize: 13 }}>Open template</Link></div>)}</div>
        <div className={p.card}><span className={p.cap}>Rules</span><ul className={p.list}>{SOCIAL.rules.map((r) => <li key={r}>{r}</li>)}</ul></div>
      </Section>
      <Section id="checklist" num="07" title="Quality checklist">
        <Checklist />
      </Section>
      <Section id="status" num="08" title="Finalised vs provisional">
        <div className={p.grid2}>
          <div className={p.card}><Badge tone="success" size="sm">Final (from logo)</Badge><p className={p.p}>{STATUS.final}</p></div>
          <div className={p.card}><Badge tone="warning" size="sm">Provisional — needs owner approval</Badge><ul className={p.list}>{STATUS.provisional.map((x) => <li key={x}>{x}</li>)}</ul></div>
        </div>
        <div className={p.note}><Icon name="camera" size={18} /><span>{STATUS.imagery}</span></div>
      </Section>
    </PageShell>
  );
}
