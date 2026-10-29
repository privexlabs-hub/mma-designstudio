import type { Metadata } from 'next';
import { Badge, Icon } from '@/ds';
import { PageShell, Section } from '@/components/PageShell';
import p from '@/components/page.module.css';
import { AUDIT, BRAND, FACTS, VOICE } from '@/content/brand';
import { CopyButton } from '@/features/brand/CopyButton';

export const metadata: Metadata = { title: 'Brand Voice & Knowledge', description: 'How Treats by MMA writes — voice, rules, sample copy and the brand facts to confirm.' };

const TOC = [{ id: 'voice', label: 'Voice' }, { id: 'rules', label: 'Writing rules' }, { id: 'samples', label: 'Sample copy' }, { id: 'ctas', label: 'Calls to action' }, { id: 'knowledge', label: 'Brand knowledge' }];

export default function VoicePage() {
  return (
    <PageShell eyebrow="Brand voice & knowledge" title="Warm, deliciously descriptive, clear about ordering." lead="How Treats by MMA sounds, the rules every line follows, ready-to-use sample copy, and the facts we know about the business." toc={TOC}>
      <Section id="voice" num="01" title="Voice">
        <div className={p.auto}>{VOICE.traits.map((t) => <div key={t} className={p.card}><Icon name="heart" size={18} color="#C81F75" /><b style={{ fontSize: 17 }}>{t}</b></div>)}</div>
      </Section>
      <Section id="rules" num="02" title="Writing rules">
        <div className={p.grid2}>{VOICE.rules.map((r) => <div key={r.title} className={p.card}><span className={p.cap}>{r.title}</span><p className={p.p} style={{ color: 'var(--a-fg)' }}>{r.body}</p></div>)}</div>
        <div className={p.tableWrap}>
          <table className={p.table}>
            <thead><tr><th>Write</th><th>Not</th></tr></thead>
            <tbody>{VOICE.doDont.map((x) => <tr key={x.do}><td><span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Icon name="check" size={14} color="#23803F" />{x.do}</span></td><td><span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Icon name="x" size={14} color="#C0392B" />{x.dont}</span></td></tr>)}</tbody>
          </table>
        </div>
      </Section>
      <Section id="samples" num="03" title="Sample copy" intro="All sample copy is provisional — adapt it, and keep any [placeholder] until the real detail is confirmed.">
        {VOICE.samples.map((g) => (
          <div key={g.group} className={p.card}>
            <span className={p.cap}>{g.group}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {g.items.map((x, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', paddingTop: i ? 12 : 0, borderTop: i ? '1px solid var(--a-border)' : 0 }}>
                  <div style={{ flex: '1 1 260px', minWidth: 0 }}><span className={p.small} style={{ fontWeight: 700 }}>{x.label}</span><p className={p.p} style={{ color: 'var(--a-fg)' }}>{x.text}</p></div>
                  <CopyButton text={x.text} />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className={p.card}>
          <span className={p.cap}>Social bio · 150 characters</span>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <p className={p.p} style={{ color: 'var(--a-fg)', flex: '1 1 260px' }}>{BRAND.bio}</p>
            <CopyButton text={BRAND.bio} />
          </div>
          <span className={p.small}>{[...BRAND.bio].length} characters.</span>
        </div>
      </Section>
      <Section id="ctas" num="04" title="Calls to action" intro="Sentence case, plain and specific.">
        <div className="ds-stage" style={{ padding: 18, flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {VOICE.ctas.map((c) => <span key={c} style={{ display: 'inline-flex', alignItems: 'center', height: 44, padding: '0 20px', borderRadius: 999, background: 'var(--action-primary)', color: '#fff', fontWeight: 700 }}>{c}</span>)}
        </div>
      </Section>
      <Section id="knowledge" num="05" title="Brand knowledge" intro={BRAND.summary}>
        <div className={p.note}><Icon name="triangle-alert" size={18} /><span><b>Confirm before publishing. </b>These details were taken from the supplied signage/flyer. Prices, lead times, delivery areas, the founder story, reviews and statistics were not supplied and stay as [to confirm].</span></div>
        <div className={p.grid2}>
          {FACTS.map((x, i) => (
            <div key={i} className={p.card} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <span style={{ color: '#C81F75', display: 'flex' }}><Icon name={x.icon} size={22} /></span>
              <span style={{ flex: 1, minWidth: 0 }}><span className={p.cap}>{x.label}</span><br /><b style={{ overflowWrap: 'anywhere' }}>{x.value}</b></span>
              {x.href ? <a className={`${p.btn} ${p.btnSm}`} href={x.href} target="_blank" rel="noopener noreferrer" aria-label={'Open ' + x.label + ' ' + x.value} style={{ padding: '0 12px' }}><Icon name="external-link" size={14} /></a> : <CopyButton text={x.value} />}
            </div>
          ))}
        </div>
        <div className={p.grid2}>
          <div className={p.card}><span className={p.cap}>Products</span><p className={p.p}>Celebration cakes, pastries, banana bread, snacks, small chops, yogurt and yogurt fura.</p></div>
          <div className={p.card}><Badge tone="warning" size="sm">Spelling to confirm</Badge><p className={p.p}>{AUDIT.limitations[3]}</p></div>
        </div>
      </Section>
    </PageShell>
  );
}
