# Treats by MMA — brand studio

Next.js 15 + TypeScript build of the Claude Design project “Treats Studio” (`Treats Studio.dc.html` + design system), plus the four pages the prototype listed as next phase.

| Route | What it is |
|---|---|
| `/` | Hub |
| `/studio` (`?cat=…`) | Template library: 202 templates in 8 categories, search, bulk ZIP export, article banner generator |
| `/studio/edit/<template id>` | Editor: pages, layers, canvas, inspector, undo/redo, all exports |
| `/design-system` | Design system in 12 sections, with all 21 components live |
| `/design-system/storefront` | Storefront UI kit (home → menu → product → cake request → order bag) |
| `/playbook` | Brand playbook, with a tickable quality checklist |
| `/voice` | Brand voice & knowledge, with copy buttons |
| `/assets` | Asset library: logo, monogram, photos, flyer, token files |

## Run it

```bash
npm install          # also copies Lucide icons + webfonts into public/ (postinstall)
npm run dev          # http://localhost:3000
npm run build && npm start
```

Node 20+. Everything runs in the browser and no backend is needed. Edits save to `localStorage` (`tbm-studio:v1`), the same key and format as the prototype, so its project files still open.

## Checks

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # includes the design-system import rule from _adherence.oxlintrc.json
npm test             # Vitest: 202 templates + every relayout compared with the original studio-lib.js
BASE=http://localhost:3000 npm run e2e   # Playwright: responsive sweep, desktop studio + all exports, mobile touch
```

`npm run e2e` needs a running server. It covers 11 routes × 360/390/768/1024/1440 px × light/dark for page overflow and runtime errors; editing, persistence, undo/redo and page operations; all 14 export formats plus bulk ZIP and the banner generator; and touch editing at 390 px. Output goes to `e2e/out/`.

## Layout

```
src/lib/studio/      template engine (port of studio-lib.js): types, brand, engine, data, registry
src/lib/export/      exporters (port of studio-export.js): PNG/JPG/SVG/PDF/PPTX/DOCX/EPUB/HTML/MD/TXT/JSON/ZIP
src/lib/fonts.ts     self-hosted @font-face rules (used by the app and font embedding in exports)
src/ds/              design system: tokens (verbatim), 21 components, storefront UI kit — import from '@/ds'
src/features/studio/ the studio app (Studio class = the prototype's component, Artboard, Library, Editor, ExportDialog)
src/features/design-system/, src/features/brand/   page sections
src/content/brand.ts brand copy, taken from the design-system readme
reference/prototype/ the original Claude Design files, kept for parity tests
```

## Differences from the prototype (deliberate)

- **Stack and routing.** The prototype's hash routes (`#/library/…`, `#/edit/…`) became `/studio?cat=…` and `/studio/edit/<id>`. The studio stays mounted in the `/studio` layout, so the open document and undo history survive switching between library and editor, as before.
- **Works offline after first load.** html-to-image, jsPDF, PptxGenJS and JSZip are npm dependencies at the prototype's exact versions, loaded on demand instead of from CDNs. Caprasimo and Figtree are self-hosted. Lucide 0.460.0 icons are self-hosted. The HTML export embeds its fonts instead of linking Google Fonts.
- **₦ renders in Figtree.** The prototype loaded only the Latin font subset, which has no naira sign. Latin-ext is included here.
- **Chart icon.** `bar-chart-3` does not exist in Lucide 0.460.0, so it was blank in the prototype too. It is now `chart-column`.
- **Theme.** It follows the system setting until the user chooses, as the prototype README describes. The prototype saved the theme on first load.
- **Inputs.** Hex colour fields apply on blur or Enter instead of on every keystroke. Number fields keep what you type while focused, so you can clear and retype. Pending edits are saved when the page is hidden.
- **Unknown template URLs** show a message and return to the library.
- **Mobile and tablet.** These build on the prototype's layout below 900 px (bottom sheets and a tab bar):
  - A floating canvas toolbar holds undo, redo, zoom and preview.
  - The export dialog becomes a bottom sheet on phones.
  - The library shows two cards per row on phones, with horizontally scrolling category tabs.
  - Site navigation moves into a menu drawer.
  - Safe-area insets are respected, and touch targets are at least 44 px. The resize handle has a larger touch area.
  - Escape closes an open sheet.
- **Storefront kit.** Its `index.html` shell was not in the supplied files. A minimal shell wires the supplied pages together and adds no new copy or data. The kit's desktop-only grids collapse on narrow screens (container queries).
- **Design-system components** are typed ports of `_ds_bundle.js`, with three small changes: `AnnouncementBanner` wraps on narrow screens, `Checkbox` contains its hidden input, and `Button` accepts `download`.

## The 12 design-system sections

No specification of the 12 sections was supplied. They are organised from the design-system readme (§1–8) and the manifest's card groups:

1. Logo & monogram
2. Colour
3. Typography
4. Spacing & grid
5. Shape & elevation
6. Motifs
7. Iconography
8. Photography
9. Components
10. Product categories
11. Packaging & social
12. Motion & accessibility

The manifest's guideline-card HTML, packaging mock-ups and cake-layer band artwork were not in the export, so those items are described rather than drawn.

## Limitations (carried over — still true)

- **Low-resolution photos.** The photos are 300 px concept crops from the flyer and look soft at 1080 px and larger. Replace them with real photography.
- **Raster logo.** The logo is raster with a cream ground baked in. Ask the owner for vector files.
- **Export formats:**
  - PDF pages are images, so the text is not selectable.
  - SVG wraps HTML inside the SVG, so some tools can't edit it.
  - DOCX and EPUB keep text and structure but not the exact layout.
  - PPTX approximates photo scrims.
- **Storage limits.** Browser storage holds about 5 MB, and uploaded images count towards it. Export a project file (JSON) to keep large work safe.
- **Brand details still needed.** Every `[to confirm]` placeholder needs real information: prices, lead times, delivery areas, founder story, reviews and statistics. Nothing was invented. Contact details come from the supplied flyer and need confirming before publishing.
