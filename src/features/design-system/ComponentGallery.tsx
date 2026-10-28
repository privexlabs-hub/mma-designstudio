'use client';
/* Design System section 9 — every component in the supplied design system, live. Demo copy is
   reused from the storefront kit and the readme's sample copy. */
import { useState, type ReactNode } from 'react';
import {
  Alert, AnnouncementBanner, Badge, Button, CategoryCard, CategoryTabs, Checkbox, EmptyState, Icon, IconButton, IcingEdge,
  NavBar, OptionCard, PhotoFrame, Price, ProductCard, QuantityStepper, RibbonRule, SectionHeading, SelectField, TextField,
} from '@/ds';
import { CATS, CAT_CAPTION, CAT_IMG, PRODUCTS } from '@/ds/storefront/data';
import f from './ds.module.css';

function Demo({ name, props, children, col, wide }: { name: string; props: string; children: ReactNode; col?: boolean; wide?: boolean }) {
  return (
    <div className={f.demo} style={wide ? { gridColumn: '1 / -1' } : undefined}>
      <header><b>{name}</b><code>{props}</code></header>
      <div className={`${f.stageInner} ${col ? f.stageCol : ''}`}>{children}</div>
    </div>
  );
}

const TONES = ['pink', 'gold', 'cocoa', 'milk', 'leaf', 'neutral', 'success', 'warning', 'error', 'info'] as const;

