"use strict";
/* Drum Kit Builder — builds FL Studio drum kit folders with .nfo files,
   label images and banners. Plain JS, no build step, so it runs in a
   browser, as a published page, or inside the Electron desktop wrapper. */

/* ---------- constants ---------- */
const FONTS = [
  { id: 'arialbold', label: 'Arial Bold', css: 'Arial, Helvetica, sans-serif', w: '700' },
  { id: 'arialblack', label: 'Arial Black', css: '"Arial Black", Arial, sans-serif', w: '900' },
  { id: 'segoe', label: 'Segoe UI Bold', css: '"Segoe UI", system-ui, sans-serif', w: '700' },
  { id: 'impact', label: 'Impact', css: 'Impact, "Arial Narrow", sans-serif', w: '400' },
  { id: 'verdana', label: 'Verdana Bold', css: 'Verdana, sans-serif', w: '700' },
  { id: 'bebas', label: 'Bebas Neue', css: '"Bebas Neue", sans-serif', w: '400', web: 'Bebas Neue' },
  { id: 'anton', label: 'Anton', css: 'Anton, sans-serif', w: '400', web: 'Anton' },
  { id: 'blackops', label: 'Black Ops One', css: '"Black Ops One", sans-serif', w: '400', web: 'Black Ops One' },
  { id: 'russo', label: 'Russo One', css: '"Russo One", sans-serif', w: '400', web: 'Russo One' },
  { id: 'bungee', label: 'Bungee', css: 'Bungee, sans-serif', w: '400', web: 'Bungee' },
  { id: 'marker', label: 'Permanent Marker', css: '"Permanent Marker", cursive', w: '400', web: 'Permanent Marker' },
  { id: 'pixel', label: 'Press Start 2P', css: '"Press Start 2P", monospace', w: '400', web: 'Press Start 2P' },
  { id: 'rubikmono', label: 'Rubik Mono One', css: '"Rubik Mono One", sans-serif', w: '400', web: 'Rubik Mono One' }
];
const ICONS = [['none', 'Folder'], ['7', 'Audio bars (7)'], ['52', 'Star (52)'], ['55', 'Cloud (55)'], ['34', 'Piano keys (34)'], ['custom', 'Other number…']];
const KNOWN_ICONS = ['7', '52', '55', '34'];
// Folder names created automatically when dropped samples have no matching folder.
const TYPE_NAMES = { '808': '808s', kick: 'Kicks', clap: 'Claps', snare: 'Snares', hat: 'Hihats', open: 'Open hats', crash: 'Crash', perc: 'Percs', vox: 'Vox', fx: 'Fx', oneshot: 'Oneshots', midi: 'MIDI' };
const TYPE_ORDER = ['808', 'kick', 'clap', 'snare', 'hat', 'open', 'crash', 'perc', 'vox', 'fx', 'oneshot', 'midi'];
const IGNORE = /^(\..*|desktop\.ini|thumbs\.db)$/i;
const STORE_KEY = 'dkb-v2';

let uid = 1;
const nid = () => 'c' + (uid++) + Math.random().toString(36).slice(2, 6);
const newCat = (name = '', icon = '7') => ({ id: nid(), name, label: '', icon, colorOn: true, color: '#FFFFFF', img: null });

function defaultState() {
  return {
    kitName: '', tip: '', kitIcon: '52', kitColorOn: false, kitColor: '#C7CBD1',
    bannerMode: 'text', bannerFit: true, bannerW: 250, bannerData: null, bannerSub: '', bannerBg: '#3A3F46', bannerInk: '#FFFFFF',
    font: 'arialbold', size: 16, labelColor: '#FFFFFF', matchColor: false, outline: 0, outlineColor: '#000000', shadow: false,
    lw: 200, lh: 20, heightOfs: 5, colorOrder: 'bgr', numbering: true, sortGroup: false, zoom: 1,
    cats: [newCat()]
  };
}
let S = defaultState();
try {
  const raw = localStorage.getItem(STORE_KEY);
  if (raw) { S = Object.assign(defaultState(), JSON.parse(raw)); if (!S.cats.length) S.cats = [newCat()]; S.cats.forEach(c => { if (!c.id) c.id = nid(); }); }
} catch (e) { /* storage unavailable: start fresh */ }

let FILES = []; // { id, file, cat|null, sub }
const expanded = new Set();
const $ = id => document.getElementById(id);

