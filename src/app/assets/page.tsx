import type { Metadata } from 'next';
import { Badge, Icon } from '@/ds';
import { PageShell, Section } from '@/components/PageShell';
import p from '@/components/page.module.css';
import { AUDIT, LOGO_RULES } from '@/content/brand';
import f from './assets.module.css';

export const metadata: Metadata = { title: 'Asset Library', description: 'Treats by MMA logo, provisional monogram, conceptual photography, reference flyer and design-token files.' };

/* Dimensions and sizes measured from the supplied files. */
interface Asset { name: string; file: string; preview?: string; w: number; h: number; bytes: number; tag: [string, 'cocoa' | 'warning' | 'neutral' | 'pink']; note: string; contain?: boolean }
const LOGOS: Asset[] = [
  { name: 'Official logo', file: '/assets/logo/treats-by-mma-logo.png', preview: '/assets/ui/logo-768.webp', w: 1254, h: 1254, bytes: 1550950, tag: ['Official', 'cocoa'], note: LOGO_RULES.official + ' ' + AUDIT.limitations[0], contain: true },
  { name: 'Proposed cake monogram', file: '/assets/logo/proposed-cake-monogram.png', preview: '/assets/ui/monogram-256.webp', w: 740, h: 740, bytes: 660446, tag: ['Provisional', 'warning'], note: AUDIT.monogram },
];
const PHOTOS: Asset[] = [
  ['Celebration cake', 'concept-cake.png', 300, 183188], ['Banana bread', 'concept-banana-bread.png', 304, 205672], ['Doughnuts', 'concept-doughnuts.png', 304, 204422],
  ['Pastries', 'concept-pastries.png', 308, 227809], ['Small chops', 'concept-small-chops.png', 304, 204431], ['Yogurt fura', 'concept-yogurt-fura.png', 304, 190117],
].map(([name, file, s, bytes]) => ({ name: name as string, file: '/assets/photos/' + file, w: s as number, h: s as number, bytes: bytes as number, tag: ['Conceptual image', 'pink'] as Asset['tag'], note: 'Cropped from the supplied flyer; may not be a genuine Treats by MMA product. Soft at 1080 px and larger — replace with real photography.' }));
const REFERENCE: Asset[] = [{ name: 'Original signage / flyer', file: '/assets/reference/original-signage-flyer.png', preview: '/assets/ui/flyer-768.webp', w: 1254, h: 1254, bytes: 2889835, tag: ['Reference', 'neutral'], note: 'Existing signage/flyer (logo on wood wall, product list, contact details). Source of the concept photo crops and brand facts.', contain: true }];
const TOKENS: [string, string, string][] = [
  ['styles.css', '/downloads/design-tokens/styles.css', 'Entry file — imports the five token files below'],
  ['tokens/colors.css', '/downloads/design-tokens/tokens/colors.css', 'Palette, semantic roles, status and category accents'],
  ['tokens/typography.css', '/downloads/design-tokens/tokens/typography.css', 'Font stacks, weights, type scale (desktop + mobile)'],
  ['tokens/spacing.css', '/downloads/design-tokens/tokens/spacing.css', 'Spacing, containers, radii, borders, shadows, motion'],
  ['tokens/base.css', '/downloads/design-tokens/tokens/base.css', 'Base element styles and .tbm-* type classes'],
  ['tokens/fonts.css', '/downloads/design-tokens/tokens/fonts.css', 'Google Fonts import for Caprasimo + Figtree'],
  ['tokens/tokens.json', '/downloads/design-tokens/tokens/tokens.json', '173 tokens as JSON for design tools'],
];

const size = (b: number) => b >= 1e6 ? (b / 1048576).toFixed(1) + ' MB' : Math.round(b / 1024) + ' KB';
const base = (f: string) => f.split('/').pop() as string;

function Card({ a }: { a: Asset }) {
  return (
    <figure className={f.asset}>
      <div className={f.preview} style={{ background: a.contain ? '#FFF4DC' : 'var(--a-canvas)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- supplied brand file shown unaltered */}
        <img src={a.preview || a.file} alt={a.name} loading="lazy" style={{ objectFit: a.contain ? 'contain' : 'cover' }} />
      </div>
      <figcaption className={f.meta}>
        <div className={f.metaTop}><b>{a.name}</b><Badge tone={a.tag[1]} size="sm">{a.tag[0]}</Badge></div>
        <span className={p.small}>PNG · {a.w} × {a.h} px · {size(a.bytes)}</span>
        <p className={p.small} style={{ margin: 0 }}>{a.note}</p>
        <a className={`${p.btn} ${p.btnSm}`} href={a.file} download={base(a.file)} style={{ alignSelf: 'flex-start', fontSize: 13 }}><Icon name="download" size={14} />Download</a>
      </figcaption>
    </figure>
  );
}

const TOC = [{ id: 'logos', label: 'Logo & monogram' }, { id: 'photos', label: 'Photography' }, { id: 'reference', label: 'Reference' }, { id: 'tokens', label: 'Design tokens' }, { id: 'needed', label: 'Still needed' }];

export default function AssetsPage() {
  return (
    <PageShell eyebrow="Asset library" title="Every supplied brand file, in one place." lead="Download the logo, the provisional monogram, the conceptual photos, the reference flyer and the design-token files. Previews are lightweight copies; downloads are the files exactly as supplied." toc={TOC}>
      <Section id="logos" num="01" title="Logo & monogram"><div className={f.grid}>{LOGOS.map((a) => <Card key={a.file} a={a} />)}</div></Section>
      <Section id="photos" num="02" title="Photography" intro="Six concept crops from the supplied flyer. Label them “Conceptual image” wherever they are used."><div className={f.grid}>{PHOTOS.map((a) => <Card key={a.file} a={a} />)}</div></Section>
      <Section id="reference" num="03" title="Reference"><div className={f.grid}>{REFERENCE.map((a) => <Card key={a.file} a={a} />)}</div></Section>
      <Section id="tokens" num="04" title="Design tokens" intro="The design-system token files, unchanged, in their original folder structure.">
        <div className={p.tableWrap}>
          <table className={p.table}>
            <thead><tr><th>File</th><th>Contents</th><th><span className="sr-only">Download</span></th></tr></thead>
            <tbody>{TOKENS.map(([n, href, d]) => <tr key={n}><td><code>{n}</code></td><td>{d}</td><td style={{ textAlign: 'right' }}><a className={`${p.btn} ${p.btnSm}`} href={href} download={base(href)} aria-label={'Download ' + n} style={{ padding: '0 12px' }}><Icon name="download" size={14} /></a></td></tr>)}</tbody>
          </table>
        </div>
      </Section>
      <Section id="needed" num="05" title="Still needed from the owner">
        <ul className={p.list}>
          <li>Original vector / transparent PNG files of the logo.</li>
          <li>Real product photography to replace the 300 px concept crops.</li>
          <li>Approval (or a commissioned vector redraw) of the provisional monogram.</li>
          <li>Every [to confirm] detail: prices, lead times, delivery areas, founder story, reviews and statistics.</li>
        </ul>
      </Section>
    </PageShell>
  );
}
