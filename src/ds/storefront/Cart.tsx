'use client';
import { useEffect, useState } from 'react';
import { Button, EmptyState, IconButton, Price, QuantityStepper } from '@/ds';
import type { CartItem, Go } from './data';

export function CartDrawer({ open, items, setQty, close, go }: { open: boolean; items: CartItem[]; setQty: (id: string, q: number) => void; close: () => void; go: Go }) {
  const [sent, setSent] = useState(false);
  // Reset the confirmation once the drawer closes (mirrors the kit's effect).
  useEffect(() => { if (!open) setSent(false); }, [open]);
  const count = items.reduce((a, b) => a + b.qty, 0);
  return (
    <>
      <div onClick={close} style={{ position: 'fixed', inset: 0, background: 'rgba(30,13,6,.4)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity var(--dur-slow)', zIndex: 40 }} />
      <aside aria-hidden={!open} inert={!open} style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, maxWidth: '100%', background: 'var(--bg-page)', boxShadow: 'var(--shadow-3)', transform: open ? 'none' : 'translateX(100%)', visibility: open ? 'visible' : 'hidden', transition: 'transform var(--dur-slow) var(--ease-out), visibility var(--dur-slow)', zIndex: 41, display: 'flex', flexDirection: 'column', color: 'var(--text-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 className="tbm-h3">Your order{count ? ' (' + count + ')' : ''}</h2>
          <IconButton icon="x" label="Close" variant="ghost" onClick={close} />
        </div>
        {sent ? (
          <EmptyState icon="circle-check" title="Order request sent" body="Thank you! We’ll reply on WhatsApp to confirm items, price and timing." action={<Button onClick={close}>Keep browsing</Button>} style={{ flex: 1, justifyContent: 'center' }} />
        ) : !items.length ? (
          <EmptyState title="Your order is empty" body="Something sweet is only a tap away." action={<Button onClick={() => { close(); go('menu'); }}>Browse the menu</Button>} style={{ flex: 1, justifyContent: 'center' }} />
        ) : (
          <>
            <div style={{ flex: 1, overflow: 'auto', padding: '8px 24px' }}>
              {items.map((it) => (
                <div key={it.id} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--divider)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- brand photos are plain static files */}
                  <img src={it.image} alt="" style={{ width: 64, height: 64, borderRadius: 14, objectFit: 'cover', flex: 'none' }} />
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <b style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 17 }}>{it.name}</b>
                    <Price amount={it.price} size="sm" from={it.from} />
                  </div>
                  <QuantityStepper size="sm" min={0} value={it.qty} onChange={(v) => setQty(it.id, v)} />
                </div>
              ))}
            </div>
            <div style={{ padding: 24, paddingBottom: 'calc(24px + env(safe-area-inset-bottom))', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}><span style={{ color: 'var(--text-secondary)' }}>Estimated total</span><Price amount={null} /></div>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>We confirm the final price and pickup/delivery when we reply.</span>
              <Button size="lg" fullWidth icon="message-circle" onClick={() => setSent(true)}>Send order on WhatsApp</Button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