/* ---------- helpers ---------- */
const clean = s => String(s || '').replace(/[<>:"/\\|?*\x00-\x1F]/g, '').replace(/[. ]+$/, '').trim();
const kitFolder = () => clean(S.kitName) || 'My Drum Kit';
const tipText = () => S.tip.trim();
const catName = (c, i) => clean(c.name) || 'Folder ' + (i + 1);
const catFolder = (c, i) => S.numbering ? `${i + 1} ${catName(c, i)}` : catName(c, i);
const catLabel = (c, i) => (c.label && c.label.trim()) || c.name.trim() || 'Folder ' + (i + 1);
function flColor(hex) {
  if (!hex) return '';
  const h = hex.replace('#', '').toUpperCase(), r = h.slice(0, 2), g = h.slice(2, 4), b = h.slice(4, 6);
  return '$' + (S.colorOrder === 'bgr' ? b + g + r : r + g + b);
}
function fmtBytes(n) { if (n < 1024) return n + ' B'; if (n < 1048576) return (n / 1024).toFixed(0) + ' KB'; if (n < 1073741824) return (n / 1048576).toFixed(1) + ' MB'; return (n / 1073741824).toFixed(2) + ' GB'; }
function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { } }
const fontOf = id => FONTS.find(f => f.id === id) || FONTS[0];
async function ensureFont(f, px) { if (!f.web || !document.fonts) return; try { await document.fonts.load(`${f.w} ${px}px "${f.web}"`); } catch (e) { } }
function el(tag, props = {}, ...kids) { const e = document.createElement(tag); Object.assign(e, props); kids.forEach(k => k != null && e.append(k)); return e; }

/* ---------- icons (simple drawings that stand in for FL's own) ---------- */
function iconSVG(idx, z = 1) {
  const k = String(idx), s = (w, h) => `width="${w * z}" height="${h * z}"`;
  if (k === '7') return `<svg ${s(14, 14)} viewBox="0 0 14 14" aria-hidden="true"><rect x="1" y="9" width="2.4" height="4" fill="#C7CBD1"/><rect x="5" y="6" width="2.4" height="7" fill="#C7CBD1"/><rect x="9" y="2" width="2.4" height="11" fill="#C7CBD1"/></svg>`;
  if (k === '52') return `<svg ${s(15, 15)} viewBox="0 0 24 24" aria-hidden="true"><path fill="#AEB8D0" d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z"/></svg>`;
  if (k === '55') return `<svg ${s(16, 14)} viewBox="0 0 24 18" aria-hidden="true"><path fill="#E6E8EB" d="M6 17h13a5 5 0 0 0 .6-9.96A7 7 0 0 0 6.2 6.1 5.5 5.5 0 0 0 6 17z"/></svg>`;
  if (k === '34') return `<svg ${s(15, 14)} viewBox="0 0 15 14" aria-hidden="true"><rect x=".5" y=".5" width="14" height="13" fill="#E6E8EB"/><rect x="3" y="1" width="2" height="7" fill="#2A2C33"/><rect x="7" y="1" width="2" height="7" fill="#2A2C33"/><rect x="11" y="1" width="2" height="7" fill="#2A2C33"/><path d="M5 8v5M10 8v5" stroke="#2A2C33"/></svg>`;
  const folder = `<svg ${s(15, 13)} viewBox="0 0 15 13" aria-hidden="true"><path fill="none" stroke="#9CA3AD" d="M.5 2.5v9.5h14V3.5H7L5.5 1.5h-5z"/></svg>`;
  return k === 'none' ? folder : folder + `<span class="fl-badge">#${k}</span>`;
}
function fillIconSelect(sel) { sel.innerHTML = ''; ICONS.forEach(([v, t]) => sel.add(new Option(t, v))); }

/* ---------- image rendering ---------- */
function renderLabel(text, color) {
  const f = fontOf(S.font), c = document.createElement('canvas');
  c.width = S.lw; c.height = S.lh;
  const x = c.getContext('2d'), pad = 3, ow = +S.outline || 0;
  let size = S.size;
  const setF = () => { x.font = `${f.w} ${size}px ${f.css}`; };
  setF();
  while (size > 7 && x.measureText(text).width > S.lw - pad * 2 - ow * 2) { size--; setF(); }
  x.textBaseline = 'middle';
  const y = Math.round(S.lh / 2) + 1, tx = pad + ow;
  if (S.shadow) { x.shadowColor = 'rgba(0,0,0,.8)'; x.shadowOffsetX = 1; x.shadowOffsetY = 1; x.shadowBlur = 1; }
  if (ow > 0) { x.lineJoin = 'round'; x.lineWidth = ow * 2; x.strokeStyle = S.outlineColor; x.strokeText(text, tx, y); x.shadowColor = 'transparent'; }
  x.fillStyle = color; x.fillText(text, tx, y);
  return c;
}
function renderTextBanner() {
  const W = +S.bannerW || 250, H = Math.round(W * 63 / 250), c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d'), f = fontOf(S.font);
  x.fillStyle = S.bannerBg; x.fillRect(0, 0, W, H);
  x.strokeStyle = 'rgba(255,255,255,.18)'; x.strokeRect(.5, .5, W - 1, H - 1);
  const title = kitFolder(), sub = S.bannerSub || tipText();
  let size = Math.round(H * .48);
  x.font = `${f.w} ${size}px ${f.css}`;
  while (size > 9 && x.measureText(title).width > W - 16) { size--; x.font = `${f.w} ${size}px ${f.css}`; }
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = S.bannerInk;
  x.fillText(title, W / 2, sub ? H * .42 : H / 2);
  if (sub) { x.font = `600 ${Math.max(9, Math.round(H * .19))}px "Segoe UI",Arial,sans-serif`; x.globalAlpha = .8; x.fillText(sub, W / 2, H * .78); x.globalAlpha = 1; }
  return c;
}
const imgCache = new Map();
function loadImg(src) {
  if (!imgCache.has(src)) imgCache.set(src, new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }));
  return imgCache.get(src);
}
async function renderImageBanner() {
  if (!S.bannerData) return null;
  const img = await loadImg(S.bannerData);
  let w = img.naturalWidth, h = img.naturalHeight;
  if (S.bannerFit && w !== +S.bannerW) { const W = +S.bannerW || 250; h = Math.max(1, Math.round(h * W / w)); w = W; }
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, w, h);
  return c;
}
async function renderCustom(dataURL) {
  const img = await loadImg(dataURL), c = document.createElement('canvas');
  c.width = img.naturalWidth; c.height = img.naturalHeight; c.getContext('2d').drawImage(img, 0, 0);
  return c;
}
async function bannerCanvas() {
  if (S.bannerMode === 'none') return null;
  if (S.bannerMode === 'text') { await ensureFont(fontOf(S.font), 30); return renderTextBanner(); }
  return renderImageBanner();
}
async function labelCanvas(c, i) {
  if (c.img) return renderCustom(c.img);
  return renderLabel(catLabel(c, i), S.matchColor && c.colorOn ? c.color : S.labelColor);
}
const toBlob = c => new Promise(r => c.toBlob(r, 'image/png'));

