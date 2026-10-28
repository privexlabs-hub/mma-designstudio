/* Design System sections 1–5: logo, colour, typography, spacing & grid, shape & elevation.
   Values come from the token files (via the generated tokens.json) and the readme. */
import { Badge, Icon } from '@/ds';
import { Section } from '@/components/PageShell';
import p from '@/components/page.module.css';
import { AUDIT, COLOUR_RULES, LAYOUT_RULES, LOGO_RULES, SHAPE_RULES, TYPE_RULES } from '@/content/brand';
import { contrast, grade } from '@/lib/contrast';
import tokens from '../../../public/downloads/design-tokens/tokens/tokens.json';
import f from './ds.module.css';

const T = tokens.tokens;
const tok = (name: string) => T.find((t) => t.name === name)?.value || '';
const scale = (prefix: string) => T.filter((t) => t.kind === 'color' && t.name.startsWith('--' + prefix + '-') && /^#/.test(t.value));

function Swatch({ name, value }: { name: string; value: string }) {
  const dark = contrast(value, '#3D1D10') < contrast(value, '#FFFFFF');
  return (
    <div className={f.swatch} style={{ background: value, color: dark ? '#FFFFFF' : '#3D1D10' }}>
      <span className={f.swName}>{name.replace(/^--/, '')}</span>
      <span className={f.swHex}>{value.toUpperCase()}</span>
    </div>
  );
}

export function LogoSection() {
  return (
    <Section id="logo" num="01 · Brand" title="Logo & monogram" intro={LOGO_RULES.official}>
      <div className={p.grid2}>
        <div className={p.stage} style={{ alignItems: 'center', justifyContent: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- supplied raster logo, shown unaltered */}
          <img src="/assets/ui/logo-768.webp" alt="Treats by MMA official logo" style={{ width: 'min(100%, 320px)', height: 'auto', display: 'block' }} />
          <Badge tone="cocoa" size="sm">Official · raster 1254 × 1254</Badge>
        </div>
        <div className={p.card}>
          <span className={p.cap}>Anatomy</span>
          <p className={p.p}>{AUDIT.anatomy}</p>
          <span className={p.cap}>Colours extracted</span>
          <p className={p.p}>{AUDIT.colours}</p>
        </div>
      </div>
      <div className={p.grid3}>
        <div className={p.card}>
          <span className={p.cap}>Clear space</span>
          <div className={f.clear}><span className={f.clearLabel}>X</span>
            {/* eslint-disable-next-line @next/next/no-img-element -- supplied raster logo, shown unaltered */}
            <img src="/assets/ui/logo-320.webp" alt="" />
          </div>
          <p className={p.small}>{LOGO_RULES.clearspace} Diagram not to scale.</p>
        </div>
        <div className={p.card}>
          <span className={p.cap}>On backgrounds</span>
          <div className={f.bgRow}>
            {[['#FFF4DC', 'Cream'], ['#3D1D10', 'Cocoa'], ['photo', 'Photo']].map(([bg, l]) => (
              <div key={l} className={f.bgTile} style={bg === 'photo' ? { backgroundImage: 'url(/assets/photos/concept-pastries.png)', backgroundSize: 'cover' } : { background: bg }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- supplied raster logo on its cream tile */}
                <img src="/assets/ui/logo-320.webp" alt="" style={{ background: '#FFF4DC', borderRadius: 10 }} />
                <span>{l}</span>
              </div>
            ))}
          </div>
          <p className={p.small}>{LOGO_RULES.backgrounds}</p>
        </div>
        <div className={p.card}>
          <span className={p.cap}>Incorrect usage</span>
          <div className={f.bgRow}>
            {[['hue-rotate(140deg)', 'none', 'Recoloured'], ['none', 'scaleX(1.45)', 'Distorted']].map(([fl, tr, l]) => (
              <div key={l} className={f.bgTile} style={{ background: '#FFF4DC' }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- deliberately altered to illustrate misuse */}
                <img src="/assets/ui/logo-320.webp" alt="" style={{ filter: fl, transform: tr }} />
                <span className={f.dont}><Icon name="x" size={12} /> {l}</span>
              </div>
            ))}
          </div>
          <p className={p.small}>{LOGO_RULES.misuse} {LOGO_RULES.minimum}</p>
        </div>
      </div>
      <div className={p.grid2}>
        <div className={p.stage} style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- provisional monogram crop */}
          <img src="/assets/ui/monogram-256.webp" alt="Proposed cake monogram (provisional)" style={{ width: 120, height: 120, borderRadius: 24, objectFit: 'cover' }} />
          {/* eslint-disable-next-line @next/next/no-img-element -- provisional monogram crop */}
          <img src="/assets/ui/monogram-256.webp" alt="" style={{ width: 64, height: 64, borderRadius: 999, objectFit: 'cover', boxShadow: '0 0 0 4px #3D1D10, 0 0 0 7px #E8B323' }} />
          {/* eslint-disable-next-line @next/next/no-img-element -- provisional monogram crop */}
          <img src="/assets/ui/monogram-256.webp" alt="" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} />
        </div>
        <div className={p.card}>
          <span className={p.flag}><Icon name="triangle-alert" size={12} /> Provisional</span>
          <span className={p.h3}>Proposed compact mark</span>
          <p className={p.p}>{AUDIT.monogram} Needs owner approval.</p>
        </div>
      </div>
    </Section>
  );
}

