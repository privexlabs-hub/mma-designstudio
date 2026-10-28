'use client';
import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
const KEY = 'tbm-theme';

const stored = (): Theme | null => { try { const t = localStorage.getItem(KEY); return t === 'light' || t === 'dark' ? t : null; } catch { return null; } };
const system = (): Theme => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

/** Light/dark theme. Follows the system setting until the user chooses, then remembers the choice. */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>('light');
  useEffect(() => {
    const apply = (t: Theme) => { document.documentElement.setAttribute('data-theme', t); setTheme(t); };
    apply(stored() || system());
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const onSys = () => { if (!stored()) apply(system()); };
    const onStore = (e: StorageEvent) => { if (e.key === KEY) apply(stored() || system()); };
    mq.addEventListener('change', onSys); addEventListener('storage', onStore);
    return () => { mq.removeEventListener('change', onSys); removeEventListener('storage', onStore); };
  }, []);
  const toggle = useCallback(() => {
    const t: Theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t); setTheme(t);
    try { localStorage.setItem(KEY, t); } catch { /* storage unavailable: the choice lasts for this page */ }
  }, []);
  return [theme, toggle];
}
