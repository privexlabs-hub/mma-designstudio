/* Phone-first checks on real device profiles (Playwright's iPhone / Galaxy / Pixel descriptors:
   viewport, user agent, touch, pixel ratio). Runs in Chromium; WebKit runs too when installed
   (needs `sudo npx playwright install-deps webkit`).
     BASE=http://localhost:3000 node e2e/devices.mjs [layout|edit|export|sweep] [--webkit]
   Output: e2e/out/devices/ */
import { chromium, webkit, devices } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE || 'http://localhost:3000';
const OUT = path.join(path.dirname(new URL(import.meta.url).pathname), 'out', 'devices');
fs.mkdirSync(OUT, { recursive: true });
const only = process.argv.find((a) => /^(layout|edit|export|sweep)$/.test(a));
const engines = process.argv.includes('--webkit') ? [['webkit', webkit]] : [['chromium', chromium]];
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; if (process.env.VERBOSE) console.log('  ✓ ' + m); } else { fail++; console.log('  ✗ ' + m); } };
const PHONES = ['iPhone SE', 'iPhone 15', 'iPhone 15 Pro Max', 'Galaxy S9+', 'Galaxy S24', 'Pixel 7', 'Galaxy A55'];
const profile = (name) => { const d = { ...devices[name] }; delete d.defaultBrowserType; return d; };
const ROUTES = ['/', '/studio', '/studio?cat=celebrations', '/studio/edit/square%3Aannounce', '/studio/edit/doc%3Areport%3Acream', '/studio/edit/tiktok%3Aeidfitr', '/design-system', '/design-system/storefront', '/playbook', '/voice', '/assets'];

/** Audit: page overflow, fields ≥16px (no iOS zoom), interactive targets ≥44px. */
async function audit(page) {
  return page.evaluate(() => {
    const W = document.documentElement.clientWidth, H = innerHeight, small = [], fonts = [], over = [];
    const visible = (el) => { const r = el.getBoundingClientRect(); if (!r.width || !r.height) return false; const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') return false; let q = el; while (q) { if (getComputedStyle(q).visibility === 'hidden') return false; q = q.parentElement; } return r.bottom > 0 && r.top < H * 3; };
    const name = (el) => (el.getAttribute('aria-label') || el.textContent || el.getAttribute('placeholder') || el.tagName).trim().slice(0, 40);
    for (const el of document.querySelectorAll('button, a[href], input, select, textarea, [role="tab"]')) {
      if (!visible(el) || el.closest('[id^="ab-"],[id^="th-"],[id^="ds-"],[id^="off-"]') || el.classList.contains('sr-only') || el.closest('.sr-only')) continue;
      const r = el.getBoundingClientRect();
      if (/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName) && el.type !== 'checkbox' && el.type !== 'range' && el.type !== 'file') { const fs = parseFloat(getComputedStyle(el).fontSize); if (fs < 16) fonts.push(name(el) + ' ' + fs + 'px'); }
      let box = r; if (el.type === 'checkbox') { const lab = el.closest('label'); if (lab) box = lab.getBoundingClientRect(); }
      const min = /swatch/.test(el.className) ? 40 : 44; // swatches: 40px + 2px pseudo-element hit area
      if (Math.min(box.width, box.height) < min - 0.5) small.push(name(el) + ' ' + Math.round(box.width) + '×' + Math.round(box.height));
    }
    if (document.documentElement.scrollWidth > W) over.push('scrollWidth ' + document.documentElement.scrollWidth + '>' + W);
    return { small, fonts, over };
  });
}

