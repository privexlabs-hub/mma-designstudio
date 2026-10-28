import { Suspense } from 'react';
import { StudioRoot } from '@/features/studio/StudioRoot';

/* The studio is one persistent client app: the library and editor routes below only set the URL,
   and this layout renders the app so the open document and undo history survive navigation. */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<div style={{ height: '100dvh', display: 'grid', placeItems: 'center', color: 'var(--a-fg2)', fontWeight: 600 }}>Loading studio…</div>}>
        <StudioRoot />
      </Suspense>
      {children}
    </>
  );
}
