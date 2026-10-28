/* Treats by MMA Studio — exporters. Operate on the current edited doc state + rendered artboard nodes. Exposed as window.TBMX. */
(function () {
const CDN = {
  h2i:'https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js',
  jspdf:'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
  pptx:'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js',
  zip:'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
};
const loaded = {};
function load(k) { if (loaded[k]) return loaded[k]; loaded[k] = new Promise((res, rej) => { const s = document.createElement('script'); s.src = CDN[k]; s.onload = res; s.onerror = () => { loaded[k] = null; rej(new Error('Could not load ' + k + ' library (offline?)')); }; document.head.appendChild(s); }); return loaded[k]; }
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Caprasimo&family=Figtree:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap';
let fontP = null;
const blobToData = (b) => new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(b); });
function fontCSS() {
  if (fontP) return fontP;
  fontP = (async () => { try { let css = await (await fetch(FONT_URL)).text(); const blocks = css.split('/* ').filter((b) => b.startsWith('latin */')).map((b) => b.slice(9));
    const out = []; for (const b of blocks) { const m = b.match(/url\(([^)]+)\)/); if (!m) continue; const d = await blobToData(await (await fetch(m[1])).blob()); out.push(b.replace(m[1], d)); } return out.join('\n'); } catch (e) { return ''; } })();
  return fontP;
}
const fname = (doc, extra, ext) => 'treats-by-mma_' + TBM.slug(doc.name) + (extra ? '_' + extra : '') + '_' + doc.w + 'x' + doc.h + '.' + ext;
function save(blob, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }
const dataToBlob = async (d) => (await fetch(d)).blob();
async function srcToPng(src) { // any src → {data:'data:image/png;base64..', blob}
  const img = await new Promise((res, rej) => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => res(i); i.onerror = rej; i.src = src; });
  const c = document.createElement('canvas'); const max = 1600, sc = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight)); c.width = Math.round(img.naturalWidth * sc); c.height = Math.round(img.naturalHeight * sc);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); const data = c.toDataURL('image/png'); return { data, blob:await dataToBlob(data), w:c.width, h:c.height };
}
const scaleFor = (doc, mult) => { const f = TBM.FORMATS[doc.formatId]; return (f && f.ex ? f.ex / doc.w : 1) * (mult || 1); };

async function capture(node, doc, type, mult, quality) {
  await load('h2i'); const H = window.htmlToImage; const fontEmbedCSS = await fontCSS();
  const opt = { width:doc.w, height:doc.h, pixelRatio:scaleFor(doc, mult), fontEmbedCSS, cacheBust:false, style:{ transform:'none', margin:'0', boxShadow:'none' }, quality:quality || 0.92, backgroundColor:type === 'jpeg' ? '#FFFFFF' : undefined };
  if (type === 'svg') return dataToBlob(await H.toSvg(node, opt));
  if (type === 'jpeg') return dataToBlob(await H.toJpeg(node, opt));
  return H.toBlob(node, opt);
}

/* semantic extraction for text-based formats */
const ROLE = (e) => { const k = e.key || ''; if (e.type === 'image') return 'img'; if (e.type === 'table') return 'table'; if (e.type === 'toc') return 'toc'; if (e.type === 'chart') return 'chart';
  if (e.type !== 'text') return null; if (k === 'quotemark') return null; if (k === 'title' || k === 'stat') return 'h1'; if (k === 'heading') return 'h2'; if (/^(h3|boxh|col\dh|card\d+h|blk\d+h)$/.test(k)) return 'h3';
  if (k === 'quote') return 'quote'; if (k === 'list') return 'ul'; if (k === 'label') return 'label'; if (k === 'cta') return 'cta'; return 'p'; };