async function layout(browser, eng) {
  console.log(`\n[${eng}] Layout, 16px fields and 44px targets on ${PHONES.length} phones + landscape`);
  for (const dev of [...PHONES, 'iPhone SE landscape', 'iPhone 15 landscape']) {
    const ctx = await browser.newContext(profile(dev)); const page = await ctx.newPage(); const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    for (const r of ROUTES) {
      await page.goto(BASE + r, { waitUntil: 'networkidle' }); await page.waitForTimeout(500);
      const a = await audit(page);
      ok(!a.over.length, `${dev} ${r} no horizontal scroll ${a.over.join(' ')}`);
      ok(!a.fonts.length, `${dev} ${r} fields ≥16px ${a.fonts.slice(0, 4).join(', ')}`);
      ok(!a.small.length, `${dev} ${r} targets ≥44px ${a.small.slice(0, 6).join(', ')}`);
      if (r.startsWith('/studio/edit')) {
        // open both sheets and audit what's inside them too
        for (const tab of ['Edit', 'Pages']) {
          await page.getByRole('navigation', { name: 'Editor' }).getByRole('button', { name: tab }).tap(); await page.waitForTimeout(300);
          const b = await audit(page);
          ok(!b.fonts.length && !b.small.length && !b.over.length, `${dev} ${r} ${tab} sheet ${[...b.fonts, ...b.small, ...b.over].slice(0, 6).join(', ')}`);
        }
        await page.getByRole('navigation', { name: 'Editor' }).getByRole('button', { name: 'Export' }).tap(); await page.waitForTimeout(300);
        const c = await audit(page); ok(!c.fonts.length && !c.small.length, `${dev} ${r} Export sheet ${[...c.fonts, ...c.small].slice(0, 6).join(', ')}`);
        await page.getByRole('dialog', { name: 'Export' }).getByRole('button', { name: 'Close' }).tap();
      }
      await page.screenshot({ path: path.join(OUT, `${eng}-${dev.replace(/\W+/g, '_')}-${r.replace(/[^a-z0-9]+/gi, '_') || 'home'}.png`) });
    }
    ok(!errs.length, `${dev} no page errors ${errs.slice(0, 2).join(' | ')}`);
    await ctx.close();
  }
}

const touchDrag = async (cdp, x, y, dx, dy, steps = 8) => {
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  for (let i = 1; i <= steps; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * i / steps, y: y + dy * i / steps }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
};