const PAIRS: [string, string, string, string][] = [
  ['#3D1D10', '#FFF4DC', 'Cocoa on butter vanilla', 'All text'],
  ['#FFF9EA', '#3D1D10', 'Cream on cocoa', 'Text on dark grounds'],
  ['#7A4A33', '#FFF4DC', 'Cocoa-600 on butter vanilla', 'Secondary text'],
  ['#AD1660', '#FFF4DC', 'Icing-700 on butter vanilla', 'Links'],
  ['#F2C94C', '#3D1D10', 'Gold-400 on cocoa', 'Gold text — only on cocoa'],
  ['#E8B323', '#3D1D10', 'Gold on cocoa', 'Gold text — only on cocoa'],
  ['#FFFFFF', '#C81F75', 'White on icing-600', 'Primary action'],
  ['#FFFFFF', '#E8358F', 'White on icing-500', 'Large text only'],
  ['#E8B323', '#FFF4DC', 'Gold on butter vanilla', 'Never for text'],
];
const SCALES: [string, string][] = [['cocoa', 'Cocoa — the cake body'], ['gold', 'Gold — lettering + cake stand'], ['icing', 'Icing pink — the drip'], ['cream', 'Butter vanilla — page ground'], ['milk', 'Milk blue (proposed) — yogurt & fura'], ['leaf', 'Leaf green (proposed) — small chops'], ['sky', 'Sky — info only']];
const ROLES = ['--brand-primary', '--brand-secondary', '--brand-accent', '--action-primary', '--action-primary-hover', '--action-secondary', '--bg-page', '--surface', '--surface-sunken', '--surface-inverse', '--text-primary', '--text-secondary', '--text-muted', '--text-link', '--border-subtle', '--border-default', '--border-strong', '--border-focus'];
const STATUS: [string, string][] = [['success', 'Success'], ['warning', 'Warning'], ['error', 'Error'], ['info', 'Info']];