function blocks(doc) {
  return doc.pages.map((pg, pi) => { const els = pg.elements.slice().sort((a, b) => (a.y - b.y) || (a.x - b.x)); const out = [];
    els.forEach((e) => { const r = ROLE(e); if (!r) return; const t = (e.text || '').trim();
      if (r === 'img') { if (e.src) out.push({ r, src:e.src, w:e.w, h:e.h }); return; } if (!t) return;
      if (r === 'table' || r === 'chart' || r === 'toc') { const rows = t.split('\n').filter(Boolean).map((l) => l.split(r === 'chart' ? ':' : '|').map((c) => c.trim())); out.push({ r:'table', rows, head:r === 'table' }); return; }
      if (r === 'ul') { out.push({ r, items:t.split('\n').map((l) => l.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean) }); return; }
      out.push({ r, t }); });
    return { name:pg.name, toc:pg.toc, blocks:out }; });
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function toMarkdown(doc) {
  return blocks(doc).map((p) => p.blocks.map((b) => { switch (b.r) {
    case 'h1': return '# ' + b.t; case 'h2': return '## ' + b.t; case 'h3': return '### ' + b.t; case 'quote': return b.t.split('\n').map((l) => '> ' + l).join('\n');
    case 'label': return '**' + b.t.toUpperCase() + '**'; case 'cta': return '**→ ' + b.t + '**'; case 'ul': return b.items.map((i) => '- ' + i).join('\n');
    case 'img': return '![' + (p.name || 'image') + '](' + (b.src.startsWith('data:') ? 'embedded-image' : b.src) + ')';
    case 'table': { const [h, ...rows] = b.rows; const n = h.length; return ['| ' + h.join(' | ') + ' |', '|' + ' --- |'.repeat(n), ...rows.map((r) => '| ' + r.join(' | ') + ' |')].join('\n'); }
    default: return b.t; } }).join('\n\n')).join('\n\n---\n\n') + '\n';
}
function toText(doc) {
  return blocks(doc).map((p) => p.blocks.map((b) => { switch (b.r) { case 'h1': return b.t.toUpperCase(); case 'ul': return b.items.map((i) => '• ' + i).join('\n'); case 'table': return b.rows.map((r) => r.join('\t')).join('\n'); case 'img': return ''; default: return b.t; } }).filter(Boolean).join('\n\n')).join('\n\n\n') + '\n';
}

async function zipOf(files, name) { await load('zip'); const z = new JSZip(); files.forEach((f) => z.file(f.name, f.blob)); save(await z.generateAsync({ type:'blob', compression:'DEFLATE' }), name); }

async function pdf(doc, nodes, ret) {
  await load('jspdf'); const { jsPDF } = window.jspdf; const pw = doc.w * 0.75, ph = doc.h * 0.75; const o = pw > ph ? 'l' : 'p';
  const pd = new jsPDF({ orientation:o, unit:'pt', format:[pw, ph], compress:true });
  for (let i = 0; i < nodes.length; i++) { const b = await capture(nodes[i], doc, 'jpeg', Math.max(2, scaleFor(doc)) / scaleFor(doc), 0.92); const d = await blobToData(b); if (i) pd.addPage([pw, ph], o); pd.addImage(d, 'JPEG', 0, 0, pw, ph, undefined, 'FAST'); }
  pd.setProperties({ title:doc.name, author:'Treats by MMA', creator:'Treats by MMA Studio' });
  if (ret) return pd.output('blob'); save(pd.output('blob'), fname(doc, '', 'pdf'));
}

async function pptx(doc) {
  await load('pptx'); const P = new PptxGenJS(); const W = 13.333, Hh = +(W * doc.h / doc.w).toFixed(3), k = W / doc.w, pt = k * 72;
  P.defineLayout({ name:'TBM', width:W, height:Hh }); P.layout = 'TBM'; P.author = 'Treats by MMA'; P.title = doc.name;
  const hex = (c) => (c && c[0] === '#' ? c.slice(1, 7).toUpperCase() : 'FFFFFF'); const imgs = {};
  const img = async (src) => imgs[src] || (imgs[src] = (await srcToPng(src)).data);
  for (let pi = 0; pi < doc.pages.length; pi++) { const pg = doc.pages[pi]; const s = P.addSlide(); s.background = { color:hex(pg.bg) };
    const n = pageNum(doc, pi);
    for (const e of pg.elements) { const box = { x:e.x * k, y:e.y * k, w:e.w * k, h:e.h * k };
      if (e.type === 'text' || e.type === 'pageno') { let t = e.type === 'pageno' ? (n == null ? '' : e.text.replace('{n}', n)) : e.text; if (!t) continue; if (e.upper) t = t.toUpperCase();
        s.addText(t, { ...box, fontFace:e.font === 'display' ? 'Caprasimo' : 'Figtree', fontSize:Math.max(4, +(e.size * pt).toFixed(1)), color:hex(e.color), bold:e.weight >= 700, italic:e.italic, align:e.align, valign:e.valign === 'center' ? 'middle' : e.valign, lineSpacingMultiple:e.lh, charSpacing:e.ls ? +(e.ls * e.size * pt).toFixed(1) : undefined, margin:e.pad ? e.pad * pt : 0, fill:e.bg ? { color:hex(e.bg) } : undefined, shape:e.bg && e.radius ? P.ShapeType.roundRect : undefined, rectRadius:e.bg && e.radius ? Math.min(box.h / 2, e.radius * k) : undefined, fit:'none' }); }
      else if (e.type === 'image') { if (!e.src) { s.addShape(P.ShapeType.roundRect, { ...box, fill:{ color:'FDE3F0' }, line:{ type:'none' }, rectRadius:0.1 }); continue; }
        s.addImage({ data:await img(e.src), ...box, sizing:{ type:e.fit === 'contain' ? 'contain' : 'cover', w:box.w, h:box.h }, rounding:e.frame === 'circle' });
        if (e.scrim) s.addShape(P.ShapeType.rect, { x:box.x, y:box.y + box.h * 0.4, w:box.w, h:box.h * 0.6, fill:{ color:'3D1D10', transparency:35 }, line:{ type:'none' } }); }
      else if (e.type === 'shape') { const tr = e.fill === 'transparent' ? 100 : Math.round((1 - e.opacity) * 100);
        s.addShape(e.radius ? P.ShapeType.roundRect : P.ShapeType.rect, { ...box, fill:{ color:hex(e.fill === 'transparent' ? '#FFFFFF' : e.fill), transparency:tr }, line:e.stroke ? { color:hex(e.stroke), width:e.strokeW * pt } : { type:'none' }, rectRadius:e.radius ? Math.min(box.w, box.h) / 2 * Math.min(1, e.radius * 2 / Math.min(e.w, e.h)) : undefined }); }
      else if (e.type === 'logo') { s.addShape(P.ShapeType.roundRect, { ...box, fill:{ color:hex(e.tile) }, line:{ type:'none' }, rectRadius:Math.min(box.w, box.h) / 2 * Math.min(1, e.radius * 2 / Math.min(e.w, e.h)) }); s.addImage({ data:await img(e.variant === 'mark' ? TBM.MARK : TBM.LOGO), ...box, sizing:{ type:e.variant === 'mark' ? 'cover' : 'contain', w:box.w, h:box.h }, rounding:e.radius >= Math.min(e.w, e.h) / 2 }); }
      else if (e.type === 'ribbon') { const cy = box.y + box.h / 2, hw = box.h * 0.6; s.addShape(P.ShapeType.line, { x:box.x, y:cy, w:box.w / 2 - hw, h:0, line:{ color:hex(e.color), width:1.5 } }); s.addShape(P.ShapeType.line, { x:box.x + box.w / 2 + hw, y:cy, w:box.w / 2 - hw, h:0, line:{ color:hex(e.color), width:1.5 } }); s.addText('♥', { x:box.x + box.w / 2 - hw, y:box.y, w:hw * 2, h:box.h, align:'center', valign:'middle', color:hex(e.color), fontSize:Math.max(6, e.h * 0.7 * pt), margin:0 }); }
      else if (e.type === 'table' || e.type === 'toc') { const rows = (e.type === 'toc' ? tocRows(e.text, doc) : e.text.split('\n').filter(Boolean).map((l) => l.split('|').map((c) => c.trim())));
        if (!rows.length) continue; s.addTable(rows.map((r, ri) => r.map((c) => ({ text:c, options:{ bold:e.type === 'table' && ri === 0, color:hex(ri === 0 && e.type === 'table' ? e.head : e.color) } }))), { x:box.x, y:box.y, w:box.w, fontFace:'Figtree', fontSize:+(e.size * pt).toFixed(1), border:{ type:'solid', color:hex(e.line || '#F7DC85'), pt:0.5 }, margin:0.05 }); }
      else if (e.type === 'chart') { const rows = e.text.split('\n').filter(Boolean).map((l) => l.split(':')); s.addChart(P.ChartType.bar, [{ name:'Value', labels:rows.map((r) => r[0].trim()), values:rows.map((r) => parseFloat(r[1]) || 0) }], { ...box, barDir:'bar', chartColors:[hex(e.bar)], showValue:true, catAxisLabelColor:hex(e.color), valAxisHidden:true, valGridLine:{ style:'none' }, catAxisLabelFontFace:'Figtree', dataLabelColor:hex(e.color) }); }
    } }
  const blob = await P.write({ outputType:'blob' }); save(blob, fname(doc, '', 'pptx'));
}

function pageNum(doc, i) { const pn = doc.pageNumbers || {}; if (!pn.show) return null; const pg = doc.pages[i]; if (pg.numbered === false) return null; return (pn.start || 1) + i; }
function tocRows(text, doc) { return String(text || '').split('\n').filter(Boolean).map((l) => { const [a, b] = l.split('|'); return [a.trim(), (b || '').trim()]; }); }

async function docx(doc) {
  await load('zip'); const z = new JSZip(); const B = blocks(doc); const rels = []; let ri = 10, body = '';
  const run = (t, o) => { o = o || {}; return t.split('\n').map((l, i) => (i ? '<w:r><w:br/></w:r>' : '') + '<w:r>' + (o.b || o.c || o.caps ? '<w:rPr>' + (o.b ? '<w:b/>' : '') + (o.caps ? '<w:caps/>' : '') + (o.c ? '<w:color w:val="' + o.c + '"/>' : '') + '</w:rPr>' : '') + '<w:t xml:space="preserve">' + esc(l) + '</w:t></w:r>').join(''); };
  const para = (t, style, o) => '<w:p><w:pPr>' + (style ? '<w:pStyle w:val="' + style + '"/>' : '') + (o && o.jc ? '<w:jc w:val="' + o.jc + '"/>' : '') + '</w:pPr>' + run(t, o) + '</w:p>';
  const just = TBM.DOCS[doc.docType] && TBM.DOCS[doc.docType].justify ? 'both' : null; const maxW = 5486400;
  for (let pi = 0; pi < B.length; pi++) { const p = B[pi];
    for (const b of p.blocks) { switch (b.r) {
      case 'h1': body += para(b.t, 'Title'); break; case 'h2': body += para(b.t, 'Heading1'); break; case 'h3': body += para(b.t, 'Heading2'); break;
      case 'quote': body += para(b.t, 'Quote'); break; case 'label': body += para(b.t, null, { b:1, caps:1, c:'AD1660' }); break; case 'cta': body += para(b.t, null, { b:1, c:'C81F75' }); break;
      case 'ul': b.items.forEach((i) => { body += para('•  ' + i, 'ListParagraph'); }); break;
      case 'table': body += '<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders>' + ['top','left','bottom','right','insideH','insideV'].map((s) => '<w:' + s + ' w:val="single" w:sz="4" w:color="F7DC85"/>').join('') + '</w:tblBorders></w:tblPr>' + b.rows.map((r, i) => '<w:tr>' + r.map((c) => '<w:tc><w:p>' + run(c, { b:b.head && i === 0 }) + '</w:p></w:tc>').join('') + '</w:tr>').join('') + '</w:tbl>' + para(''); break;
      case 'img': try { const im = await srcToPng(b.src); const id = 'rId' + (ri++); const nm = 'image' + ri + '.png'; z.file('word/media/' + nm, im.blob); rels.push('<Relationship Id="' + id + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/' + nm + '"/>');
          const cx = Math.min(maxW, b.w * 9525), cy = Math.round(cx * b.h / b.w);
          body += '<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:drawing><wp:inline><wp:extent cx="' + cx + '" cy="' + cy + '"/><wp:docPr id="' + ri + '" name="' + nm + '"/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="' + ri + '" name="' + nm + '"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="' + id + '"/><a:srcRect/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="' + cx + '" cy="' + cy + '"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>'; } catch (e) {} break;
      default: body += para(b.t, null, just ? { jc:just } : null); } }
    if (pi < B.length - 1) body += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'; }
  const tw = (px) => Math.round(px * 15); const pw = doc.w > doc.h ? Math.max(tw(doc.w), 16838) : tw(doc.w), ph = Math.round(pw * doc.h / doc.w);
  const pgNum = doc.pageNumbers && doc.pageNumbers.show;
  const sect = '<w:sectPr>' + (pgNum ? '<w:footerReference w:type="default" r:id="rIdFtr"/>' : '') + '<w:pgSz w:w="' + pw + '" w:h="' + ph + '"' + (doc.w > doc.h ? ' w:orient="landscape"' : '') + '/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/>' + (pgNum ? '<w:pgNumType w:start="' + (doc.pageNumbers.start || 1) + '"/>' : '') + '</w:sectPr>';
  const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"';
  z.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>');
  z.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>');
  z.file('docProps/core.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>' + esc(doc.name) + '</dc:title><dc:creator>Treats by MMA</dc:creator></cp:coreProperties>');
  z.file('word/_rels/document.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdSt" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rIdFtr" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>' + rels.join('') + '</Relationships>');
  z.file('word/footer1.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr ' + NS + '><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:color w:val="5A2F1C"/><w:sz w:val="18"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>');
  const st = (id, name, font, sz, color, ex) => '<w:style w:type="paragraph" w:styleId="' + id + '"><w:name w:val="' + name + '"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:before="240" w:after="120"/>' + (ex || '') + '</w:pPr><w:rPr><w:rFonts w:ascii="' + font + '" w:hAnsi="' + font + '"/><w:color w:val="' + color + '"/><w:sz w:val="' + sz + '"/></w:rPr></w:style>';
  z.file('word/styles.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Figtree" w:hAnsi="Figtree" w:cs="Segoe UI"/><w:color w:val="3D1D10"/><w:sz w:val="22"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="160" w:line="312" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>' +
    st('Title', 'Title', 'Caprasimo', 56, '3D1D10') + st('Heading1', 'heading 1', 'Caprasimo', 36, '3D1D10', '<w:outlineLvl w:val="0"/>') + st('Heading2', 'heading 2', 'Figtree', 26, '3D1D10', '<w:outlineLvl w:val="1"/>') + st('Quote', 'Quote', 'Caprasimo', 30, 'C81F75', '<w:ind w:left="567"/>') + st('ListParagraph', 'List Paragraph', 'Figtree', 22, '3D1D10', '<w:ind w:left="360"/>') + '</w:styles>');
  z.file('word/document.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ' + NS + '><w:body>' + body + sect + '</w:body></w:document>');
  save(await z.generateAsync({ type:'blob', mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), fname(doc, '', 'docx'));
}

function blockHTML(b, imgMap) { switch (b.r) {
  case 'h1': return '<h1>' + esc(b.t) + '</h1>'; case 'h2': return '<h2>' + esc(b.t) + '</h2>'; case 'h3': return '<h3>' + esc(b.t) + '</h3>';
  case 'quote': return '<blockquote>' + esc(b.t).replace(/\n/g, '<br/>') + '</blockquote>'; case 'label': return '<p class="label">' + esc(b.t) + '</p>'; case 'cta': return '<p class="cta"><strong>' + esc(b.t) + '</strong></p>';
  case 'ul': return '<ul>' + b.items.map((i) => '<li>' + esc(i) + '</li>').join('') + '</ul>';
  case 'table': return '<table>' + b.rows.map((r, i) => '<tr>' + r.map((c) => (b.head && i === 0 ? '<th>' : '<td>') + esc(c) + (b.head && i === 0 ? '</th>' : '</td>')).join('') + '</tr>').join('') + '</table>';
  case 'img': return imgMap[b.src] ? '<figure><img src="' + imgMap[b.src] + '" alt=""/></figure>' : '';
  default: return '<p>' + esc(b.t).replace(/\n/g, '<br/>') + '</p>'; } }
async function epub(doc) {
  await load('zip'); const z = new JSZip(); const B = blocks(doc); const uid = 'urn:uuid:' + (crypto.randomUUID ? crypto.randomUUID() : Date.now());
  z.file('mimetype', 'application/epub+zip', { compression:'STORE' });
  z.file('META-INF/container.xml', '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');
  const imgMap = {}; const man = []; let n = 0;
  for (const p of B) for (const b of p.blocks) if (b.r === 'img' && !imgMap[b.src]) { try { const im = await srcToPng(b.src); const nm = 'img/i' + (++n) + '.png'; z.file('OEBPS/' + nm, im.blob); imgMap[b.src] = nm; man.push('<item id="i' + n + '" href="' + nm + '" media-type="image/png"' + (n === 1 ? ' properties="cover-image"' : '') + '/>'); } catch (e) {} }
  z.file('OEBPS/style.css', 'body{font-family:Figtree,"Segoe UI",sans-serif;color:#3D1D10;line-height:1.6;margin:0 5%}h1,h2{font-family:Caprasimo,Georgia,serif;font-weight:400;line-height:1.1}h1{font-size:2.2em;margin:1.2em 0 .4em}h2{font-size:1.6em;margin:1em 0 .4em}h3{font-size:1.1em}p{margin:0 0 .9em;' + (TBM.DOCS[doc.docType] && TBM.DOCS[doc.docType].justify ? 'text-align:justify;hyphens:auto;' : '') + '}.label{text-transform:uppercase;letter-spacing:.12em;font-size:.75em;font-weight:800;color:#AD1660}.cta{color:#C81F75}blockquote{font-family:Caprasimo,Georgia,serif;font-size:1.3em;color:#AD1660;margin:1.2em 1em}img{max-width:100%;border-radius:8px}figure{margin:1em 0;text-align:center}table{border-collapse:collapse;width:100%;margin:1em 0}td,th{border:1px solid #F7DC85;padding:.4em .6em;text-align:left}section{page-break-after:always}');
  const files = B.map((p, i) => { const id = 'p' + String(i + 1).padStart(3, '0'); const title = (p.blocks.find((b) => b.r === 'h1' || b.r === 'h2') || {}).t || p.name;
    z.file('OEBPS/' + id + '.xhtml', '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en"><head><title>' + esc(title) + '</title><link rel="stylesheet" href="style.css"/></head><body><section epub:type="' + (i === 0 ? 'cover' : 'chapter') + '">' + p.blocks.map((b) => blockHTML(b, imgMap)).join('') + '</section></body></html>');
    return { id, title, toc:p.toc || i === 0 }; });
  z.file('OEBPS/nav.xhtml', '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><title>Contents</title></head><body><nav epub:type="toc"><h1>Contents</h1><ol>' + files.filter((f) => f.toc).map((f) => '<li><a href="' + f.id + '.xhtml">' + esc(f.title) + '</a></li>').join('') + '</ol></nav></body></html>');
  z.file('OEBPS/content.opf', '<?xml version="1.0" encoding="utf-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="uid">' + uid + '</dc:identifier><dc:title>' + esc(doc.name) + '</dc:title><dc:creator>Treats by MMA</dc:creator><dc:language>en</dc:language><meta property="dcterms:modified">' + new Date().toISOString().slice(0, 19) + 'Z</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="css" href="style.css" media-type="text/css"/>' + files.map((f) => '<item id="' + f.id + '" href="' + f.id + '.xhtml" media-type="application/xhtml+xml"/>').join('') + man.join('') + '</manifest><spine>' + files.map((f) => '<itemref idref="' + f.id + '"/>').join('') + '</spine></package>');
  save(await z.generateAsync({ type:'blob', mimeType:'application/epub+zip', compression:'DEFLATE' }), fname(doc, '', 'epub'));
}

async function html(doc, nodes) {
  const cache = {}; const parts = [];
  for (const nd of nodes) { const c = nd.cloneNode(true); c.style.transform = 'none'; c.style.boxShadow = 'none'; c.style.margin = '0 auto';
    for (const im of c.querySelectorAll('img')) { const s = im.getAttribute('src'); if (!s) continue; try { cache[s] = cache[s] || (await srcToPng(new URL(s, location.href).href)).data; im.setAttribute('src', cache[s]); } catch (e) {} }
    c.querySelectorAll('[data-sel]').forEach((x) => x.remove()); parts.push('<div class="pg">' + c.outerHTML + '</div>'); }
  const out = '<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>' + esc(doc.name) + ' — Treats by MMA</title><link rel="stylesheet" href="' + FONT_URL + '"/><style>body{margin:0;background:#FFF2F8;padding:32px 0}.pg{width:' + doc.w + 'px;margin:0 auto 32px;box-shadow:0 16px 36px -12px rgba(61,29,16,.28)}@media print{body{background:none;padding:0}.pg{box-shadow:none;margin:0;page-break-after:always}@page{size:' + doc.w + 'px ' + doc.h + 'px;margin:0}}</style></head><body>' + parts.join('') + '</body></html>';
  save(new Blob([out], { type:'text/html' }), fname(doc, '', 'html'));
}

window.TBMX = { load, capture, pdf, pptx, docx, epub, html, zipOf, save, fname, toMarkdown, toText, blocks, scaleFor, fontCSS,
  md:(doc) => save(new Blob([toMarkdown(doc)], { type:'text/markdown' }), fname(doc, '', 'md')), txt:(doc) => save(new Blob([toText(doc)], { type:'text/plain' }), fname(doc, '', 'txt')),
  json:(doc) => save(new Blob([JSON.stringify(doc, null, 2)], { type:'application/json' }), fname(doc, 'project', 'json')) };
})();