async function edit(browser, eng) {
  console.log(`\n[${eng}] Phone editing (touch)`);
  for (const dev of ['iPhone SE', 'Galaxy S24', 'iPhone 15 Pro Max']) {
    const ctx = await browser.newContext(profile(dev)); const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    const cdp = eng === 'chromium' ? await ctx.newCDPSession(page) : null;
    await page.goto(BASE + '/studio/edit/igpost%3Aannounce', { waitUntil: 'networkidle' }); await page.waitForSelector('#canvas-scroll');
    const tabs = page.getByRole('navigation', { name: 'Editor' });
    const title = page.locator('#' + await page.locator('[id^="ab-"] [id^="el-"]', { hasText: 'Something sweet' }).first().getAttribute('id'));
    let b = await title.boundingBox(); await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2);
    ok(await page.getByRole('toolbar', { name: 'Selected element' }).isVisible(), `${dev} tap selects and shows the selection bar`);
    if (cdp) {
      await page.waitForTimeout(700); // longer than a double-tap, which (correctly) opens the edit sheet
      await touchDrag(cdp, b.x + b.width / 2, b.y + b.height / 2, 3, 2, 3); await page.waitForTimeout(700);
      const b1 = await title.boundingBox(); ok(Math.abs(b1.x - b.x) < 1 && Math.abs(b1.y - b.y) < 1, `${dev} a small finger jitter does not move the element`);
      b = await title.boundingBox(); await touchDrag(cdp, b.x + b.width / 2, b.y + b.height / 2, 40, 30); await page.waitForTimeout(200);
      const b2 = await title.boundingBox(); ok(b2.x > b.x + 20 && b2.y > b.y + 15, `${dev} touch drag moves the element`);
      await page.waitForTimeout(700);
      // pinch zoom: two fingers apart
      const sc = await page.locator('#canvas-scroll').boundingBox(); const cx = sc.x + sc.width / 2, cy = sc.y + sc.height / 2;
      const z0 = await page.getByLabel('Zoom').inputValue();
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: cx - 30, y: cy, id: 1 }, { x: cx + 30, y: cy, id: 2 }] });
      for (let i = 1; i <= 6; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: cx - 30 - i * 12, y: cy, id: 1 }, { x: cx + 30 + i * 12, y: cy, id: 2 }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await page.waitForTimeout(200);
      const z1 = await page.getByLabel('Zoom').inputValue(); ok(z0 === 'fit' && z1 !== 'fit' && +z1 > 0, `${dev} pinch zooms the canvas (${z0} → ${z1})`);
      await page.getByLabel('Zoom').selectOption('fit'); await page.waitForTimeout(700);
      b = await title.boundingBox(); await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(300);
    }
    await page.getByRole('toolbar', { name: 'Selected element' }).getByRole('button', { name: 'Edit text' }).tap();
    ok(await page.evaluate(() => document.activeElement?.id) === 'insp-text', `${dev} Edit text opens the sheet with the text field focused`);
    await page.fill('#insp-text', 'Phone edit works');
    ok(await page.locator('[id^="ab-"]').first().getByText('Phone edit works').count() === 1, `${dev} typing updates the design`);
    await page.waitForTimeout(900); // the canvas scrolls the selected element into the visible area
    const vis = await page.evaluate((id) => { const e = document.getElementById(id); const sh = document.querySelector('[data-sheet]'); if (!e || !sh) return false; const r = e.getBoundingClientRect(), t = sh.getBoundingClientRect().top; return r.top >= 0 && r.top + Math.min(r.height, 40) <= t; }, await title.getAttribute('id'));
    ok(vis, `${dev} the edited element stays visible above the sheet`);
    const w0 = +(await page.getByLabel('W', { exact: true }).inputValue()); await page.getByRole('button', { name: 'Increase W' }).tap();
    ok(+(await page.getByLabel('W', { exact: true }).inputValue()) === w0 + 5, `${dev} + stepper nudges the width`);
    const s0 = +(await page.getByLabel('Size', { exact: true }).inputValue()); await page.getByRole('button', { name: 'Decrease Size' }).tap();
    ok(+(await page.getByLabel('Size', { exact: true }).inputValue()) === s0 - 2, `${dev} − stepper shrinks the font`);
    await page.getByRole('button', { name: '#E8358F' }).first().tap();
    ok(await page.getByLabel('Text colour hex value').inputValue() === '#E8358F', `${dev} colour swatch applies`);
    ok(await page.getByLabel('X', { exact: true }).getAttribute('inputmode') === null, `${dev} X field keyboard can type a minus sign`);
    const handle = page.locator('[data-sheet] button[aria-label="Expand panel"]'); await handle.tap();
    ok(await page.locator('[data-sheet] button[aria-label="Shrink panel"]').count() === 1, `${dev} sheet handle expands the panel`);
    await page.locator('[data-sheet] button[aria-label="Shrink panel"]').tap(); await page.waitForTimeout(450);
    if (cdp) { const hb = await page.locator('[data-sheet] button[aria-label="Expand panel"]').boundingBox(); await touchDrag(cdp, hb.x + hb.width / 2, hb.y + hb.height / 2, 0, 120); await page.waitForTimeout(200); ok(!(await page.locator('[data-sheet]').count()), `${dev} swiping the handle down closes the sheet`); }
    else await tabs.getByRole('button', { name: 'Canvas' }).tap();
    // image + add element + pages
    await tabs.getByRole('button', { name: 'Pages' }).tap();
    await page.getByRole('button', { name: /^Image/ }).first().tap();
    await page.getByRole('button', { name: 'Doughnuts' }).tap();
    ok((await page.locator('[id^="ab-"] img[src*="doughnuts"]').count()) >= 1, `${dev} swapping a photo from the layers list works`);
    await page.getByRole('button', { name: 'Page settings' }).tap();
    await page.getByRole('button', { name: /^Heading/ }).tap();
    ok(await page.locator('[id^="ab-"]').first().getByText('New heading').count() === 1, `${dev} adding a heading works`);
    await tabs.getByRole('button', { name: 'Pages' }).tap();
    await page.getByRole('button', { name: '+ After' }).tap(); ok(/pages · 2/i.test(await page.locator('[data-sheet]').innerText()), `${dev} add page`);
    await page.getByRole('button', { name: 'Delete page' }).tap(); ok(/pages · 1/i.test(await page.locator('[data-sheet]').innerText()), `${dev} delete page`);
    ok(!errs.length, `${dev} no page errors ${errs.slice(0, 2).join(' | ')}`);
    await ctx.close();
  }
  // landscape: side panel
  const ctx = await browser.newContext(profile('iPhone 15 landscape')); const page = await ctx.newPage();
  await page.goto(BASE + '/studio/edit/square%3Aannounce', { waitUntil: 'networkidle' }); await page.waitForSelector('#canvas-scroll');
  await page.getByRole('navigation', { name: 'Editor' }).getByRole('button', { name: 'Edit' }).tap();
  const sb = await page.locator('[data-sheet]').boundingBox(), vw = page.viewportSize().width;
  const hb = await page.locator('header').first().boundingBox();
  ok(Math.round(sb.x + sb.width) === vw && sb.width <= vw / 2 + 1 && Math.abs(sb.y - (hb.y + hb.height)) <= 2, `landscape phone: panel slides in from the right under the header (${Math.round(sb.width)}px of ${vw})`);
  await page.waitForTimeout(900);
  const pw = await page.locator('[id^="pw-"]').first().boundingBox();
  ok(pw.x >= 0 && pw.x + pw.width <= sb.x + 1, 'landscape phone: the page is centred in the space left of the panel');
  await ctx.close();
}