export function ColourSection() {
  return (
    <Section id="colour" num="02 · Foundations" title="Colour" intro={COLOUR_RULES.palette + ' ' + COLOUR_RULES.text}>
      <ul className={p.list}>{COLOUR_RULES.roles.map((r) => <li key={r}>{r}</li>)}</ul>
      <div className={p.card}>
        <span className={p.cap}>Proportion · 60 / 25 / 10 / 5</span>
        <div className={f.prop}>{COLOUR_RULES.proportion.map(([n, v, c]) => <div key={n} style={{ flex: v, background: c, color: n === 'Butter vanilla' || n === 'Gold' ? '#3D1D10' : '#FFF9EA' }}><b>{v}</b><span>{n}</span></div>)}</div>
        <p className={p.small}>Pink is the spark, not the base. {COLOUR_RULES.proportionNote}</p>
      </div>
      {SCALES.map(([k, label]) => (
        <div key={k} className={f.scale}>
          <span className={p.cap}>{label}</span>
          <div className={f.swRow}>{scale(k).map((t) => <Swatch key={t.name} name={t.name} value={t.value} />)}</div>
        </div>
      ))}
      <div className={p.grid2}>
        <div className={p.card}>
          <span className={p.cap}>Semantic roles</span>
          <div className={f.roleList}>{ROLES.map((r) => <div key={r} className={f.role}><span className={f.chip} style={{ background: 'var(' + r + ')' }} /><code>{r}</code><span className={p.small}>{tok(r).replace(/var\(--(.+)\)/, '$1')}</span></div>)}</div>
        </div>
        <div className={p.card}>
          <span className={p.cap}>Status — tinted fill + deep foreground</span>
          <div className="ds-stage" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {STATUS.map(([k, l]) => <div key={k} className={f.status} style={{ background: 'var(--' + k + '-bg)', color: 'var(--' + k + '-fg)' }}><span className={f.chip} style={{ background: 'var(--' + k + ')' }} />{l}</div>)}
          </div>
          <span className={p.cap}>Gold foil gradient</span>
          <div className={f.foil}><span>Gold foil · on cocoa only</span></div>
          <p className={p.small}>{COLOUR_RULES.gradients}</p>
        </div>
      </div>
      <div className={p.card}>
        <span className={p.cap}>Accessible pairings · WCAG contrast computed from the tokens</span>
        <div className={f.pairs}>
          {PAIRS.map(([fg, bg, name, use]) => {
            const r = contrast(fg, bg), g = grade(r);
            return (
              <div key={name} className={f.pair}>
                <div className={f.pairSample} style={{ color: fg, background: bg }}><span style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>Aa</span><span style={{ fontSize: 13, fontWeight: 600 }}>Sweet moments</span></div>
                <div className={f.pairMeta}><b>{name}</b><span>{use}</span><span className={f.ratio}>{r.toFixed(2)}:1 <em data-grade={g}>{g}</em></span></div>
              </div>
            );
          })}
        </div>
        <p className={p.small}>AA ≥4.5 normal text, ≥3 large.</p>
      </div>
      <div className={p.grid2}>
        <div className={p.note}><Icon name="ban" size={18} /><span><b>Deliberate exclusions. </b>{COLOUR_RULES.exclusions}</span></div>
        <div className={p.note}><Icon name="printer" size={18} /><span><b>Print note. </b>{COLOUR_RULES.print}</span></div>
      </div>
    </Section>
  );
}

const SCALE_ROWS: [string, string, string, string, string][] = [
  ['Display', 'Caprasimo 400', '72', '46', '1.02'], ['H1', 'Caprasimo 400', '52', '36', '1.12'], ['H2', 'Caprasimo 400', '38', '29', '1.12'], ['H3', 'Caprasimo 400', '28', '23', '1.3'],
  ['H4', 'Figtree 700', '22', '19', '1.3'], ['Large', 'Figtree 400', '19', '17', '1.55'], ['Body', 'Figtree 400', '16', '16', '1.55'], ['Small', 'Figtree 400', '14', '14', '1.55'], ['Label', 'Figtree 700 · UPPER +0.12em', '12', '12', '—'],
  ['Price', 'Figtree 800 tabular', '20', '20', '—'], ['Price large', 'Figtree 800 tabular', '28', '24', '—'], ['Product name', 'Caprasimo 400', '20', '18', '1.15'],
];

export function TypeSection() {
  return (
    <Section id="type" num="03 · Foundations" title="Typography" intro={TYPE_RULES.summary}>
      <div className={p.grid2}>
        <div className={p.stage}>
          <span className={p.cap} style={{ color: 'var(--text-secondary)' }}>Display — Caprasimo</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px,6vw,64px)', lineHeight: 1.02 }}>Treats that make the <span style={{ color: 'var(--icing-600)' }}>moment.</span></span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, wordBreak: 'break-all' }}>Aa Bb Cc Dd Ee Ff Gg 0123456789 ₦</span>
          <span className={p.small} style={{ color: 'var(--text-secondary)' }}>Headlines, product names, campaign type. Regular 400 only. Echoes the logo’s chunky soft-serif.</span>
        </div>
        <div className={p.stage}>
          <span className={p.cap} style={{ color: 'var(--text-secondary)' }}>Body — Figtree</span>
          {[400, 500, 600, 700, 800].map((w) => <span key={w} style={{ fontWeight: w, fontSize: 19 }}>{w} · Soft crumb, golden crust ₦12,000</span>)}
          <span className={p.small} style={{ color: 'var(--text-secondary)' }}>Descriptions, ordering info, UI, prices. 400–800.</span>
        </div>
      </div>
      <div className={p.tableWrap}>
        <table className={p.table}>
          <thead><tr><th>Style</th><th>Font</th><th>Desktop px</th><th>Mobile px (≤640)</th><th>Line height</th></tr></thead>
          <tbody>{SCALE_ROWS.map(([n, fo, d, m, lh]) => <tr key={n}><td><b>{n}</b></td><td>{fo}</td><td>{d}</td><td>{m}</td><td>{lh}</td></tr>)}</tbody>
        </table>
      </div>
      <div className={p.stage}>
        <span className="tbm-label" style={{ color: 'var(--icing-700)' }}>Label · uppercase +0.12em</span>
        <h3 className="tbm-h1">Your day, your cake, done beautifully.</h3>
        <h4 className="tbm-h3">Something sweet for every craving</h4>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', maxWidth: 560 }}>Body copy describes food with the senses — soft crumb, golden crust — and is crystal-clear about ordering.</p>
      </div>
      <ul className={p.list}>{TYPE_RULES.rules.map((r) => <li key={r}>{r}</li>)}<li>Case: sentence case for headlines and buttons; Title Case for product names; UPPERCASE only for small tracked labels/badges.</li></ul>
      <p className={p.small}><Icon name="info" size={14} /> {TYPE_RULES.substitution} The webfonts are self-hosted in this app.</p>
    </Section>
  );
}

