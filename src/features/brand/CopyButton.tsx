'use client';
import { useState } from 'react';
import { Icon } from '@/ds';
import p from '@/components/page.module.css';

/** Copies text to the clipboard (falls back to a hidden textarea where the Clipboard API is blocked). */
export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } finally { t.remove(); }
    }
    setDone(true); setTimeout(() => setDone(false), 1600);
  };
  return <button type="button" className={`${p.btn} ${p.btnSm}`} onClick={copy} aria-label={done ? 'Copied' : label + ': ' + text.slice(0, 40)} style={{ padding: '0 12px', fontSize: 13 }}><Icon name={done ? 'check' : 'copy'} size={14} />{done ? 'Copied' : label}</button>;
}