/* ---------- .nfo ---------- */
function nfo({ color, icon, bitmap, sort }) {
  const L = [];
  if (tipText()) L.push('Tip=' + tipText());
  L.push('HeightOfs=' + (+S.heightOfs || 0));
  L.push('Color=' + (color || ''));
  if (icon && icon !== 'none') L.push('IconIndex=' + icon);
  if (bitmap) L.push('Bitmap=' + bitmap);
  if (sort != null) L.push('SortGroup=' + sort);
  return L.join('\r\n') + '\r\n';
}

/* ---------- build output: [{path, blob} | {path, dir:true}] ---------- */
async function buildEntries() {
  await ensureFont(fontOf(S.font), S.size);
  const out = [], K = kitFolder(), root = K;
  const add = (path, blob) => out.push({ path, blob }), dir = p => out.push({ path: p, dir: true });
  dir(root);
  const bc = await bannerCanvas();
  if (bc) { dir(`${root}/images`); add(`${root}/images/banner.png`, await toBlob(bc)); }
  add(`${root}/${K}.nfo`, new Blob([nfo({ color: S.kitColorOn ? flColor(S.kitColor) : '', icon: S.kitIcon, bitmap: bc ? 'images/banner.png' : '' })]));
  dir(`${root}/${K}`); dir(`${root}/${K}/zimages`);
  for (let i = 0; i < S.cats.length; i++) {
    const c = S.cats[i], F = catFolder(c, i), base = `${root}/${K}`;
    add(`${base}/zimages/${i + 1}.png`, await toBlob(await labelCanvas(c, i)));
    add(`${base}/${F}.nfo`, new Blob([nfo({ color: c.colorOn ? flColor(c.color) : '', icon: c.icon, bitmap: `zimages/${i + 1}.png`, sort: S.sortGroup ? i + 1 : null })]));
    dir(`${base}/${F}`);
    const used = new Set(), dirs = new Set();
    FILES.filter(f => f.cat === c.id).forEach(f => {
      const sub = (f.sub || '').split('/').map(clean).filter(Boolean).join('/');
      const folder = `${base}/${F}${sub ? '/' + sub : ''}`;
      let p = `${folder}/${f.file.name}`;
      if (used.has(p.toLowerCase())) {
        const m = f.file.name.match(/^(.*?)(\.[^.]*)?$/); let n = 2;
        do { p = `${folder}/${m[1]} (${n++})${m[2] || ''}`; } while (used.has(p.toLowerCase()));
      }
      used.add(p.toLowerCase());
      if (sub) { let acc = `${base}/${F}`; sub.split('/').forEach(s => { acc += '/' + s; if (!dirs.has(acc)) { dirs.add(acc); dir(acc); } }); }
      add(p, f.file);
    });
  }
  return out;
}

