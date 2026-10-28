/* End-to-end checks with Playwright (Chromium).
   Usage: start the app (npm run build && npm start, or npm run dev), then
     BASE=http://localhost:3000 npm run e2e            # everything
     BASE=… npm run e2e -- responsive|studio|mobile    # one suite
   Screenshots and downloads are written to e2e/out/. */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE || 'http://localhost:3000';
const OUT = path.join(path.dirname(new URL(import.meta.url).pathname), 'out');
fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true }); fs.mkdirSync(path.join(OUT, 'downloads'), { recursive: true });
const only = process.argv[2];
let failures = 0, passes = 0;
const ok = (cond, msg) => { if (cond) { passes++; console.log('  ✓ ' + msg); } else { failures++; console.log('  ✗ ' + msg); } };
const watch = (page, errs) => { page.on('pageerror', (e) => errs.push('pageerror: ' + e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); }); };

async function responsive(browser) {
  console.log('\nResponsive sweep — no horizontal page overflow, no runtime errors');
  const routes = ['/', '/studio', '/studio?cat=documents', '/studio?cat=editorial', '/studio/edit/square%3Aannounce', '/studio/edit/doc%3Areport%3Acocoa', '/design-system', '/design-system/storefront', '/playbook', '/voice', '/assets'];
  const widths = [360, 390, 768, 1024, 1440];
  for (const theme of ['light', 'dark']) for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, colorScheme: theme, hasTouch: w < 800, isMobile: w < 800 });
    const page = await ctx.newPage(); const errs = []; watch(page, errs);
    for (const r of routes) {
      await page.goto(BASE + r, { waitUntil: 'networkidle' }); await page.waitForTimeout(600);
      const m = await page.evaluate(() => {
        const W = document.documentElement.clientWidth; const bad = [];
        for (const el of document.querySelectorAll('body *')) {
          const rc = el.getBoundingClientRect(); if (!rc.width || rc.right <= W + 1) continue;
          // Fixed-position layers (drawers, sheets) and hidden elements never widen the page.
          if (getComputedStyle(el).visibility === 'hidden') continue;
          let q = el.parentElement, clipped = false;
          while (q && q !== document.body) { const cs = getComputedStyle(q); if (cs.position === 'fixed') { clipped = true; break; } if (cs.overflowX !== 'visible' && q.getBoundingClientRect().right <= W + 1) { clipped = true; break; } q = q.parentElement; }
          if (!clipped && getComputedStyle(el).position !== 'fixed') bad.push((el.id ? '#' + el.id : el.tagName.toLowerCase()) + ' → ' + Math.round(rc.right));
        }
        return { sw: document.documentElement.scrollWidth, W, bad: bad.slice(0, 5), theme: document.documentElement.getAttribute('data-theme') };
      });
      ok(m.sw <= m.W && !m.bad.length, `${theme} ${w}px ${r} — scrollWidth ${m.sw}/${m.W}${m.bad.length ? ' overflow: ' + m.bad.join(', ') : ''}`);
      if (m.theme !== theme) ok(false, `${theme} ${w}px ${r} — data-theme is ${m.theme}`);
      await page.screenshot({ path: path.join(OUT, 'shots', `${theme}-${w}-${r.replace(/[^a-z0-9]+/gi, '_') || 'home'}.png`) });
    }
    ok(!errs.length, `${theme} ${w}px — no page errors${errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''}`);
    await ctx.close();
  }
}

async function download(page, click, re, label) {
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 180000 }), click()]);
  const name = dl.suggestedFilename(); const file = path.join(OUT, 'downloads', name); await dl.saveAs(file);
  const size = fs.statSync(file).size; ok(re.test(name) && size > 0, `${label}: ${name} (${size} bytes)`);
  return file;
}
const pagesCount = async (page) => +(await page.locator('text=/^Pages · \\d+$/').first().innerText()).split('·')[1].trim();

