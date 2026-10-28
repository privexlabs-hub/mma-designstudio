'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Studio } from './Studio';

/** Maps the URL (/studio?cat=… or /studio/edit/<template id>) onto the persistent Studio instance. */
export function StudioRoot() {
  const path = usePathname() || '/studio';
  const params = useSearchParams();
  const m = /^\/studio\/edit\/([^/]+)/.exec(path);
  let tplId: string | null = null;
  if (m) { try { tplId = decodeURIComponent(m[1]); } catch { tplId = m[1]; } }
  // Studio routes only change the URL (the app lives in the layout), so use the History API, which
  // Next's router follows. It applies synchronously and in order, unlike router.push, where a slower
  // server round-trip for /studio/edit/… could land after a later navigation back to the library.
  const navigate = useCallback((href: string, replace?: boolean) => {
    if (replace) history.replaceState(null, '', href); else history.pushState(null, '', href);
  }, []);
  return <Studio route={m ? 'edit' : 'library'} tplId={tplId} cat={params.get('cat')} navigate={navigate} />;
}
