import type { Metadata, Viewport } from 'next';
import { fontFaceCSS } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Treats Studio — Treats by MMA', template: '%s — Treats by MMA' },
  description: 'Brand studio for Treats by MMA: template library and editor, design system, brand playbook, voice guide and asset library.',
  icons: { icon: '/assets/ui/monogram-64.png' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  // Android Chrome: shrink the layout when the keyboard opens, so editor sheets stay above it.
  interactiveWidget: 'resizes-content',
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#FFFDF6' }, { media: '(prefers-color-scheme: dark)', color: '#2B140A' }],
};

/* Applies the saved theme (or the system setting) before first paint, so there is no flash. */
const THEME_BOOT = `(function(){try{var t=localStorage.getItem('tbm-theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','light')}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-NG" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
        <style dangerouslySetInnerHTML={{ __html: fontFaceCSS() }} />
        <link rel="preload" href="/fonts/caprasimo-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/figtree-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