async function exportSuite(browser, eng) {
  console.log(`\n[${eng}] Downloads and sharing on phones`);
  const ctx = await browser.newContext({ ...profile('iPhone 15'), acceptDownloads: true }); const page = await ctx.newPage();
  await ctx.addInitScript(() => { navigator.canShare = () => true; navigator.share = (d) => { window.__shared = d.files.map((f) => f.name + ':' + f.type + ':' + f.size); return Promise.resolve(); }; });
  await page.goto(BASE + '/studio/edit/story%3Aeidfitr', { waitUntil: 'networkidle' }); await page.waitForSelector('#canvas-scroll');
  const tabs = page.getByRole('navigation', { name: 'Editor' }); const dlg = () => page.getByRole('dialog', { name: 'Export' });
  await tabs.getByRole('button', { name: 'Export' }).tap();
  await dlg().getByRole('button', { name: '3×' }).tap();
  ok(await dlg().getByText(/can’t draw images this large/).count() === 1, 'iPhone: 3× story shows the size note');
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 180000 }), dlg().getByRole('button', { name: /^PNG\s*Page/ }).tap()]);
  const f = path.join(OUT, dl.suggestedFilename()); await dl.saveAs(f); const b = fs.readFileSync(f); const w = b.readUInt32BE(16), h = b.readUInt32BE(20);
  ok(w * h <= 16_000_000 && w > 1080, `iPhone: 3× PNG capped under the 16 MP canvas limit (${w}×${h})`);
  for (const [label, re] of [['JPG', /\.jpg$/], ['PDF', /p1_1080x1920\.pdf$/], ['PNG \\(ZIP\\)', /\.zip$/], ['PPTX', /\.pptx$/], ['HTML', /\.html$/], ['Project file', /\.json$/]]) {
    await page.waitForTimeout(400); await tabs.getByRole('button', { name: 'Export' }).tap();
    const [d] = await Promise.all([page.waitForEvent('download', { timeout: 180000 }), dlg().getByRole('button', { name: new RegExp('^' + label) }).first().tap()]);
    const p = path.join(OUT, d.suggestedFilename()); await d.saveAs(p); ok(re.test(d.suggestedFilename()) && fs.statSync(p).size > 0, `iPhone: ${label.replace(/\\/g, '')} download (${d.suggestedFilename()})`);
    await page.waitForSelector('[role="status"]:has-text("download started")', { timeout: 60000 }).catch(() => {});
  }
  await page.waitForTimeout(500); await tabs.getByRole('button', { name: 'Export' }).tap();
  ok(await dlg().getByText('Share from this device').count() === 1, 'share options shown when the phone can share files');
  await dlg().getByRole('button', { name: /^Share PNG/ }).tap();
  await page.getByRole('dialog', { name: 'Share' }).waitFor({ timeout: 120000 });
  await page.getByRole('dialog', { name: 'Share' }).getByRole('button', { name: 'Share' }).tap(); await page.waitForTimeout(300);
  const shared = await page.evaluate(() => window.__shared);
  ok(shared && /treats-by-mma_.*\.png:image\/png:\d+/.test(shared[0]), `Share sends the PNG to the share sheet (${shared && shared[0]})`);
  await ctx.close();
}