export function SpacingSection() {
  const space = T.filter((t) => /^--space-\d+$/.test(t.name));
  return (
    <Section id="spacing" num="04 · Foundations" title="Spacing & layout grid" intro={LAYOUT_RULES[0]}>
      <div className={p.card}>
        <span className={p.cap}>Spacing scale · 4px base unit</span>
        <div className={f.spaceList}>
          {space.map((t) => <div key={t.name} className={f.spaceRow}><code>{t.name}</code><span className={f.spaceBar} style={{ width: t.value === '0' ? 2 : t.value }} /><span className={p.small}>{t.value}</span></div>)}
        </div>
      </div>
      <div className={p.card}>
        <span className={p.cap}>Layout grid · 12 col desktop · 4 col mobile · 24px gutter · max 1200px</span>
        <div className={f.gridDemo}>{Array.from({ length: 12 }, (_, i) => <span key={i}>{i + 1}</span>)}</div>
        <p className={p.small}>This demo uses the real breakpoint: resize the window below 640px to see the 4-column mobile grid with 16px gutters.</p>
      </div>
      <div className={p.grid3}>
        {[['Section padding', tok('--space-24') + ' desktop · ' + tok('--space-16') + ' mobile'], ['Container', '640 · 960 · 1200 · 1360 px (sm · md · lg · xl)'], ['Page margin', tok('--space-8') + ' desktop · ' + tok('--space-5') + ' mobile']].map(([a, b]) => <div key={a} className={p.card}><span className={p.cap}>{a}</span><b>{b}</b></div>)}
      </div>
      <p className={p.p}>{LAYOUT_RULES[1]}</p>
    </Section>
  );
}

export function ShapeSection() {
  const radii = T.filter((t) => t.name.startsWith('--radius-'));
  const shadows = T.filter((t) => /^--shadow-/.test(t.name));
  return (
    <Section id="shape" num="05 · Foundations" title="Shape, radii & elevation" intro="Soft, confectionery corners — the arch is the signature shape.">
      <div className="ds-stage" style={{ padding: 24 }}>
        <div className={f.radii}>
          {radii.map((t) => <div key={t.name} className={f.radiusItem}><span style={{ borderRadius: t.value, aspectRatio: t.name === '--radius-arch' ? '4/5' : '1' }} /><code>{t.name.replace('--', '')}</code><small>{t.value}</small></div>)}
        </div>
      </div>
      <div className="ds-stage" style={{ padding: 24 }}>
        <div className={f.shadows}>
          {shadows.map((t) => <div key={t.name} className={f.shadowItem} style={{ boxShadow: t.value }}><code>{t.name.replace('--', '')}</code></div>)}
          {['--border-thin', '--border-thick', '--border-frame'].map((b) => <div key={b} className={f.shadowItem} style={{ border: tok(b) + ' solid var(--cocoa-800)', boxShadow: 'none' }}><code>{b.replace('--', '')} · {tok(b)}</code></div>)}
        </div>
      </div>
      <ul className={p.list}>{SHAPE_RULES.map((r) => <li key={r}>{r}</li>)}</ul>
    </Section>
  );
}
