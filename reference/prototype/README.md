# Treats by MMA Studio

Runs in the browser with no backend. Open **`Treats Studio.dc.html`**.

## Files
- `Treats Studio.dc.html`: template library, editor, page manager, exports, themes
- `Artboard.dc.html`: shared renderer used by the canvas, thumbnails and exports
- `studio-lib.js`: brand tokens, layout engine, template registry and document types. Template definitions live here, separate from your edits.
- `studio-export.js`: PNG, JPG, SVG, PDF, PPTX, DOCX, EPUB, HTML, Markdown, TXT, ZIP and JSON export
- `assets/`: official logo, provisional monogram, concept photos and the reference flyer
- `docs/INVENTORY.md`: the full template list, generated from the registry

## Using it
- **Library:** browse by category or search. Click a template to edit it. Select several with "Select for bulk export" to download them as one ZIP (PNG, JPG or PDF).
- **Article banner generator** (Article & editorial tab): enter a title and subtitle, pick a layout and channels, then open them or download a ZIP.
- **Editor:**
  - Left panel: pages. Click a page to centre it on the canvas, drag to reorder, and use the buttons to duplicate or delete. Below the pages is the layer list.
  - Centre: the canvas. Drag to move an element; drag the corner handle to resize.
  - Right panel: all properties. With nothing selected, it shows page and document settings: size, page numbers, update contents, reset.
- **Shortcuts:** Ctrl/⌘+Z undo · Shift+Ctrl/⌘+Z redo · Delete · Ctrl/⌘+D duplicate · arrow keys nudge (Shift = 10 px) · PageUp/PageDown change page · Esc deselect
- **Saving:** edits save automatically to this browser. Use Export → Project file (JSON) to back up or move your work, and "Open project file" to load it again.
- **Theme:** the header button switches light and dark. It follows your system setting until you choose.

## Requirement checklist (this phase)
- [x] Template library: 202 templates across 8 categories (see `docs/INVENTORY.md`)
- [x] Visual editor: text, typography, colour, background, images (brand photos or upload), shapes, logo, ribbon, table, chart, contents, page number; add, duplicate, delete, layer order, move, resize
- [x] Size and aspect-ratio switching that keeps your content; reset to original
- [x] Multi-page management for every type (add before/after, duplicate, delete, drag to reorder) plus "Flow overflow to new page"
- [x] Ebook structure: front matter, parts, chapters, body, back matter; generated contents page; page numbering with a start number
- [x] Exports reflect your current edits; bulk ZIP export; filenames follow `treats-by-mma_<name>_<w>x<h>`
- [x] Light and dark mode; tablet layout; mobile bottom sheets and tab bar

## Not yet built (next phase)
Design System (12 sections), Brand Playbook, Brand Voice & Knowledge page and the Asset Library page.

## Limitations
- **Not Next.js.** You asked for a working prototype here, so this was not built as a Next.js/TypeScript app. The libraries can be ported into one.
- **Internet needed for exports.** The export libraries (html-to-image, jsPDF, PptxGenJS, JSZip), Google Fonts and the Lucide icons load from CDNs.
- **Low-resolution photos.** The photos are 300 px concept crops from the flyer, so they look soft at 1080 px and larger. Replace them with real photography.
- **Raster logo.** The logo is raster with a cream ground baked in, so it always sits on a cream tile. Ask the owner for vector files.
- **Format notes:**
  - PDF pages are images (not selectable text).
  - SVG wraps HTML inside the SVG, so some tools can't edit it.
  - DOCX and EPUB keep text, headings, lists, tables and images, but not the exact page layout.
  - PPTX uses native text boxes, shapes, tables and charts. Photo scrims are approximated.
- **Storage limits.** Browser storage holds about 5 MB. Uploaded images count towards this. Export a project file to keep large work safe.
- **Brand details still needed.** Every `[to confirm]` placeholder needs real information: prices, lead times, delivery areas, founder story, reviews and statistics. Nothing was invented.
