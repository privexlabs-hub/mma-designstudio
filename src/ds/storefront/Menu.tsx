'use client';
import { useState } from 'react';
import { Badge, Button, CategoryTabs, EmptyState, Icon, PhotoFrame, Price, ProductCard, QuantityStepper, RibbonRule, SectionHeading } from '@/ds';
import { CATS, PRODUCTS, type Go, type Product } from './data';
import s from './storefront.module.css';

export function MenuPage({ go, add, cat, setCat }: { go: Go; add: (p: Product) => void; cat: string; setCat: (c: string) => void }) {
  const list = PRODUCTS.filter((p) => cat === 'all' || p.category === cat);
  return (
    <section style={{ padding: '48px 0 var(--section-y)' }}>
      <div className={s.wrap}>
        <SectionHeading align="start" eyebrow="Menu" title="Everything we bake & blend" body="Prices are confirmed when we reply to your order." />
        <CategoryTabs items={CATS} value={cat} onChange={setCat} style={{ margin: '28px 0 32px' }} />
        {list.length ? (
          <div className={s.three}>
            {list.map((p) => <ProductCard key={p.id} image={p.image} name={p.name} description={p.desc} price={p.price} priceFrom={p.from} category={p.category} badge={p.badge} badgeTone={p.badgeTone} onAdd={() => add(p)} onClick={() => go('product', p.id)} />)}
          </div>
        ) : (
          <EmptyState icon="search" title="Nothing here yet" body="We’re still filling this shelf. Try another category." action={<Button variant="outline" onClick={() => setCat('all')}>Show all treats</Button>} />
        )}
      </div>
    </section>
  );
}

export function ProductPage({ id, go, add }: { id: string; go: Go; add: (p: Product) => void }) {
  const p = PRODUCTS.find((x) => x.id === id) || PRODUCTS[0];
  const [q, setQ] = useState(1);
  const facts: [string, string][] = [['clock', 'Lead time: [to confirm]'], ['store', 'Pickup from our kitchen'], ['truck', 'Delivery: [areas & fees to confirm]'], ['info', 'Ingredients & allergens: [to be supplied]']];
  return (
    <section style={{ padding: '40px 0 var(--section-y)' }}>
      <div className={s.wrap}>
        <button onClick={() => go('menu')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, cursor: 'pointer', padding: 0, marginBottom: 24, minHeight: 44 }}><Icon name="arrow-left" size={16} />Back to menu</button>
        <div className={s.product}>
          <PhotoFrame shape="arch" ratio="4/4.4" src={p.image} conceptual />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 16, alignItems: 'flex-start' }}>
            {p.badge && <Badge tone={p.badgeTone || 'pink'}>{p.badge}</Badge>}
            <h1 className="tbm-h1">{p.name}</h1>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>{p.desc}</p>
            <Price amount={p.price} from={p.from} size="lg" />
            <RibbonRule align="start" style={{ alignSelf: 'stretch' }} />
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <QuantityStepper value={q} onChange={setQ} />
              <Button size="lg" icon="shopping-bag" onClick={() => { for (let i = 0; i < q; i++) add(p); }}>Add to order</Button>
            </div>
            <div style={{ display: 'grid', gap: 10, padding: 18, background: 'var(--surface)', borderRadius: 'var(--radius-md)', fontSize: 14.5, alignSelf: 'stretch' }}>
              {facts.map(([i, t]) => <span key={t} style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-secondary)' }}><span style={{ color: 'var(--cocoa-800)', display: 'flex' }}><Icon name={i} size={18} /></span>{t}</span>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