async function studio(browser) {
  console.log('\nStudio — desktop editing, persistence and every export');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const page = await ctx.newPage(); const errs = []; watch(page, errs);
  await page.goto(BASE + '/studio/edit/doc%3Areport%3Acream', { waitUntil: 'networkidle' });
  await page.waitForSelector('#canvas-scroll');
  ok(await page.getByRole('heading', { name: 'Export' }).count() === 0, 'editor opens');
  const n0 = await pagesCount(page); ok(n0 === 15, 'report has 15 pages (INVENTORY.md)');

  // select the cover title by clicking it on the canvas
  const first = page.locator('[id^="ab-"]').first();
  const titleId = await first.locator('[id^="el-"]', { hasText: '[Report title]' }).getAttribute('id');
  const title = page.locator('#' + titleId);
  await title.click();
  ok(await page.locator('aside[aria-label="Properties"]').getByText('Text', { exact: true }).count() > 0, 'clicking an element selects it');
  await page.fill('#insp-text', 'E2E report title');
  ok(await first.getByText('E2E report title').count() === 1, 'editing text updates the artboard');

  const posX = page.getByLabel('X', { exact: true }), posW = page.getByLabel('W', { exact: true });
  const x0 = +(await posX.inputValue()), w0 = +(await posW.inputValue());
  const hb = await title.locator('[data-sel]').last().boundingBox();
  await page.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2); await page.mouse.down(); await page.mouse.move(hb.x + hb.width / 2 - 40, hb.y + hb.height / 2 + 10, { steps: 6 }); await page.mouse.up();
  const w1 = +(await posW.inputValue()); ok(w1 < w0, `resize handle changes the width (w ${w0} → ${w1})`);
  const bb = await title.boundingBox();
  await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await page.mouse.down(); await page.mouse.move(bb.x + bb.width / 2 + 60, bb.y + bb.height / 2 + 20, { steps: 6 }); await page.mouse.up();
  const x1 = +(await posX.inputValue()); ok(x1 > x0, `drag moves the element (x ${x0} → ${x1})`);
  await page.getByRole('button', { name: 'Undo' }).click(); await title.click();
  ok(+(await posX.inputValue()) === x0 && +(await posW.inputValue()) === w1, 'undo reverts the drag');
  await page.getByRole('button', { name: 'Undo' }).click(); await title.click();
  ok(+(await posW.inputValue()) === w0, 'undo again reverts the resize');
  await page.getByRole('button', { name: 'Redo' }).click(); await page.getByRole('button', { name: 'Redo' }).click(); await title.click();
  ok(+(await posW.inputValue()) === w1 && +(await posX.inputValue()) === x1, 'redo re-applies both');
  await page.keyboard.press('ArrowRight'); ok(+(await posX.inputValue()) === x1 + 1, 'arrow key nudges 1px');
  await page.keyboard.press('Shift+ArrowRight'); ok(+(await posX.inputValue()) === x1 + 11, 'shift+arrow nudges 10px');

  // page management
  await page.getByRole('button', { name: 'Page settings' }).click();
  await page.getByRole('button', { name: '+ After' }).click(); ok(await pagesCount(page) === n0 + 1, 'add page after');
  await page.getByRole('button', { name: 'Duplicate page' }).click(); ok(await pagesCount(page) === n0 + 2, 'duplicate page');
  await page.getByRole('button', { name: 'Delete page' }).click(); ok(await pagesCount(page) === n0 + 1, 'delete page');
  await page.getByRole('button', { name: 'Move page up' }).click(); ok(await page.locator('aside [aria-current="page"]').innerText().then((t) => t.startsWith('2')), 'move page up');
  await page.keyboard.press('Control+z'); await page.keyboard.press('Control+z'); ok(await pagesCount(page) === n0 + 2, 'ctrl+z undoes move + delete');
  await page.keyboard.press('Control+z'); await page.keyboard.press('Control+z'); ok(await pagesCount(page) === n0, 'ctrl+z undoes duplicate + add');
  await page.keyboard.press('Control+Shift+z'); ok(await pagesCount(page) === n0 + 1, 'ctrl+shift+z redoes');
  await page.keyboard.press('Control+z'); ok(await pagesCount(page) === n0, 'back to the original page count');

  // overflow → flow to new page (Executive summary body)
  await page.getByRole('button', { name: /^3\s*Executive summary/ }).click();
  const body = page.locator('#' + await page.locator('[id^="pw-"]').nth(2).locator('[id^="el-"]', { hasText: '[The headline findings' }).getAttribute('id'));
  await body.click();
  await page.fill('#insp-text', Array.from({ length: 14 }, (_, i) => 'Paragraph ' + (i + 1) + '. Soft crumb, golden crust, made with care for every celebration and every ordinary craving.').join('\n\n'));
  await page.waitForSelector('text=Text is overflowing this box.', { timeout: 5000 }).catch(() => {});
  ok(await page.getByText('Text is overflowing this box.').count() === 1, 'overflow warning appears');
  const nb = await pagesCount(page);
  await page.getByRole('button', { name: 'Flow overflow to new page' }).click();
  ok(await pagesCount(page) === nb + 1, 'flow overflow creates a continuation page');

  // contents page
  await page.getByRole('button', { name: 'Page settings' }).click();
  await page.getByRole('button', { name: 'Update contents page' }).click();
  ok(await page.getByText('Contents updated from pages marked “In contents”.').count() === 1, 'update contents page');

  // size switch keeps content
  await page.getByLabel('Size / aspect ratio').selectOption('letter');
  ok(await page.locator('[id^="ab-"]').first().getByText('E2E report title').count() === 1, 'switching to US Letter keeps edited text');

  // persistence
  await page.waitForTimeout(600); await page.reload({ waitUntil: 'networkidle' }); await page.waitForSelector('#canvas-scroll');
  ok(await page.locator('[id^="ab-"]').first().getByText('E2E report title').count() === 1, 'edits persist after reload');
  ok(await page.getByLabel('Size / aspect ratio').inputValue() === 'letter', 'size persists after reload');

  // exports — every format offered for a document
  const re = (ext, extra = '') => new RegExp('^treats-by-mma_report-cream-edition' + extra + '_816x1056\\.' + ext + '$');
  const ex = async (label, sub, rx) => { await page.getByRole('button', { name: 'Export', exact: true }).click(); const dlg = page.getByRole('dialog', { name: 'Export' }); await download(page, () => dlg.getByRole('button', { name: new RegExp('^' + label + '\\s*' + sub) }).click(), rx, label + ' — ' + sub); await page.waitForSelector('[role="status"]:has-text("download started")', { timeout: 180000 }).catch(() => {}); await page.waitForTimeout(300); };
  await ex('PNG', 'Page', re('png', '_p01'));
  await ex('JPG', 'Page', re('jpg', '_p01'));
  await ex('SVG', 'Page', re('svg', '_p01'));
  await ex('PDF', 'Page 1 only', /^treats-by-mma_report-cream-edition-p1_816x1056\.pdf$/);
  await ex('PDF', 'Multi-page', re('pdf'));
  await ex('PNG \\(ZIP\\)', 'One file', re('zip', '_pages'));
  await ex('JPG \\(ZIP\\)', 'One file', re('zip', '_pages'));
  await ex('PPTX', 'Editable', re('pptx'));
  await ex('DOCX', 'Word', re('docx'));
  await ex('EPUB', 'Reflowable', re('epub'));
  await ex('HTML', 'Layout', re('html'));
  await ex('Markdown', 'Headings', re('md'));
  await ex('Plain text', 'Copy', re('txt'));
  const json = await (async () => { await page.getByRole('button', { name: 'Export', exact: true }).click(); return download(page, () => page.getByRole('dialog', { name: 'Export' }).getByRole('button', { name: /^Project file/ }).click(), re('json', '_project'), 'Project file — JSON'); })();
  const md = fs.readFileSync(path.join(OUT, 'downloads', 'treats-by-mma_report-cream-edition_816x1056.md'), 'utf8');
  ok(md.includes('# E2E report title'), 'Markdown export reflects the current edits');
  const proj = JSON.parse(fs.readFileSync(json, 'utf8')); ok(proj.tpl === 'doc:report:cream' && proj.formatId === 'letter', 'project file holds the edited document');

  // reset, then import the project file back
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Reset template to original' }).click();
  ok(await page.locator('[id^="ab-"]').first().getByText('[Report title]').count() === 1, 'reset template restores the original');
  await page.getByRole('button', { name: 'Templates' }).click(); await page.waitForSelector('text=Pick a template, make it yours');
  await page.setInputFiles('#import-in', json); await page.waitForSelector('#canvas-scroll');
  ok(await page.locator('[id^="ab-"]').first().getByText('E2E report title').count() === 1, 'opening a project file restores the edits');

  // regression: a quick switch back to the library must win, even on a slow device
  { const cdp = await ctx.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 }); let bad = 0;
    for (let i = 0; i < 6; i++) {
      await page.goto(BASE + '/studio', { waitUntil: 'networkidle' }); await page.setInputFiles('#import-in', json); await page.waitForSelector('#canvas-scroll');
      await page.getByRole('button', { name: 'Templates' }).click(); await page.waitForTimeout(1500);
      if (!(await page.getByText('Pick a template, make it yours').count()) || new URL(page.url()).pathname !== '/studio') bad++;
    }
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 }); ok(!bad, 'open project → Templates always lands on the library (6× CPU throttle, 6 runs)'); }
  // browser history inside the studio
  await page.goto(BASE + '/studio?cat=documents', { waitUntil: 'networkidle' });
  await page.locator('[data-tpl="doc:report:cream"] button').first().click(); await page.waitForSelector('#canvas-scroll');
  ok((await page.title()).startsWith('Editing Report'), 'editor sets the tab title');
  await page.goBack(); await page.waitForTimeout(800); ok(await page.getByText('Pick a template, make it yours').count() === 1 && page.url().endsWith('?cat=documents'), 'browser Back returns to the library category');
  await page.goForward(); await page.waitForTimeout(800); ok(await page.locator('#canvas-scroll').count() === 1, 'browser Forward returns to the editor');

  // library: search, bulk ZIP, article banner generator
  await page.goto(BASE + '/studio', { waitUntil: 'networkidle' }); await page.waitForSelector('text=Pick a template, make it yours');
  await page.fill('input[type="search"]', 'leaderboard');
  ok(await page.getByText(/^4 templates matching/).count() === 1, 'search finds the 4 leaderboard ads');
  await page.fill('input[type="search"]', '');
  await page.getByRole('button', { name: 'Select for bulk export' }).click();
  await page.getByRole('checkbox', { name: /Announcement — Square post/ }).check();
  await page.getByRole('checkbox', { name: /Product spotlight — Square post/ }).check();
  await download(page, () => page.getByRole('button', { name: 'PNG', exact: true }).click(), /^treats-by-mma_templates_\d{4}-\d{2}-\d{2}\.zip$/, 'Bulk export ZIP (PNG)');
  await page.waitForTimeout(500);
  await download(page, () => page.getByRole('button', { name: 'PDF', exact: true }).click(), /^treats-by-mma_templates_\d{4}-\d{2}-\d{2}\.zip$/, 'Bulk export ZIP (PDF)');
  await page.getByRole('button', { name: 'Done selecting' }).click();
  await page.getByRole('tab', { name: /Article & editorial/ }).click();
  await page.getByLabel('Article title').fill('How to store your celebration cake');
  await download(page, () => page.getByRole('button', { name: 'Download all (ZIP)' }).click(), /^treats-by-mma_templates_.*\.zip$/, 'Article banner generator ZIP');
  ok(await page.getByText('Edited', { exact: true }).count() >= 6, 'generated banners are marked Edited');

  ok(!errs.filter((e) => !/Failed to load resource/.test(e)).length, 'no runtime errors' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
  await ctx.close();
}