async function sweep(browser, eng) {
  console.log(`\n[${eng}] Every template opens and edits on a phone (Pixel 7)`);
  const ctx = await browser.newContext(profile('Pixel 7')); const page = await ctx.newPage();
  await page.goto(BASE + '/studio', { waitUntil: 'networkidle' });
  const ids = await page.evaluate(async () => { const r = []; for (const c of ['social', 'platform', 'celebrations', 'banners', 'avatars', 'ads', 'email', 'web', 'editorial', 'documents']) r.push(c); return r; });
  const all = [];
  for (const c of ids) { await page.goto(BASE + '/studio?cat=' + c, { waitUntil: 'networkidle' }); while (await page.getByRole('button', { name: /^Show \d+ more/ }).count()) await page.getByRole('button', { name: /^Show \d+ more/ }).tap(); all.push(...await page.locator('[data-tpl]').evaluateAll((n) => n.map((x) => x.dataset.tpl))); }
  ok(all.length === 626, `found all ${all.length} templates in the library`);
  if (process.env.ONLY_CAT) all.splice(0, all.length, ...all.filter((id) => id.startsWith(process.env.ONLY_CAT)));
  await ctx.close();
  const workers = 4, chunks = Array.from({ length: workers }, (_, i) => all.filter((_, j) => j % workers === i)); const bad = [];
  await Promise.all(chunks.map(async (list) => {
    const c = await browser.newContext(profile('Pixel 7')); const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    for (const id of list) {
      try {
        await p.goto(BASE + '/studio/edit/' + encodeURIComponent(id), { waitUntil: 'domcontentloaded' }); await p.waitForSelector('#canvas-scroll [id^="ab-"]', { timeout: 20000 });
        const board = p.locator('[id^="ab-"]').first();
        const texts = board.locator('[id^="el-"]:has(> div[id^="tx-"])').filter({ hasText: /\S/ });
        const bar = p.getByRole('toolbar', { name: 'Selected element' });
        if (await texts.count()) {
          const t = texts.first(); await t.scrollIntoViewIfNeeded(); const bb = await t.boundingBox(); await p.touchscreen.tap(bb.x + Math.min(bb.width / 2, 20), bb.y + Math.min(bb.height / 2, 10));
          await bar.waitFor({ timeout: 5000 }); await bar.getByRole('button', { name: /^Edit/ }).tap(); await p.fill('#insp-text', 'Sweep ' + id);
          if (!(await board.getByText('Sweep ' + id).count())) bad.push(id + ' (text not updated)');
        } else {
          // logo-only designs (avatars): select the logo and switch it between full logo and monogram
          const logo = board.locator('[id^="el-"]:has(> img)').last(); const bb = await logo.boundingBox(); await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2);
          await bar.waitFor({ timeout: 5000 }); await bar.getByRole('button', { name: /^Edit/ }).tap();
          const before = await logo.locator('img').getAttribute('src');
          await p.getByRole('button', { name: before.includes('monogram') ? 'Full logo' : 'Monogram (provisional)' }).tap();
          if ((await logo.locator('img').getAttribute('src')) === before) bad.push(id + ' (logo variant not changed)');
        }
      } catch (e) { bad.push(id + ' (' + e.message.split('\n')[0] + ')'); }
      if (errs.length) { bad.push(id + ' error: ' + errs[0]); errs.length = 0; }
    }
    await c.close();
  }));
  ok(!bad.length, `all ${all.length} templates open, select and edit on a phone${bad.length ? ': ' + bad.slice(0, 8).join('; ') : ''}`);
}

for (const [eng, type] of engines) {
  const browser = await type.launch();
  try {
    if (!only || only === 'layout') await layout(browser, eng);
    if (!only || only === 'edit') await edit(browser, eng);
    if (!only || only === 'export') await exportSuite(browser, eng);
    if (!only || only === 'sweep') await sweep(browser, eng);
  } catch (e) { fail++; console.log('✗ aborted: ' + e.message.split('\n').slice(0, 3).join(' ')); }
  await browser.close();
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
