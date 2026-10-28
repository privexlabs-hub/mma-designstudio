'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Studio } from './Studio';

/** Maps the URL (/studio?cat=… or /studio/edit/<template id>) onto the persistent Studio instance. */
export function StudioRoot() {
  const path = usePathname() || '/studio';
  const params = useSearchParams();
  const router = useRouter();
  const m = /^\/studio\/edit\/([^/]+)/.exec(path);
  let tplId: string | null = null;
  if (m) { try { tplId = decodeURIComponent(m[1]); } catch { tplId = m[1]; } }
  const navigate = useCallback((href: string, replace?: boolean) => { if (replace) router.replace(href, { scroll: false }); else router.push(href, { scroll: false }); }, [router]);
  return <Studio route={m ? 'edit' : 'library'} tplId={tplId} cat={params.get('cat')} navigate={navigate} />;
}
