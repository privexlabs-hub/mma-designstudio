import { Badge, Button, CategoryCard, Icon, IcingEdge, PhotoFrame, ProductCard, RibbonRule, SectionHeading, type CategoryId } from '@/ds';
import { CAT_CAPTION, CAT_IMG, PRODUCTS, type Go, type Product } from './data';
import s from './storefront.module.css';

function Hero({ go }: { go: Go }) {
  return (
    <section style={{ background: 'var(--bg-page)', padding: '56px 0 72px' }}>
      <div className={`${s.wrap} ${s.hero}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'flex-start' }}>
          <Badge tone="pink" icon="sparkles" style={{ whiteSpace: 'normal', height: 'auto', minHeight: 28, padding: '4px 12px' }}>Cakes · Pastries · Small chops · Yogurt fura</Badge>
          <h1 className="tbm-display" style={{ color: 'var(--cocoa-800)' }}>Treats that make the <span style={{ color: 'var(--icing-600)' }}>moment.</span></h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: 480 }}>Celebration cakes, warm banana bread, party small chops and chilled yogurt fura — baked with care for birthdays, gatherings and every ordinary craving.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button size="lg" icon="shopping-bag" onClick={() => go('menu')}>Browse the menu</Button>
            <Button size="lg" variant="outline" onClick={() => go('celebrations')}>Plan a celebration cake</Button>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <PhotoFrame shape="arch" ratio="4/4.6" src={CAT_IMG.cakes} conceptual ring="var(--gold-500)" style={{ maxWidth: 440, marginLeft: 'auto' }} />
          <div style={{ position: 'absolute', left: 0, bottom: 40, background: 'var(--surface)', borderRadius: 20, boxShadow: 'var(--shadow-3)', padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ width: 44, height: 44, borderRadius: 22, background: 'var(--icing-100)', color: 'var(--icing-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="cake" size={22} /></span>
            <span><b style={{ display: 'block', fontSize: 15 }}>Custom cakes</b><span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Book [X days] ahead</span></span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Categories({ go }: { go: Go }) {
  const cats: CategoryId[] = ['cakes', 'bakes', 'chops', 'yogurt', 'celebration'];
  return (
    <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-page-alt)' }}>
      <div className={s.wrap}>
        <SectionHeading eyebrow="Our treats" title="Something for every craving" body="From milestone cakes to everyday snacks, explore what’s fresh from our kitchen." />
        <div className={s.cats}>
          {cats.map((c) => <CategoryCard key={c} category={c} image={CAT_IMG[c]} caption={CAT_CAPTION[c]} onClick={() => go('menu', c)} />)}
        </div>
      </div>
    </section>
  );
}

function Signature({ go, add }: { go: Go; add: (p: Product) => void }) {
  return (
    <section style={{ padding: 'var(--section-y) 0' }}>
      <div className={s.wrap}>
        <div className={s.headRow}>
          <SectionHeading align="start" eyebrow="Signature treats" title="The ones everyone asks for" />
          <Button variant="ghost" iconRight="arrow-right" onClick={() => go('menu')}>See full menu</Button>
        </div>
        <div className={s.four}>
          {PRODUCTS.slice(0, 4).map((p) => <ProductCard key={p.id} image={p.image} name={p.name} description={p.desc} price={p.price} priceFrom={p.from} category={p.category} badge={p.badge} badgeTone={p.badgeTone} onAdd={() => add(p)} onClick={() => go('product', p.id)} />)}
        </div>
      </div>
    </section>
  );
}

function Celebration({ go }: { go: Go }) {
  return (
    <section style={{ background: 'var(--cocoa-800)', color: 'var(--cream-50)', position: 'relative' }}>
      <IcingEdge background="var(--bg-page)" color="var(--cocoa-800)" height={30} flip />
      <div className={`${s.wrap} ${s.celebration}`} style={{ padding: '64px var(--page-margin) 88px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <PhotoFrame shape="arch" src={CAT_IMG.cakes} conceptual />
          <PhotoFrame shape="rounded" src={CAT_IMG.celebration} style={{ marginTop: 48 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <SectionHeading inverse align="start" eyebrow="Celebrations" title="Your day, your cake, done beautifully." body="Tell us the occasion, the date and the look you love. We’ll help with size, flavour and finish — then bake it to order." />
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
            {['Birthdays, anniversaries & milestones', 'Matching treats & small chops for the party', 'Gift-ready boxes and message cards'].map((t) => (
              <li key={t} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 16 }}><span style={{ color: 'var(--gold-400)', display: 'flex' }}><Icon name="check" size={18} /></span>{t}</li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: 12 }}><Button variant="gold" size="lg" iconRight="arrow-right" onClick={() => go('celebrations')}>Start a cake request</Button></div>
        </div>
      </div>
    </section>
  );
}

function HowTo() {
  const steps: [string, string, string][] = [['message-circle', 'Message us', 'Send your order on WhatsApp or through this site.'], ['cake-slice', 'Choose your treats', 'Pick products, quantity, date and any custom details.'], ['circle-check', 'We confirm', 'We reply to confirm price, timing and payment.'], ['truck', 'Pickup or delivery', 'Collect from our kitchen or arrange delivery [areas to confirm].']];
  return (
    <section style={{ padding: 'var(--section-y) 0', background: 'var(--bg-page-alt)' }}>
      <div className={s.wrap}>
        <SectionHeading eyebrow="How ordering works" title="Easy from craving to collection" />
        <div className={s.four} style={{ marginTop: 44 }}>
          {steps.map(([i, t, d], n) => (
            <div key={t} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 24, display: 'flex', flexDirection: 'column', gap: 10, boxShadow: 'var(--shadow-1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--icing-100)', color: 'var(--icing-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={i} size={22} /></span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--cream-300)' }}>{n + 1}</span>
              </div>
              <h3 className="tbm-h4">{t}</h3>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const rows: [string, string, string][] = [['message-circle', 'WhatsApp', '0813 107 7321 · 0815 585 6020'], ['instagram', 'Instagram', '@treats_by_mma'], ['music-2', 'TikTok', '@.mmacakeandpastry'], ['map-pin', 'Kitchen', 'Festmed Primary School, Gwuzunu, Kaduna Road, Suleja, Abuja']];
  return (
    <section style={{ padding: 'var(--section-y) 0' }}>
      <div className={`${s.wrap} ${s.contact}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionHeading align="start" eyebrow="Say hello" title="We’d love to bake for you" body="Questions, custom requests or a quick order — reach us the way that suits you." />
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {rows.map(([i, t, v]) => (
            <div key={t} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '14px 18px', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--icing-600)', display: 'flex' }}><Icon name={i} size={22} /></span>
              <span style={{ minWidth: 0 }}><b style={{ display: 'block', fontSize: 14 }}>{t}</b><span style={{ fontSize: 15, color: 'var(--text-secondary)' }}>{v}</span></span>
            </div>
          ))}
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Contact details taken from supplied signage — confirm before publishing.</span>
        </div>
      </div>
    </section>
  );
}

