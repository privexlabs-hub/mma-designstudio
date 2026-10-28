/* Generates small interface copies of the large brand files into public/assets/ui/.
   The supplied originals are never modified; downloads, the canvas and exports keep using them.
   Run: npm run ui-images */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const root = path.dirname(path.dirname(new URL(import.meta.url).pathname));
const pub = (...p) => path.join(root, 'public', ...p);
fs.mkdirSync(pub('assets', 'ui'), { recursive: true });

// [source, output name, width px] — widths are 2× the largest on-screen size.
const JOBS = [
  ['assets/logo/treats-by-mma-logo.png', 'logo-768.webp', 768],   // home hero, design system logo, asset preview
  ['assets/logo/treats-by-mma-logo.png', 'logo-320.webp', 320],   // storefront nav, background/misuse tiles, clear-space
  ['assets/logo/proposed-cake-monogram.png', 'monogram-256.webp', 256], // design system monogram, asset preview
  ['assets/logo/proposed-cake-monogram.png', 'monogram-96.webp', 96],   // header mark
  ['assets/logo/proposed-cake-monogram.png', 'monogram-64.png', 64],    // favicon
  ['assets/reference/original-signage-flyer.png', 'flyer-768.webp', 768], // asset preview
];
for (const [src, out, w] of JOBS) {
  const img = sharp(pub(src)).resize({ width: w, withoutEnlargement: true });
  const file = pub('assets', 'ui', out);
  await (out.endsWith('.png') ? img.png({ compressionLevel: 9 }) : img.webp({ quality: 88 })).toFile(file);
  console.log(`${out}: ${Math.round(fs.statSync(file).size / 1024)} KB (from ${Math.round(fs.statSync(pub(src)).size / 1024)} KB)`);
}
