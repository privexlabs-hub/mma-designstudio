import type { Metadata } from 'next';
import Link from 'next/link';
import { Storefront } from '@/ds/storefront/Storefront';

export const metadata: Metadata = { title: 'Storefront UI kit', description: 'Interactive storefront concept built from the Treats by MMA design system.' };

export default function StorefrontPage() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-page)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 12px', padding: '8px 16px', background: 'var(--cocoa-900)', color: 'var(--cream-50)', fontSize: 13, textAlign: 'center' }}>
        <span>UI kit concept — prices, lead times and delivery areas are placeholders. Imagery is conceptual.</span>
        <Link href="/design-system#motion" style={{ color: 'var(--gold-400)', fontWeight: 800, minHeight: 32, display: 'inline-flex', alignItems: 'center' }}>Back to the design system</Link>
      </div>
      <Storefront />
    </div>
  );
}
