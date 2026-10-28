/* Copies self-hosted static files out of node_modules into public/ (runs on postinstall):
   - Lucide 0.460.0 icon SVGs (the design system's icon set) → public/icons
   - Caprasimo + Figtree woff2 (latin + latin-ext) → public/fonts */
import fs from 'node:fs';
import path from 'node:path';

const root = path.dirname(path.dirname(new URL(import.meta.url).pathname));
const nm = (...p) => path.join(root, 'node_modules', ...p);
const pub = (...p) => path.join(root, 'public', ...p);

fs.mkdirSync(pub('icons'), { recursive: true });
const icons = fs.readdirSync(nm('lucide-static', 'icons')).filter((f) => f.endsWith('.svg'));
for (const f of icons) fs.copyFileSync(nm('lucide-static', 'icons', f), pub('icons', f));

fs.mkdirSync(pub('fonts'), { recursive: true });
const fonts = [['caprasimo', ['400-normal']], ['figtree', ['400-normal', '500-normal', '600-normal', '700-normal', '800-normal', '400-italic', '500-italic', '600-italic', '700-italic', '800-italic']]];
let n = 0;
for (const [fam, styles] of fonts) for (const st of styles) for (const sub of ['latin', 'latin-ext']) {
  const f = `${fam}-${sub}-${st}.woff2`; fs.copyFileSync(nm('@fontsource', fam, 'files', f), pub('fonts', f)); n++;
}
console.log(`sync-static: ${icons.length} icons, ${n} font files`);