export function ComponentGallery() {
  const [qty, setQty] = useState(2);
  const [chk, setChk] = useState(true);
  const [opt, setOpt] = useState('pickup');
  const [cat, setCat] = useState('all');
  const [phone, setPhone] = useState('0813');
  const [banner, setBanner] = useState(true);
  const [catOn, setCatOn] = useState<'cakes' | 'bakes'>('cakes');
  const p = PRODUCTS;
  return (
    <div className={f.demoGrid}>
      <Demo name="Button" props="variant · size · icon · iconRight · fullWidth · disabled" col wide>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Button icon="shopping-bag">Order now</Button>
          <Button variant="secondary">Browse the menu</Button>
          <Button variant="outline">Plan a celebration cake</Button>
          <Button variant="ghost" iconRight="arrow-right">See full menu</Button>
          <Button variant="gold" iconRight="arrow-right">Start a cake request</Button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <Button size="sm">Small</Button><Button size="md">Medium</Button><Button size="lg" icon="message-circle">Order on WhatsApp</Button><Button disabled>Disabled</Button>
        </div>
      </Demo>
      <Demo name="IconButton" props="variant · size · count">
        <IconButton icon="shopping-bag" label="Your order" count={3} />
        <IconButton icon="heart" label="Save" variant="solid" />
        <IconButton icon="menu" label="Menu" variant="ghost" />
        <span style={{ background: 'var(--cocoa-800)', borderRadius: 999, padding: 4, display: 'inline-flex' }}><IconButton icon="x" label="Close" variant="inverse" /></span>
      </Demo>
      <Demo name="Icon" props="name · size · color · label">
        {['cake', 'croissant', 'sandwich', 'cup-soda', 'gift', 'truck'].map((n) => <Icon key={n} name={n} size={24} label={n} />)}
        <Icon name="heart" size={24} color="var(--icing-600)" label="heart" />
      </Demo>
      <Demo name="Badge" props="tone · variant · size · icon" wide>
        {TONES.map((t) => <Badge key={t} tone={t}>{t}</Badge>)}
        {TONES.map((t) => <Badge key={'s' + t} tone={t} variant="solid" size="sm">{t}</Badge>)}
        <Badge tone="pink" icon="sparkles">Made to order</Badge>
      </Demo>
      <Demo name="Price" props="amount · compareAt · from · size · tone" col>
        <Price amount={null} />
        <Price amount={null} from size="lg" />
        <Price amount={12000} />
        <span style={{ background: 'var(--cocoa-800)', padding: 12, borderRadius: 12 }}><Price amount={12000} tone="inverse" /></span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>₦12,000 is the readme’s currency-format example, not a real price. Missing prices show “₦ [price]”.</span>
      </Demo>
      <Demo name="QuantityStepper" props="value · min · max · onChange · size">
        <QuantityStepper value={qty} onChange={setQty} />
        <QuantityStepper value={qty} onChange={setQty} size="sm" min={0} max={5} />
      </Demo>
      <Demo name="ProductCard" props="image · name · description · price · priceFrom · category · badge · layout · onAdd" wide>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 230px), 1fr))', gap: 16, width: '100%' }}>
          {p.slice(0, 3).map((x) => <ProductCard key={x.id} image={x.image} name={x.name} description={x.desc} price={x.price} priceFrom={x.from} category={x.category} badge={x.badge} badgeTone={x.badgeTone} onAdd={() => setQty((q) => q + 1)} />)}
        </div>
        <ProductCard layout="horizontal" image={p[3].image} name={p[3].name} description={p[3].desc} price={p[3].price} category={p[3].category} onAdd={() => setQty((q) => q + 1)} style={{ width: '100%' }} />
      </Demo>
      <Demo name="CategoryCard" props="category · image · caption · active" wide>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 140px), 1fr))', gap: 16, width: '100%' }}>
          <CategoryCard category="cakes" image={CAT_IMG.cakes} caption={CAT_CAPTION.cakes} active={catOn === 'cakes'} onClick={() => setCatOn('cakes')} />
          <CategoryCard category="bakes" image={CAT_IMG.bakes} caption={CAT_CAPTION.bakes} active={catOn === 'bakes'} onClick={() => setCatOn('bakes')} />
          <CategoryCard category="chops" caption="No image → icon tint" />
          <CategoryCard category="yogurt" caption="No image → icon tint" />
        </div>
      </Demo>
      <Demo name="Alert" props="tone · title · action" col>
        <Alert tone="success" title="Request sent — thank you!">We’ll message you on WhatsApp to confirm the details and price.</Alert>
        <Alert tone="info" title="Good to know">Custom cakes need [X days] notice. Final price is confirmed after we review your design.</Alert>
        <Alert tone="warning" title="Fully booked">So sorry, we’re fully booked for [date]. Could [alternative date] work?</Alert>
        <Alert tone="error">Please enter a full phone number so we can confirm on WhatsApp</Alert>
      </Demo>
      <Demo name="AnnouncementBanner" props="tone · icon · actionLabel · onAction · onDismiss" col>
        {banner ? <AnnouncementBanner tone="cocoa" actionLabel="Order on WhatsApp" onDismiss={() => setBanner(false)}>Fresh out of the oven.</AnnouncementBanner> : <Button size="sm" variant="outline" onClick={() => setBanner(true)}>Show banner again</Button>}
        <AnnouncementBanner tone="pink" icon="cake">Plan a celebration cake</AnnouncementBanner>
        <AnnouncementBanner tone="gold" icon="gift">Party platters, sorted.</AnnouncementBanner>
        <AnnouncementBanner tone="cream" icon="clock">Order cut-off for [date]</AnnouncementBanner>
      </Demo>
      <Demo name="EmptyState" props="icon · title · body · action · tone" col>
        <EmptyState title="Your order is empty" body="Something sweet is only a tap away." action={<Button>Browse the menu</Button>} style={{ padding: '16px 8px' }} />
        <EmptyState tone="error" icon="search" title="Nothing here yet" body="We’re still filling this shelf. Try another category." style={{ padding: '16px 8px' }} />
      </Demo>
      <Demo name="Checkbox" props="label · checked · onChange · disabled" col>
        <Checkbox label="Add a gift note card" checked={chk} onChange={setChk} />
        <Checkbox label="Disabled option" disabled />
      </Demo>
      <Demo name="OptionCard" props="title · description · icon · selected · meta" col>
        <div role="radiogroup" aria-label="Fulfilment" style={{ display: 'grid', gap: 10 }}>
          <OptionCard icon="store" title="Pickup" description="Collect from our kitchen" selected={opt === 'pickup'} onClick={() => setOpt('pickup')} />
          <OptionCard icon="truck" title="Delivery" description="[Areas & fees to confirm]" selected={opt === 'delivery'} onClick={() => setOpt('delivery')} />
          <OptionCard title="8-inch" description="Serves [X]" meta="From ₦ [price]" selected={opt === 'size'} onClick={() => setOpt('size')} />
        </div>
      </Demo>
      <Demo name="SelectField" props="label · options · placeholder · hint · error · required" col>
        <SelectField id="ds-occasion" label="Occasion" placeholder="Choose one" options={['Birthday', 'Anniversary', 'Wedding', 'Baby shower', 'Office party', 'Other']} required hint="Hint text sits below the field." />
        <SelectField id="ds-flavour" label="Flavour" placeholder="Choose a flavour" options={['[Flavour options to confirm]']} />
      </Demo>
      <Demo name="TextField" props="label · hint · error · icon · type · multiline · required · disabled" col>
        <TextField id="ds-phone" label="Phone (WhatsApp)" type="tel" icon="phone" value={phone} onChange={setPhone} required error={phone.replace(/\D/g, '').length < 10 ? 'Please enter a full phone number so we can confirm on WhatsApp' : undefined} />
        <TextField id="ds-msg" label="Message on the cake" placeholder="e.g. Happy 30th, Ada!" />
        <TextField id="ds-ideas" label="Design ideas" multiline rows={3} placeholder="Colours, theme, toppers — or say you’ll send a photo on WhatsApp" />
        <TextField id="ds-dis" label="Disabled" disabled value="Not editable" />
      </Demo>
      <Demo name="CategoryTabs" props="items · value · onChange" wide>
        <CategoryTabs items={CATS} value={cat} onChange={setCat} style={{ width: '100%' }} />
      </Demo>
      <Demo name="NavBar" props="logoSrc · links · active · cartCount · compact" col wide>
        <NavBar logoSrc="/assets/ui/logo-320.webp" links={[{ id: 'home', label: 'Home' }, { id: 'menu', label: 'Menu' }, { id: 'celebrations', label: 'Celebration cakes' }]} active="menu" cartCount={qty} style={{ borderRadius: 12, overflowX: 'auto' }} />
        <NavBar logoSrc="/assets/ui/logo-320.webp" compact cartCount={qty} style={{ borderRadius: 12 }} />
      </Demo>
      <Demo name="SectionHeading" props="eyebrow · title · body · align · inverse · size" col wide>
        <SectionHeading eyebrow="Our treats" title="Something for every craving" body="From milestone cakes to everyday snacks, explore what’s fresh from our kitchen." />
        <div style={{ background: 'var(--cocoa-800)', padding: 20, borderRadius: 16 }}><SectionHeading inverse align="start" size="md" eyebrow="Celebrations" title="Your day, your cake, done beautifully." /></div>
      </Demo>
      <Demo name="RibbonRule" props="label · tone · align" col>
        <RibbonRule /><RibbonRule label="Signature treats" /><RibbonRule tone="cocoa" align="start" label="Menu" />
      </Demo>
      <Demo name="IcingEdge" props="color · background · height · flip" col>
        <IcingEdge height={28} />
        <IcingEdge color="var(--cocoa-800)" background="var(--cream-200)" height={24} flip />
      </Demo>
      <Demo name="PhotoFrame" props="src · shape · ratio · conceptual · ring · placeholder">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, width: '100%' }}>
          <PhotoFrame src={CAT_IMG.cakes} shape="arch" />
          <PhotoFrame src={CAT_IMG.bakes} shape="rounded" />
          <PhotoFrame src={CAT_IMG.chops} shape="circle" ratio="1/1" />
          <PhotoFrame shape="square" placeholder="Photo" />
        </div>
      </Demo>
    </div>
  );
}
