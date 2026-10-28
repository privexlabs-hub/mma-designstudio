'use client';
import { useState } from 'react';
import { Alert, Button, Checkbox, OptionCard, PhotoFrame, SectionHeading, SelectField, TextField } from '@/ds';
import { CAT_IMG, type Go } from './data';
import s from './storefront.module.css';

export function CakeOrderPage({ go }: { go: Go }) {
  const [size, setSize] = useState('8');
  const [fulfil, setFulfil] = useState('pickup');
  const [note, setNote] = useState(true);
  const [phone, setPhone] = useState('');
  const [err, setErr] = useState('');
  const [sent, setSent] = useState(false);
  const submit = () => {
    if (phone.replace(/\D/g, '').length < 10) { setErr('Please enter a full phone number so we can confirm on WhatsApp'); return; }
    setErr(''); setSent(true);
  };
  return (
    <section style={{ padding: '48px 0 var(--section-y)' }}>
      <div className={`${s.wrap} ${s.order}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, minWidth: 0 }}>
          <SectionHeading align="start" eyebrow="Celebration cakes" title="Tell us about your cake" body="Share the details and we’ll reply to confirm design, price and timing." />
          {sent ? (
            <Alert tone="success" title="Request sent — thank you!" action={<Button size="sm" variant="outline" onClick={() => go('home')}>Back to home</Button>}>We’ll message you on WhatsApp to confirm the details and price.</Alert>
          ) : (
            <>
              <div className={s.pair}>
                <SelectField label="Occasion" placeholder="Choose one" options={['Birthday', 'Anniversary', 'Wedding', 'Baby shower', 'Office party', 'Other']} required />
                <TextField label="Event date" type="date" required />
              </div>
              <div>
                <span style={{ display: 'block', fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Size</span>
                <div role="radiogroup" className={s.sizes}>
                  {[['6', '6-inch', 'Serves [X]'], ['8', '8-inch', 'Serves [X]'], ['tier', '2-tier', 'Serves [X]']].map(([v, t, d]) => <OptionCard key={v} title={t} description={d} meta="From ₦ [price]" selected={size === v} onClick={() => setSize(v)} />)}
                </div>
              </div>
              <div className={s.pair}>
                <SelectField label="Flavour" placeholder="Choose a flavour" options={['[Flavour options to confirm]']} />
                <TextField label="Message on the cake" placeholder="e.g. Happy 30th, Ada!" />
              </div>
              <TextField label="Design ideas" multiline rows={3} placeholder="Colours, theme, toppers — or say you’ll send a photo on WhatsApp" />
              <div role="radiogroup" className={s.pair} style={{ gap: 12 }}>
                <OptionCard icon="store" title="Pickup" description="Collect from our kitchen" selected={fulfil === 'pickup'} onClick={() => setFulfil('pickup')} />
                <OptionCard icon="truck" title="Delivery" description="[Areas & fees to confirm]" selected={fulfil === 'delivery'} onClick={() => setFulfil('delivery')} />
              </div>
              <div className={s.pair}>
                <TextField label="Your name" required />
                <TextField label="Phone (WhatsApp)" type="tel" icon="phone" value={phone} onChange={setPhone} error={err} required />
              </div>
              <Checkbox label="Add a gift note card" checked={note} onChange={setNote} />
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Button size="lg" icon="send" onClick={submit}>Send cake request</Button>
                <Button size="lg" variant="ghost" onClick={() => go('home')}>Cancel</Button>
              </div>
            </>
          )}
        </div>
        <aside className={s.sticky}>
          <PhotoFrame shape="arch" ratio="4/5" src={CAT_IMG.cakes} conceptual ring="var(--gold-500)" />
          <Alert tone="info" title="Good to know">Custom cakes need [X days] notice. Final price is confirmed after we review your design.</Alert>
        </aside>
      </div>
    </section>
  );
}
