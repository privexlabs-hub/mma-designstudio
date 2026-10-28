/* Self-hosted brand webfonts (files copied to /public/fonts by scripts/sync-static.mjs).
   Single source for the app's @font-face rules and for font embedding in exports. */

const RANGES = {
  latin: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
  'latin-ext': 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF',
} as const;

export interface FontFace { family: string; weight: number; style: 'normal' | 'italic'; url: string; range: string }

const faces: FontFace[] = [];
const add = (fam: string, family: string, weight: number, style: 'normal' | 'italic') => {
  for (const sub of ['latin', 'latin-ext'] as const) faces.push({ family, weight, style, url: `/fonts/${fam}-${sub}-${weight}-${style}.woff2`, range: RANGES[sub] });
};
add('caprasimo', 'Caprasimo', 400, 'normal');
for (const w of [400, 500, 600, 700, 800]) { add('figtree', 'Figtree', w, 'normal'); add('figtree', 'Figtree', w, 'italic'); }
export const FONT_FACES: readonly FontFace[] = faces;

export const fontFaceRule = (f: FontFace, src: string = f.url): string =>
  `@font-face{font-family:'${f.family}';font-style:${f.style};font-weight:${f.weight};font-display:swap;src:url(${src}) format('woff2');unicode-range:${f.range}}`;

export const fontFaceCSS = (): string => FONT_FACES.map((f) => fontFaceRule(f)).join('\n');