/* ---------- zip writer (stored, no compression) ---------- */
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(u) { let c = 0xFFFFFFFF; for (let i = 0; i < u.length; i++) c = CRC[(c ^ u[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
async function makeZip(entries, prog) {
  const enc = new TextEncoder(), parts = [], central = [], d = new Date();
  let off = 0;
  const tm = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  const dt = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i], name = enc.encode(e.path + (e.dir ? '/' : ''));
    let crc = 0, size = 0;
    if (!e.dir) { const u = new Uint8Array(await e.blob.arrayBuffer()); crc = crc32(u); size = u.length; }
    const L = new DataView(new ArrayBuffer(30));
    L.setUint32(0, 0x04034b50, true); L.setUint16(4, 20, true); L.setUint16(6, 0x0800, true); L.setUint16(8, 0, true);
    L.setUint16(10, tm, true); L.setUint16(12, dt, true); L.setUint32(14, crc, true); L.setUint32(18, size, true); L.setUint32(22, size, true);
    L.setUint16(26, name.length, true); L.setUint16(28, 0, true);
    parts.push(L.buffer, name); if (!e.dir) parts.push(e.blob);
    const C = new DataView(new ArrayBuffer(46));
    C.setUint32(0, 0x02014b50, true); C.setUint16(4, 20, true); C.setUint16(6, 20, true); C.setUint16(8, 0x0800, true); C.setUint16(10, 0, true);
    C.setUint16(12, tm, true); C.setUint16(14, dt, true); C.setUint32(16, crc, true); C.setUint32(20, size, true); C.setUint32(24, size, true);
    C.setUint16(28, name.length, true); C.setUint32(38, e.dir ? 0x10 : 0, true); C.setUint32(42, off, true);
    central.push(C.buffer, name);
    off += 30 + name.length + size;
    if (prog) prog(i + 1, entries.length);
  }
  const cdSize = central.reduce((a, b) => a + b.byteLength, 0), E = new DataView(new ArrayBuffer(22));
  E.setUint32(0, 0x06054b50, true); E.setUint16(8, entries.length, true); E.setUint16(10, entries.length, true); E.setUint32(12, cdSize, true); E.setUint32(16, off, true);
  return new Blob([...parts, ...central, E.buffer], { type: 'application/zip' });
}

/* ---------- saving ---------- */
// Inside a claude.ai page, downloads go through the platform; everywhere else a normal download link works.
const dlP = (window.claude && typeof window.claude.use === 'function') ? window.claude.use('downloads').catch(() => null) : Promise.resolve(null);
function setStatus(msg, kind) { const s = $('status'); s.textContent = msg; s.className = 'status' + (kind ? ' ' + kind : ''); }
async function saveBlob(name, blob) {
  const dl = await dlP;
  if (dl) {
    try { await dl.save({ filename: name, data: blob }); return true; }
    catch (e) {
      const code = e && e.code;
      if (code === 'declined') return false;
      if (code === 'rate_limited') { setStatus('A save prompt is already open.', 'err'); return false; }
      if (code === 'too_large') { setStatus('This kit is too big to save here. Try "Save into a folder".', 'err'); return false; }
      throw e;
    }
  }
  const a = el('a', { href: URL.createObjectURL(blob), download: name });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 60000);
  return true;
}
$('dlZip').onclick = async () => {
  const btn = $('dlZip'); btn.disabled = true; setStatus('Building kit…');
  try {
    const entries = await buildEntries();
    const total = entries.reduce((a, e) => a + (e.blob ? e.blob.size : 0), 0);
    if (total > 3.9e9) { setStatus('Over 3.9 GB is too big for one zip. Use "Save into a folder".', 'err'); return; }
    const zip = await makeZip(entries, (i, n) => { if (i % 25 === 0) setStatus(`Packing ${i} of ${n}…`); });
    const ok = await saveBlob(kitFolder() + '.zip', zip);
    setStatus(ok ? `Saved ${kitFolder()}.zip (${fmtBytes(zip.size)})` : 'Save canceled.', ok ? 'ok' : '');
  } catch (e) { setStatus('Couldn\'t build the zip: ' + (e && e.message || e), 'err'); }
  finally { btn.disabled = false; }
};
if ('showDirectoryPicker' in window) $('writeDir').hidden = false;
$('writeDir').onclick = async () => {
  let root;
  try { root = await window.showDirectoryPicker({ mode: 'readwrite', id: 'flpatches' }); }
  catch (e) {
    if (e && e.name === 'AbortError') return;
    setStatus('Folder saving isn\'t allowed here. Use Download Kit instead.', 'err'); $('writeDir').hidden = true; return;
  }
  setStatus('Saving kit…');
  try {
    const entries = await buildEntries(); let n = 0;
    for (const e of entries) {
      const parts = e.path.split('/'), last = e.dir ? null : parts.pop();
      let d = root;
      for (const p of parts) d = await d.getDirectoryHandle(p, { create: true });
      if (!e.dir) { const fh = await d.getFileHandle(last, { create: true }); const w = await fh.createWritable(); await w.write(e.blob); await w.close(); }
      if (++n % 25 === 0) setStatus(`Saving ${n} of ${entries.length}…`);
    }
    setStatus(`Saved to "${root.name}/${kitFolder()}". Refresh FL's browser.`, 'ok');
  } catch (e) { setStatus('Saving stopped: ' + (e && e.message || e), 'err'); }
};

/* ---------- auto-sort by sample name ---------- */
function typeOf(s) {
  s = (s || '').toLowerCase();
  const w = t => new RegExp(`(^|[^a-z])${t}([^a-z]|$)`).test(s);
  if (/\.(mid|midi)$/.test(s)) return 'midi';
  if (/open|ride/.test(s) || w('oh')) return 'open';
  if (/808|bass/.test(s) || w('sub')) return '808';
  if (/clap/.test(s)) return 'clap';
  if (/snare|snr/.test(s)) return 'snare';
  if (/hat/.test(s) || w('hh') || w('ch')) return 'hat';
  if (/crash|cymbal/.test(s) || w('cym')) return 'crash';
  if (/kick/.test(s) || w('kik')) return 'kick';
  if (/perc|shaker|conga|bongo|tamb|cowbell|rim|tom/.test(s)) return 'perc';
  if (/vox|vocal|voice|chant|adlib|ad-lib/.test(s)) return 'vox';
  if (/sfx|riser|sweep|impact|reverse|transition|noise/.test(s) || w('fx')) return 'fx';
  if (/\.(sf2|sfz)$/.test(s) || /one ?shot|melod|synth|pluck|keys|piano|bell/.test(s)) return 'oneshot';
  return null;
}
function catType(n) {
  n = (n || '').toLowerCase();
  if (/midi/.test(n)) return 'midi'; if (/open/.test(n)) return 'open'; if (/808|bass/.test(n)) return '808';
  if (/clap/.test(n)) return 'clap'; if (/snare/.test(n)) return 'snare'; if (/hat|hh/.test(n)) return 'hat';
  if (/crash|cymbal/.test(n)) return 'crash'; if (/kick/.test(n)) return 'kick'; if (/perc/.test(n)) return 'perc';
  if (/vox|vocal|voice/.test(n)) return 'vox'; if (/fx|effect/.test(n)) return 'fx'; if (/one ?shot|soundfont|melod/.test(n)) return 'oneshot';
  return null;
}
const isBlank = c => !c.name.trim() && !c.img && !FILES.some(f => f.cat === c.id);
// Find the folder for a sample; create it (or name the empty starter folder) when none matches.
function folderFor(name, rel) {
  const t = typeOf(name) || typeOf(rel);
  if (!t) return null;
  let c = S.cats.find(c => catType(c.name) === t);
  if (c) return c.id;
  const blank = S.cats.find(isBlank);
  if (blank) { blank.name = TYPE_NAMES[t]; return blank.id; }
  c = newCat(TYPE_NAMES[t]);
  // keep a sensible drum-kit order when adding
  const rank = x => { const k = catType(x.name); return k ? TYPE_ORDER.indexOf(k) : 99; };
  const at = S.cats.findIndex(x => rank(x) > TYPE_ORDER.indexOf(t));
  if (at < 0) S.cats.push(c); else S.cats.splice(at, 0, c);
  return c.id;
}
function addFiles(list, targetCat) {
  let placed = 0, uns = 0;
  const before = S.cats.length;
  list.forEach(({ file, rel }) => {
    if (IGNORE.test(file.name)) return;
    let cat, sub = '';
    if (targetCat) { cat = targetCat; const parts = (rel || '').split('/'); parts.pop(); parts.shift(); sub = parts.join('/'); }
    else cat = folderFor(file.name, rel);
    if (cat) placed++; else uns++;
    FILES.push({ id: nid(), file, cat, sub });
  });
  renderCats(); schedule();
  const made = S.cats.length - before;
  if (!targetCat && list.length) {
    let msg = `Added ${placed} sample${placed === 1 ? '' : 's'}` + (made > 0 ? ` and ${made} new folder${made === 1 ? '' : 's'}` : '') + '.';
    if (uns) msg += ` ${uns} ${uns === 1 ? 'needs' : 'need'} a folder.`;
    setStatus(msg, uns ? 'err' : 'ok');
  }
}
async function readDrop(dt) {
  const out = [], items = [...(dt.items || [])].map(i => i.webkitGetAsEntry && i.webkitGetAsEntry()).filter(Boolean);
  if (!items.length) { [...dt.files].forEach(f => out.push({ file: f, rel: f.name })); return out; }
  async function walk(entry, path) {
    if (entry.isFile) await new Promise(r => entry.file(f => { out.push({ file: f, rel: path + f.name }); r(); }, () => r()));
    else if (entry.isDirectory) {
      const rd = entry.createReader(); let batch;
      do { batch = await new Promise(r => rd.readEntries(r, () => r([]))); for (const e of batch) await walk(e, path + entry.name + '/'); } while (batch.length);
    }
  }
  for (const e of items) await walk(e, '');
  return out;
}
let dragDepth = 0;
const hasFiles = e => e.dataTransfer && [...e.dataTransfer.types].includes('Files');
addEventListener('dragenter', e => { if (hasFiles(e)) dragDepth++; });
addEventListener('dragleave', () => { dragDepth = Math.max(0, dragDepth - 1); if (!dragDepth) $('dropveil').classList.remove('on'); });
addEventListener('dragover', e => {
  if (!hasFiles(e)) return; e.preventDefault();
  const onFolder = e.target.closest && e.target.closest('.folder');
  $('dropveil').classList.toggle('on', !onFolder);
  document.querySelectorAll('.folder.drag').forEach(x => { if (x !== onFolder) x.classList.remove('drag'); });
  if (onFolder) onFolder.classList.add('drag');
});
addEventListener('drop', async e => {
  if (!hasFiles(e)) return; e.preventDefault(); dragDepth = 0;
  $('dropveil').classList.remove('on');
  const card = e.target.closest && e.target.closest('.folder');
  document.querySelectorAll('.folder.drag').forEach(x => x.classList.remove('drag'));
  addFiles(await readDrop(e.dataTransfer), card ? card.dataset.id : null);
});
$('addFiles').onchange = e => { addFiles([...e.target.files].map(f => ({ file: f, rel: f.name })), null); e.target.value = ''; };

/* ---------- folders UI ---------- */
function folderSelect(cur, withPrompt) {
  const s = el('select');
  if (withPrompt) s.add(new Option('Choose folder…', ''));
  S.cats.forEach((c, i) => s.add(new Option(catFolder(c, i), c.id)));
  s.value = cur || '';
  return s;
}
function fileList(files) {
  const ul = el('ul', { className: 'flist' });
  files.forEach(f => {
    const name = (f.sub ? f.sub + '/' : '') + f.file.name;
    const sel = folderSelect(f.cat, !f.cat);
    sel.setAttribute('aria-label', 'Move ' + f.file.name);
    sel.onchange = () => { f.cat = sel.value || null; renderCats(); schedule(); };
    const x = el('button', { type: 'button', textContent: '×', title: 'Remove' });
    x.setAttribute('aria-label', 'Remove ' + f.file.name);
    x.onclick = () => { FILES = FILES.filter(g => g !== f); renderCats(); schedule(); };
    ul.append(el('li', {}, el('span', { className: 'fn', textContent: name, title: name }), sel, x));
  });
  return ul;
}
function renderUnsorted() {
  const box = $('unsorted'); box.innerHTML = '';
  const un = FILES.filter(f => !f.cat);
  if (!un.length) return;
  const rm = el('button', { type: 'button', className: 'link danger', textContent: 'Remove all' });
  rm.onclick = () => { FILES = FILES.filter(f => f.cat); renderCats(); schedule(); };
  box.append(el('div', { className: 'unsorted' },
    el('div', { className: 'head' }, el('b', { textContent: `${un.length} sample${un.length > 1 ? 's need' : ' needs'} a folder` }), rm),
    el('p', { className: 'note', textContent: 'Their names didn\'t match a drum type. Pick a folder for each, or they\'re left out.' }),
    fileList(un)));
}
function renderCats() {
  renderUnsorted();
  const wrap = $('cats'); wrap.innerHTML = '';
  S.cats.forEach((c, i) => {
    const mine = FILES.filter(f => f.cat === c.id);
    const open = expanded.has(c.id);
    const d = el('div', { className: 'folder' }); d.dataset.id = c.id;

    // summary row
    const ico = el('span', { className: 'ico', innerHTML: iconSVG(c.icon) });
    const idx = S.numbering ? el('span', { className: 'idx', textContent: i + 1 }) : null;
    const name = el('input', { type: 'text', className: 'name', value: c.name, placeholder: i === 0 ? 'Folder name, e.g. 808s' : 'Folder name' });
    name.setAttribute('aria-label', `Folder ${i + 1} name`);
    name.oninput = () => { c.name = name.value; if (lbl) lbl.placeholder = name.value || 'Same as folder name'; schedule(); };
    const count = el('span', { className: 'count', textContent: mine.length ? `${mine.length} sample${mine.length > 1 ? 's' : ''}` : '' });
    const chev = el('button', { type: 'button', className: 'chev', textContent: '›', title: open ? 'Hide options' : 'More options' });
    chev.setAttribute('aria-expanded', open); chev.setAttribute('aria-label', `Options for folder ${i + 1}`);
    chev.onclick = () => { open ? expanded.delete(c.id) : expanded.add(c.id); renderCats(); };
    d.append(el('div', { className: 'folder-row' }, ico, idx, name, count, chev));

    let lbl = null;
    if (open) {
      lbl = el('input', { type: 'text', value: c.label, placeholder: c.name || 'Same as folder name' });
      lbl.setAttribute('aria-label', 'Label text');
      lbl.oninput = () => { c.label = lbl.value; schedule(); };

      const isel = el('select'); fillIconSelect(isel); isel.setAttribute('aria-label', 'Icon');
      const inum = el('input', { type: 'number', min: 0, max: 200, className: 'num' }); inum.setAttribute('aria-label', 'Icon number');
      const known = c.icon === 'none' || KNOWN_ICONS.includes(String(c.icon));
      isel.value = known ? String(c.icon) : 'custom'; inum.value = known ? '' : c.icon; inum.hidden = known;
      isel.onchange = () => {
        if (isel.value === 'custom') { inum.hidden = false; inum.value = inum.value || '1'; c.icon = inum.value; inum.focus(); }
        else { inum.hidden = true; c.icon = isel.value; }
        ico.innerHTML = iconSVG(c.icon); schedule();
      };
      inum.oninput = () => { c.icon = inum.value || 'none'; ico.innerHTML = iconSVG(c.icon); schedule(); };

      const cb = el('input', { type: 'checkbox', checked: c.colorOn });
      const cc = el('input', { type: 'color', value: c.color, disabled: !c.colorOn }); cc.setAttribute('aria-label', 'Name color');
      cb.onchange = () => { c.colorOn = cb.checked; cc.disabled = !cb.checked; schedule(); };
      cc.oninput = () => { c.color = cc.value; schedule(); };

      let imgCtl;
      if (c.img) {
        const r = el('button', { type: 'button', className: 'link', textContent: 'Use generated label' });
        r.onclick = () => { c.img = null; renderCats(); schedule(); };
        imgCtl = el('div', { className: 'inline' }, el('span', { textContent: 'Your image' }), r);
      } else {
        const fid = 'img-' + c.id;
        const fi = el('input', { type: 'file', accept: 'image/*', id: fid, className: 'vh' });
        fi.onchange = () => { const f = fi.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { c.img = r.result; renderCats(); schedule(); }; r.readAsDataURL(f); };
        imgCtl = el('div', { className: 'inline' }, el('label', { className: 'link', htmlFor: fid, textContent: 'Upload your own…' }), fi);
      }

      const grid = el('div', { className: 'grid' },
        el('span', { textContent: 'Label text' }), lbl,
        el('span', { textContent: 'Icon' }), el('div', { className: 'inline' }, isel, inum),
        el('span', { textContent: 'Name color' }), el('label', { className: 'check' }, cb, cc),
        el('span', { textContent: 'Label image' }), imgCtl);

      const fid2 = 'add-' + c.id;
      const af = el('input', { type: 'file', multiple: true, id: fid2, className: 'vh' });
      af.onchange = () => { addFiles([...af.files].map(f => ({ file: f, rel: f.name })), c.id); af.value = ''; };
      const dz = el('div', { className: 'dropzone' }, 'Drop samples here or ', el('label', { className: 'link', htmlFor: fid2, textContent: 'choose files' }), af);

      const mk = (txt, fn, cls, dis) => { const b = el('button', { type: 'button', className: 'link' + (cls ? ' ' + cls : ''), textContent: txt, disabled: !!dis }); b.onclick = fn; return b; };
      const acts = el('div', { className: 'folder-actions' },
        mk('Move up', () => { S.cats.splice(i - 1, 0, S.cats.splice(i, 1)[0]); renderCats(); schedule(); }, '', i === 0),
        mk('Move down', () => { S.cats.splice(i + 1, 0, S.cats.splice(i, 1)[0]); renderCats(); schedule(); }, '', i === S.cats.length - 1),
        mk('Delete folder', () => {
          const n = mine.length; S.cats.splice(i, 1); expanded.delete(c.id);
          FILES.forEach(f => { if (f.cat === c.id) f.cat = null; });
          if (!S.cats.length) S.cats.push(newCat());
          renderCats(); schedule();
          setStatus(`Deleted "${catName(c, i)}".` + (n ? ` Its ${n} samples need a new folder.` : ''));
        }, 'danger'));

      d.append(el('div', { className: 'folder-more' }, grid, dz, mine.length ? fileList(mine) : null, acts));
    }
    wrap.appendChild(d);
  });
}
$('addCat').onclick = () => {
  const c = newCat(); S.cats.push(c); renderCats(); schedule();
  const ins = $('cats').querySelectorAll('input.name'); ins[ins.length - 1].focus();
};

/* ---------- kit & style controls ---------- */
function bind(id, key, kind) {
  const e = $(id), get = () => kind === 'check' ? e.checked : kind === 'num' ? +e.value : e.value;
  if (kind === 'check') e.checked = !!S[key]; else e.value = S[key];
  const h = () => { S[key] = get(); schedule(); };
  e.addEventListener('input', h); e.addEventListener('change', h);
}
fillIconSelect($('kitIcon'));
FONTS.forEach(f => $('font').add(new Option(f.label, f.id)));
[['kitName', 'kitName'], ['tip', 'tip'], ['kitColor', 'kitColor'], ['bannerSub', 'bannerSub'], ['bannerBg', 'bannerBg'], ['bannerInk', 'bannerInk'],
 ['font', 'font'], ['labelColor', 'labelColor'], ['outlineColor', 'outlineColor'], ['colorOrder', 'colorOrder']].forEach(([a, b]) => bind(a, b));
[['kitColorOn', 'kitColorOn'], ['bannerFit', 'bannerFit'], ['matchColor', 'matchColor'], ['shadow', 'shadow'], ['numbering', 'numbering'], ['sortGroup', 'sortGroup']].forEach(([a, b]) => bind(a, b, 'check'));
[['bannerW', 'bannerW'], ['size', 'size'], ['outline', 'outline'], ['lw', 'lw'], ['lh', 'lh'], ['heightOfs', 'heightOfs']].forEach(([a, b]) => bind(a, b, 'num'));
$('kitIcon').value = KNOWN_ICONS.includes(S.kitIcon) || S.kitIcon === 'none' ? S.kitIcon : '52';
[...$('kitIcon').options].forEach(o => { if (o.value === 'custom') o.remove(); });
$('kitIcon').onchange = () => { S.kitIcon = $('kitIcon').value; schedule(); };
$('numbering').addEventListener('change', () => renderCats());
$('bannerFile').onchange = e => {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader(); r.onload = () => { S.bannerData = r.result; S.bannerMode = 'image'; syncSeg(); schedule(); }; r.readAsDataURL(f);
  e.target.value = '';
};
function syncSeg() {
  document.querySelectorAll('#bannerMode button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.bannerMode));
  $('bannerImageOpts').hidden = S.bannerMode !== 'image';
  $('bannerTextOpts').hidden = S.bannerMode !== 'text';
  document.querySelectorAll('#zoom button').forEach(b => b.setAttribute('aria-pressed', +b.dataset.v === S.zoom));
}
document.querySelectorAll('#bannerMode button').forEach(b => b.onclick = () => { S.bannerMode = b.dataset.v; syncSeg(); schedule(); });
document.querySelectorAll('#zoom button').forEach(b => b.onclick = () => { S.zoom = +b.dataset.v; syncSeg(); schedule(); });

/* ---------- preview ---------- */
let pending = false, ver = 0;
function schedule() { if (pending) return; pending = true; requestAnimationFrame(() => { pending = false; renderPreview(); }); }
async function renderPreview() {
  const my = ++ver; save();
  $('sizeVal').textContent = S.size + ' px';
  $('outlineVal').textContent = S.outline ? S.outline + ' px' : 'Off';
  $('kitColor').disabled = !S.kitColorOn; $('outlineColor').disabled = !S.outline;
  $('bannerValue').textContent = { text: 'Text', image: S.bannerData ? 'Image' : 'Image (none chosen)', none: 'None' }[S.bannerMode];
  $('styleValue').textContent = `${fontOf(S.font).label}, ${S.size} px`;

  await ensureFont(fontOf(S.font), S.size);
  const bc = await bannerCanvas().catch(() => null);
  const labels = [];
  for (let i = 0; i < S.cats.length; i++) labels.push(await labelCanvas(S.cats[i], i).catch(() => null));
  if (my !== ver) return;

  const fl = $('fl'), z = S.zoom, gap = Math.round((+S.heightOfs || 0) * z * .6);
  fl.innerHTML = ''; fl.classList.toggle('zoom', z > 1);
  const row = (icon, text, color, indent) => {
    const t = el('span', { textContent: text }); if (color) t.style.color = color;
    const r = el('div', { className: 'fl-row' }, el('span', { innerHTML: iconSVG(icon, z), style: 'display:inline-flex;gap:3px;align-items:center' }), t);
    r.style.cssText += `padding-left:${indent}px;font-size:${13 * z}px;height:${22 * z}px`;
    fl.appendChild(r);
  };
  const img = (cv, indent) => {
    if (!cv) return;
    const i = el('img', { src: cv.toDataURL(), width: cv.width * z, height: cv.height * z, alt: '' });
    i.style.cssText = `margin:1px 0 ${gap}px ${indent}px`;
    fl.appendChild(i);
  };
  row(S.kitIcon, kitFolder(), S.kitColorOn ? S.kitColor : '', 8 * z); img(bc, 30 * z);
  S.cats.forEach((c, i) => { row(c.icon, catFolder(c, i), c.colorOn ? c.color : '', 26 * z); img(labels[i], 48 * z); });

  const placed = FILES.filter(f => f.cat), bytes = placed.reduce((a, f) => a + f.file.size, 0), un = FILES.length - placed.length;
  $('summary').textContent = `${S.cats.length} folder${S.cats.length === 1 ? '' : 's'} · ${placed.length} sample${placed.length === 1 ? '' : 's'}` + (bytes ? ` · ${fmtBytes(bytes)}` : '') + (un ? ` · ${un} unsorted` : '');
  const names = S.cats.map((c, i) => catFolder(c, i).toLowerCase()), dup = names.find((n, i) => names.indexOf(n) !== i);
  if (dup) setStatus(`Two folders are named "${dup}". Rename one so they don't merge.`, 'err');

  const K = kitFolder();
  let t = `${K}/\n├─ ${K}.nfo\n` + (bc ? `├─ images/banner.png\n` : '') + `└─ ${K}/\n   ├─ zimages/  (label images)\n`;
  S.cats.forEach((c, i) => { const F = catFolder(c, i), n = FILES.filter(f => f.cat === c.id).length, last = i === S.cats.length - 1; t += `   ├─ ${F}.nfo\n   ${last ? '└' : '├'}─ ${F}/${n ? `  (${n} samples)` : ''}\n`; });
  $('tree').textContent = t;
}

syncSeg(); renderCats(); renderPreview();