export function Footer({ go }: { go: Go }) {
  const cols: [string, string[]][] = [['Shop', ['Cakes', 'Pastries & Banana Bread', 'Small Chops', 'Yogurt & Fura']], ['Order', ['How to order', 'Celebration cakes', 'Pickup & delivery']], ['Follow', ['Instagram', 'TikTok', 'Facebook']]];
  return (
    <footer style={{ background: 'var(--cocoa-900)', color: 'var(--cocoa-300)' }}>
      <div className={`${s.wrap} ${s.footer}`} style={{ padding: '56px var(--page-margin) 32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--gold-400)' }}>Treats by MMA</span>
          <p style={{ fontSize: 14, maxWidth: 280 }}>Cakes, pastries, banana bread, small chops, yogurt and yogurt fura — made to make every occasion special.</p>
        </div>
        {cols.map(([h, l]) => (
          <div key={h} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="tbm-label" style={{ color: 'var(--gold-400)' }}>{h}</span>
            {l.map((x) => <a key={x} href="#" onClick={(e) => { e.preventDefault(); go('menu'); }} style={{ color: 'var(--cream-100)', textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', minHeight: 'var(--tap-sm, 0px)' }}>{x}</a>)}
          </div>
        ))}
      </div>
      <div className={s.wrap} style={{ padding: '0 var(--page-margin) 28px' }}>
        <RibbonRule tone="gold" />
        <p style={{ fontSize: 12.5, marginTop: 16, textAlign: 'center' }}>© [Year] Treats by MMA · [Policies to confirm]</p>
      </div>
    </footer>
  );
}

export function HomePage({ go, add }: { go: Go; add: (p: Product) => void }) {
  return <><Hero go={go} /><Categories go={go} /><Signature go={go} add={add} /><Celebration go={go} /><HowTo /><Contact /></>;
}