async function mobile(browser) {
  console.log('\nMobile — 390px touch editing');
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage(); const errs = []; watch(page, errs);
  await page.goto(BASE + '/studio/edit/square%3Aannounce', { waitUntil: 'networkidle' }); await page.waitForSelector('#canvas-scroll');
  const tab = (n) => page.getByRole('navigation', { name: 'Editor' }).getByRole('button', { name: n });
  await tab('Edit').tap(); ok(await page.locator('aside[aria-label="Properties"]').isVisible(), 'Edit tab opens the properties sheet');
  await tab('Pages').tap(); ok(await page.locator('aside[aria-label="Pages and layers"]').isVisible() && !(await page.locator('aside[aria-label="Properties"]').count()), 'Pages tab swaps to the pages sheet');
  await tab('Canvas').tap(); ok(!(await page.locator('aside').count()), 'Canvas tab closes sheets');
  await tab('Export').tap(); ok(await page.getByRole('dialog', { name: 'Export' }).isVisible(), 'Export tab opens the export sheet');
  const dbox = await page.getByRole('dialog', { name: 'Export' }).boundingBox(); ok(dbox.width === 390 && Math.round(dbox.y + dbox.height) === 844, 'export dialog is a full-width bottom sheet');
  await page.getByRole('button', { name: 'Close' }).tap();

  const el = page.locator('[id^="ab-"]').first().locator('[id^="el-"]', { hasText: 'Something sweet' });
  const b = await el.boundingBox(); await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2);
  ok(await page.locator('[data-sel]').count() > 0, 'tapping an element selects it');
  // touch drag via real touch events (pointerType: touch)
  const cdp = await ctx.newCDPSession(page); const sx = b.x + b.width / 2, sy = b.y + b.height / 2;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: sx, y: sy }] });
  for (let i = 1; i <= 8; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: sx + i * 5, y: sy + i * 4 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  const b2 = await el.boundingBox(); ok(b2.x > b.x + 20 && b2.y > b.y + 15, `touch drag moves the element (${Math.round(b.x)},${Math.round(b.y)} → ${Math.round(b2.x)},${Math.round(b2.y)})`);
  ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal page scroll while editing');
  const tb = await page.getByRole('navigation', { name: 'Editor' }).boundingBox(); ok(tb && Math.round(tb.y + tb.height) === 844, 'tab bar pinned to the bottom');
  const sizes = await page.locator('nav[aria-label="Editor"] button').evaluateAll((bs) => bs.map((x) => [x.offsetWidth, x.offsetHeight]));
  ok(sizes.every(([w, h]) => w >= 44 && h >= 44), 'tab bar targets are ≥44px');

  await page.goto(BASE + '/studio', { waitUntil: 'networkidle' });
  const cards = await page.locator('[data-tpl]').evaluateAll((c) => c.slice(0, 2).map((x) => x.getBoundingClientRect().width));
  ok(cards.length === 2 && cards.every((w) => w > 150 && w < 190), 'library shows two cards per row on a phone');
  await page.getByRole('button', { name: 'Open menu', exact: true }).tap(); ok(await page.getByRole('dialog').getByRole('link', { name: /Design System/ }).isVisible(), 'menu drawer lists the sections');
  await page.getByRole('dialog').getByRole('link', { name: /Design System/ }).tap(); await page.waitForURL('**/design-system');
  ok(await page.getByRole('navigation', { name: 'On this page' }).isVisible(), 'section chip bar visible on the design system page');
  ok(!errs.length, 'no runtime errors' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
  await ctx.close();
}

const browser = await chromium.launch();
try {
  if (!only || only === 'responsive') await responsive(browser);
  if (!only || only === 'studio') await studio(browser);
  if (!only || only === 'mobile') await mobile(browser);
} catch (e) { failures++; console.error('\n✗ aborted:', e.message); }
await browser.close();
console.log(`\n${passes} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
