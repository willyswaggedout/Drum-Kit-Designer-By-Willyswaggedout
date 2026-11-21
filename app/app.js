"use strict";
/* Drum Kit Builder — builds FL Studio drum kit folders with .nfo files,
   label images and banners. Plain JS, no build step, so it runs in a
   browser, as a published page, or inside the Electron desktop wrapper. */

/* ---------- constants ---------- */
const FONTS = [
  { id: 'arialbold', label: 'Arial Bold', css: 'Arial, Helvetica, sans-serif', w: '700' },
  { id: 'arialblack', label: 'Arial Black', css: '"Arial Black", Arial, sans-serif', w: '900' },
  { id: 'segoe', label: 'Segoe UI Bold', css: '"Segoe UI", system-ui, sans-serif', w: '700' },
  { id: 'ahgbold', label: 'Alte Haas Grotesk Bold', css: '"Alte Haas Grotesk", Arial, sans-serif', w: '700', web: 'Alte Haas Grotesk' },
  { id: 'ahgregular', label: 'Alte Haas Grotesk', css: '"Alte Haas Grotesk", Arial, sans-serif', w: '400', web: 'Alte Haas Grotesk' },
  { id: 'impact', label: 'Impact', css: 'Impact, "Arial Narrow", sans-serif', w: '400' },
  { id: 'verdana', label: 'Verdana Bold', css: 'Verdana, sans-serif', w: '700' },
  { id: 'bebas', label: 'Bebas Neue', css: '"Bebas Neue", sans-serif', w: '400', web: 'Bebas Neue' },
  { id: 'anton', label: 'Anton', css: 'Anton, sans-serif', w: '400', web: 'Anton' },
  { id: 'blackops', label: 'Black Ops One', css: '"Black Ops One", sans-serif', w: '400', web: 'Black Ops One' },
  { id: 'russo', label: 'Russo One', css: '"Russo One", sans-serif', w: '400', web: 'Russo One' },
  { id: 'bungee', label: 'Bungee', css: 'Bungee, sans-serif', w: '400', web: 'Bungee' },
  { id: 'marker', label: 'Permanent Marker', css: '"Permanent Marker", cursive', w: '400', web: 'Permanent Marker' },
  { id: 'pixel', label: 'Press Start 2P', css: '"Press Start 2P", monospace', w: '400', web: 'Press Start 2P' },
  { id: 'rubikmono', label: 'Rubik Mono One', css: '"Rubik Mono One", sans-serif', w: '400', web: 'Rubik Mono One' },
  { id: 'punk1', label: '1 Punk', css: '"DKB 1 Punk", sans-serif', w: '400', web: 'DKB 1 Punk' },
  { id: 'badcoma', label: 'Bad Coma', css: '"DKB Bad Coma", sans-serif', w: '400', web: 'DKB Bad Coma' },
  { id: 'cityburn', label: 'City Burn', css: '"DKB City Burn", sans-serif', w: '400', web: 'DKB City Burn' },
  { id: 'fingerprinted', label: 'Finger Printed', css: '"DKB Finger Printed", sans-serif', w: '400', web: 'DKB Finger Printed' },
  { id: 'hh', label: 'SF Hollywood Hills', css: '"DKB SF Hollywood Hills", sans-serif', w: '400', web: 'DKB SF Hollywood Hills' },
  { id: 'hhbold', label: 'SF Hollywood Hills Bold', css: '"DKB SF Hollywood Hills Bold", sans-serif', w: '400', web: 'DKB SF Hollywood Hills Bold' },
  { id: 'hhital', label: 'SF Hollywood Hills Italic', css: '"DKB SF Hollywood Hills Italic", sans-serif', w: '400', web: 'DKB SF Hollywood Hills Italic' },
  { id: 'hhbolditl', label: 'SF Hollywood Hills Bold Italic', css: '"DKB SF Hollywood Hills Bold Italic", sans-serif', w: '400', web: 'DKB SF Hollywood Hills Bold Italic' },
  { id: 'hhcond', label: 'SF Hollywood Hills Condensed', css: '"DKB SF Hollywood Hills Condensed", sans-serif', w: '400', web: 'DKB SF Hollywood Hills Condensed' },
  { id: 'hhcondital', label: 'SF Hollywood Hills Condensed Italic', css: '"DKB SF Hollywood Hills Condensed Italic", sans-serif', w: '400', web: 'DKB SF Hollywood Hills Condensed Italic' },
  { id: 'hhext', label: 'SF Hollywood Hills Extended', css: '"DKB SF Hollywood Hills Extended", sans-serif', w: '400', web: 'DKB SF Hollywood Hills Extended' },
  { id: 'hhextital', label: 'SF Hollywood Hills Extended Italic', css: '"DKB SF Hollywood Hills Extended Italic", sans-serif', w: '400', web: 'DKB SF Hollywood Hills Extended Italic' },
  { id: 'impacted', label: 'Impacted', css: '"DKB Impacted", sans-serif', w: '400', web: 'DKB Impacted' },
  { id: 'lowerres', label: 'Lower Resolution', css: '"DKB Lower Resolution", sans-serif', w: '400', web: 'DKB Lower Resolution' },
  { id: 'romantic', label: 'New Romantics', css: '"DKB New Romantics", sans-serif', w: '400', web: 'DKB New Romantics' },
  { id: 'sidewalk', label: 'Sidewalk', css: '"DKB Sidewalk", sans-serif', w: '400', web: 'DKB Sidewalk' },
  { id: 'system', label: 'System', css: '"DKB System", sans-serif', w: '400', web: 'DKB System' },
  { id: 'undertown', label: 'Undertown', css: '"DKB Undertown", sans-serif', w: '400', web: 'DKB Undertown' }
];
// icons offered in the pickers: the plain folder, FL's drum and instrument icons, numbers and fun ones
const ICONS = [['none', 'Folder'], ['52', 'Star'], ['7', 'Audio bars'], ['55', 'Cloud'], ['34', 'Piano keys'], ['773', 'Kick drum'], ['772', 'Snare drum'], ['1007', 'Hi-hat'], ['900', 'Clap'], ['899', 'Snap'], ['774', 'Cymbal'], ['775', 'Bongos'], ['889', 'Cowbell'], ['896', 'Tambourine'], ['897', 'Shaker'], ['847', 'Triangle'], ['846', 'Bell'], ['848', 'Gong'], ['857', 'Chimes'], ['849', 'Glockenspiel'], ['879', 'Drum machine'], ['891', 'Pads'], ['880', 'Whistle'], ['798', 'Microphone'], ['788', 'Lips'], ['789', 'Male voice'], ['790', 'Female voice'], ['791', 'Robot voice'], ['786', 'Sample'], ['787', 'Sliced loop'], ['843', 'Waveform'], ['838', 'Music note'], ['781', 'Treble clef'], ['782', 'Bass clef'], ['856', 'Vinyl record'], ['800', 'CD'], ['796', 'Headphones'], ['797', 'Speaker'], ['795', 'Megaphone'], ['780', 'Piano'], ['769', 'Acoustic guitar'], ['770', 'Electric guitar'], ['858', 'Banjo'], ['771', 'Violin'], ['779', 'Harp'], ['776', 'Trumpet'], ['888', 'Saxophone'], ['859', 'Flute'], ['778', 'Pan flute'], ['777', 'Organ'], ['784', 'Saw wave'], ['785', 'Square wave'], ['783', 'Tuning fork'], ['904', 'Zero'], ['827', 'One'], ['828', 'Two'], ['829', 'Three'], ['830', 'Four'], ['831', 'Five'], ['832', 'Six'], ['833', 'Seven'], ['834', 'Eight'], ['835', 'Nine'], ['894', 'Flame'], ['884', 'Crown'], ['934', 'Lightning'], ['902', 'Snowflake'], ['901', 'Cloud (big)'], ['898', 'Globe'], ['865', 'Smiley'], ['866', 'Sad face'], ['876', 'Silly face'], ['811', 'Thumbs up'], ['812', 'Thumbs down'], ['813', 'Pixel man'], ['806', 'Eye'], ['792', 'Flower'], ['874', 'Gift'], ['49', 'Shopping cart'], ['48', 'New'], ['40', 'Person'], ['970', 'House'], ['860', 'Padlock'], ['875', 'Magnet'], ['873', 'Battery'], ['867', 'Clock'], ['886', 'Paper plane'], ['871', 'Scissors'], ['868', 'Pencil'], ['863', 'Wrench'], ['872', 'Gear'], ['862', 'Bandage'], ['861', 'Link'], ['869', 'No sign'], ['809', 'Question mark'], ['805', 'Info'], ['893', 'Building block'], ['1009', 'Palette'], ['custom', 'Other number…']];
const KNOWN_ICONS = ICONS.map(o => o[0]).filter(v => v !== 'none' && v !== 'custom');
// Folder names created automatically when dropped samples have no matching folder.
const TYPE_NAMES = { '808': '808s', kick: 'Kicks', clap: 'Claps', snare: 'Snares', hat: 'Hihats', open: 'Open hats', crash: 'Crash', perc: 'Percs', vox: 'Vox', fx: 'Fx', oneshot: 'Oneshots', midi: 'MIDI' };
const TYPE_ORDER = ['808', 'kick', 'clap', 'snare', 'hat', 'open', 'crash', 'perc', 'vox', 'fx', 'oneshot', 'midi'];
const IGNORE = /^(\..*|desktop\.ini|thumbs\.db)$/i;
const STORE_KEY = 'dkb-v2';

let uid = 1;
const nid = () => 'c' + (uid++) + Math.random().toString(36).slice(2, 6);
const newCat = (name = '', icon = '7') => ({ id: nid(), name, label: '', icon, colorOn: true, color: '#FFFFFF', img: null, imgMode: 'fit', imgPos: null, imgH: null });

function defaultState() {
  return {
    kitName: '', tip: '', kitIcon: '52', kitColorOn: false, kitColor: '#C7CBD1',
    bannerMode: 'text', bannerFit: true, bannerW: 250, bannerData: null, bannerSub: '', bannerBg: '#3A3F46', bannerInk: '#FFFFFF', bannerBgMode: 'none', bannerBgImage: null, bannerBgPos: null, bannerFont: 'arialbold', tagFont: 'segoe', kitInk: '#FFFFFF', tagInk: '#FFFFFF', kitOutline: 0, kitOutlineColor: '#000000', kitShadow: false, tagOutline: 0, tagOutlineColor: '#000000', tagShadow: false, kitSize: null, tagSize: null, kitPos: null, tagPos: null, bannerSize: 'original', bannerCrop: null,
    font: 'arialbold', size: 20, labelColor: '#FFFFFF', matchColor: false, outline: 0, outlineColor: '#000000', shadow: 0,
    lw: 200, lh: 20, heightOfs: 5, colorOrder: 'bgr', numbering: true, sortGroup: true, hideImgs: true, zoom: 1.5, zoomDefault: 15, sortDefault: 1,
    cats: [newCat()]
  };
}
/* label drop shadow is an amount in px (0 = off); older saves stored on/off */
const shAmt = v => v === true ? 1 : Math.max(0, +v || 0);
const normShadow = () => { S.shadow = shAmt(S.shadow); S.cats.forEach(c => { if (c.ls && c.ls.shadow !== undefined) c.ls.shadow = shAmt(c.ls.shadow); }); };
/* turns saved data (from localStorage, the session store or a template) into a full, current state object */
function hydrate(parsed) {
  const s = Object.assign(defaultState(), parsed);
  if (!parsed.bannerFont) s.bannerFont = s.font;
  if (!parsed.kitInk) s.kitInk = s.tagInk = s.bannerInk || '#FFFFFF';
  if (!s.cats || !s.cats.length) s.cats = [newCat()];
  s.cats.forEach(c => { if (!c.id) c.id = nid(); if (!c.name.trim() && c.label) c.name = c.label; c.label = ''; });
  if (/^altehaas/.test(s.font)) s.font = 'arialbold';
  s.bannerMode = 'text';
  if (parsed.zoomDefault !== 15) { s.zoom = 1.5; s.zoomDefault = 15; }
  if (parsed.sortDefault !== 1) { s.sortGroup = true; s.sortDefault = 1; }
  return s;
}
let S = defaultState(), HAD_SAVE = false, SAVED_IN_IDB = false;
try {
  const raw = localStorage.getItem(STORE_KEY); HAD_SAVE = !!raw;
  if (raw) { const parsed = JSON.parse(raw); if (parsed && parsed.__idb) SAVED_IN_IDB = true; else S = hydrate(parsed); }
} catch (e) { /* storage unavailable: start fresh */ }
normShadow();

let FILES = []; // { id, file, cat|null, sub }
const expanded = new Set();
const selectedCats = new Set();
const $ = id => document.getElementById(id);

/* ---------- helpers ---------- */
const clean = s => String(s || '').replace(/[<>:"/\\|?*\x00-\x1F]/g, '').replace(/[. ]+$/, '').trim();
const kitFolder = () => clean(S.kitName) || 'My Drum Kit';
const tipText = () => S.tip.trim();
const catName = (c, i) => clean(c.name) || 'Folder ' + (i + 1);
const catFolder = (c, i) => S.numbering ? `${i + 1} ${catName(c, i)}` : catName(c, i);
const catLabel = (c, i) => c.name.trim() || 'Folder ' + (i + 1);
function flColor(hex) {
  if (!hex) return '';
  const h = hex.replace('#', '').toUpperCase(), r = h.slice(0, 2), g = h.slice(2, 4), b = h.slice(4, 6);
  return '$' + (S.colorOrder === 'bgr' ? b + g + r : r + g + b);
}
function fmtBytes(n) { if (n < 1024) return n + ' B'; if (n < 1048576) return (n / 1024).toFixed(0) + ' KB'; if (n < 1073741824) return (n / 1048576).toFixed(1) + ' MB'; return (n / 1073741824).toFixed(2) + ' GB'; }
let PREVIEW = false; // true while a font is only being hovered: nothing is saved or added to undo
let SESS_HOOK = null; // set by the autosave block further down
function save() {
  if (PREVIEW) return;
  try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); }
  catch (e) { try { localStorage.setItem(STORE_KEY, '{"__idb":1}'); } catch (e2) { } } // too big for localStorage: the session store keeps it
  if (SESS_HOOK) SESS_HOOK(true);
}
const fontOf = id => FONTS.find(f => f.id === id) || FONTS[0];
async function ensureFont(f, px) { if (!f.web || !document.fonts) return; try { await document.fonts.load(`${f.w} ${px}px "${f.web}"`); } catch (e) { } }
function el(tag, props = {}, ...kids) { const e = document.createElement(tag); Object.assign(e, props); kids.forEach(k => k != null && e.append(k)); return e; }

// copy / paste / done glyphs for the small copy-paste buttons
const COPY_SVG = '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10.5 3.8V3.6c0-1-.7-1.6-1.6-1.6H3.6C2.6 2 2 2.700 2 3.600v5.300c0 .9.6 1.600 1.600 1.600h.2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
const PASTE_SVG = '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><rect x="3" y="3" width="10" height="11" rx="1.8" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="5.7" y="1.7" width="4.6" height="2.8" rx="1" fill="var(--surface)" stroke="currentColor" stroke-width="1.5"/></svg>';
const CHECK_SVG = '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
/* ---------- icons (simple drawings that stand in for FL's own) ---------- */
function iconSVG(idx, z = 1, tint = '') {
  const k = String(idx), s = (w, h) => `width="${w * z}" height="${h * z}"`, T = d => tint || d;
  // FL Studio's own icon when the desktop app found FL Studio on this computer; otherwise the
  // program's own drawing of it
  if (k !== 'none' && window.FLI && FLI.ok && FLI.has(k)) return `<span class="fli" style="font-size:${15 * z}px;color:${tint || '#C7CBD1'}" aria-hidden="true">${FLI.char(k)}</span>`;
  const D = window.DKD_DRAWN_ICONS && DKD_DRAWN_ICONS[k];
  if (D) return `<svg ${s(15, 15)} viewBox="0 0 16 16" style="color:${tint || '#C7CBD1'}" aria-hidden="true">${D}</svg>`;
  if (k === '7') return `<svg ${s(14, 14)} viewBox="0 0 14 14" aria-hidden="true"><rect x="1" y="9" width="2.4" height="4" fill="${T('#C7CBD1')}"/><rect x="5" y="6" width="2.4" height="7" fill="${T('#C7CBD1')}"/><rect x="9" y="2" width="2.4" height="11" fill="${T('#C7CBD1')}"/></svg>`;
  if (k === '52') return `<svg ${s(15, 15)} viewBox="0 0 24 24" aria-hidden="true"><path fill="${T('#AEB8D0')}" d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z"/></svg>`;
  if (k === '55') return `<svg ${s(16, 14)} viewBox="0 0 24 18" aria-hidden="true"><path fill="${T('#E6E8EB')}" d="M6 17h13a5 5 0 0 0 .6-9.96A7 7 0 0 0 6.2 6.1 5.5 5.5 0 0 0 6 17z"/></svg>`;
  if (k === '34') return `<svg ${s(15, 14)} viewBox="0 0 15 14" aria-hidden="true"><rect x=".5" y=".5" width="14" height="13" fill="${T('#E6E8EB')}"/><rect x="3" y="1" width="2" height="7" fill="#1E1F21"/><rect x="7" y="1" width="2" height="7" fill="#1E1F21"/><rect x="11" y="1" width="2" height="7" fill="#1E1F21"/><path d="M5 8v5M10 8v5" stroke="#1E1F21"/></svg>`;
  const folder = `<svg ${s(15, 13)} viewBox="0 0 15 13" aria-hidden="true"><path fill="none" stroke="${T('#9CA3AD')}" d="M.5 2.5v9.5h14V3.5H7L5.5 1.5h-5z"/></svg>`;
  return k === 'none' ? folder : folder + `<span class="fl-badge">#${k}</span>`;
}
// small picture for a menu row or button: FL's icon, or its number when the icon font isn't loaded
function iconChip(v) {
  if (v === 'custom' || v === '') return '';
  const drawn = (window.FLI && FLI.ok) || (window.DKD_DRAWN_ICONS && DKD_DRAWN_ICONS[v]) || ['none', '7', '52', '55', '34'].includes(String(v));
  return drawn ? iconSVG(v, 1) : `<span class="ic-num">${v}</span>`;
}
function fillIconSelect(sel) { sel.innerHTML = ''; ICONS.forEach(([v, t]) => sel.add(new Option(t, v))); }

/* ---------- image rendering ---------- */
/* label look for one folder: its own overrides (c.ls) on top of the global Label style */
function labelStyle(c) {
  const o = c.ls || {};
  return {
    font: o.font ?? S.font, size: o.size ?? S.size,
    color: o.color ?? (S.matchColor && c.colorOn ? c.color : S.labelColor),
    outline: o.outline ?? S.outline, outlineColor: o.outlineColor ?? S.outlineColor, shadow: shAmt(o.shadow ?? S.shadow)
  };
}
/* Preview sharpness: images for the preview can be drawn at a higher pixel density (rs) so they stay
   crisp when the preview is zoomed. Logical size stays the same (kept on the canvas as lw/lh), so
   every layout and editor works in the same units; exported files are always drawn at rs = 1. */
function sizeCanvas(c, w, h, rs) {
  c.width = Math.max(1, Math.round(w * rs)); c.height = Math.max(1, Math.round(h * rs)); c.lw = w; c.lh = h;
  const x = c.getContext('2d'); x.setTransform(rs, 0, 0, rs, 0, 0); return x;
}
const lwOf = c => c.lw || c.width, lhOf = c => c.lh || c.height;
function renderLabel(text, st, rs = 1) {
  const f = fontOf(st.font), c = document.createElement('canvas');
  let x = sizeCanvas(c, S.lw, S.lh, rs), pad = 3, ow = +st.outline || 0;
  let size = st.size;
  const setF = () => { x.font = `${f.w} ${size}px ${f.css}`; };
  setF();
  /* up to the old 20 px maximum, long text shrinks to fit; above it the label grows instead, so the size you pick is the size you get */
  let wide = S.lw;
  if (size <= 20) { while (size > 7 && x.measureText(text).width > S.lw - pad * 2 - ow * 2) { size--; setF(); } }
  else wide = Math.max(S.lw, Math.ceil(x.measureText(text).width) + pad * 2 + Math.ceil(ow) * 2 + 2);
  x.textBaseline = 'middle';
  const m = x.measureText(text), asc = Math.ceil(m.actualBoundingBoxAscent || size * .5), desc = Math.ceil(m.actualBoundingBoxDescent || size * .5);
  const margin = Math.ceil(ow) + (st.shadow ? Math.ceil(st.shadow * 2) + 1 : 1), need = asc + desc + margin * 2;
  let y = Math.round(S.lh / 2) + 1;
  if (need > S.lh || wide > S.lw) {
    x = sizeCanvas(c, wide, Math.max(need, S.lh), rs); setF(); x.textBaseline = 'middle';
    if (need > S.lh) y = Math.round((need + asc - desc) / 2);
  }
  const tx = pad + ow;
  if (st.shadow) { x.shadowColor = 'rgba(0,0,0,.8)'; x.shadowOffsetX = st.shadow * rs; x.shadowOffsetY = st.shadow * rs; x.shadowBlur = st.shadow * rs; } // shadows ignore the scale, so they're scaled by hand
  if (ow > 0) { x.lineJoin = 'round'; x.lineWidth = ow * 2; x.strokeStyle = st.outlineColor; x.strokeText(text, tx, y); x.shadowColor = 'transparent'; }
  x.fillStyle = st.color; x.fillText(text, tx, y);
  return c;
}
/* background image placement: stored as fractions of the banner so it survives size changes */
function bgCover(img, W, H) { const sc = Math.max(W / img.naturalWidth, H / img.naturalHeight); return { w: img.naturalWidth * sc, h: img.naturalHeight * sc }; }
function bgGeom(img, W, H) {
  const ar = img.naturalWidth / img.naturalHeight, p = S.bannerBgPos;
  if (p && p.id === S.bannerBgImage) { const w = p.fw * W; return { x: p.fx * W, y: p.fy * H, w, h: p.fh ? p.fh * H : w / ar }; }
  const c = bgCover(img, W, H); return { x: (W - c.w) / 2, y: (H - c.h) / 2, w: c.w, h: c.h };
}
function setBgGeom(g, W, H) { S.bannerBgPos = { id: S.bannerBgImage, fx: g.x / W, fy: g.y / H, fw: g.w / W, fh: g.h / H }; }
/* where the kit name and the @ sit on the banner (positions are fractions of it, sizes are px) */
function bannerLayout(W, H) {
  const m = document.createElement('canvas').getContext('2d');
  const title = kitFolder(), sub = tipText(), tf = fontOf(S.bannerFont), gf = fontOf(S.tagFont);
  let size = S.kitSize || Math.round(H * .48);
  const setT = () => { m.font = `${tf.w} ${size}px ${tf.css}`; };
  setT();
  if (!S.kitSize) while (size > 9 && m.measureText(title).width > W - 16) { size--; setT(); }
  const tw = m.measureText(title).width, kp = S.kitPos;
  const out = { title: { text: title, font: tf, size, w: tw, h: size * 1.1, x: kp ? kp.fx * W : W / 2, y: kp ? kp.fy * H : (sub ? H * .42 : H / 2) } };
  const gsize = S.tagSize || Math.max(9, Math.round(H * .19));
  out.tagSize = gsize;
  if (sub) {
    m.font = `${gf.w} ${gsize}px ${gf.css}`; const gp = S.tagPos;
    out.tag = { text: sub, font: gf, size: gsize, w: m.measureText(sub).width, h: gsize * 1.1, x: gp ? gp.fx * W : W / 2, y: gp ? gp.fy * H : H * .78 };
  }
  return out;
}
async function renderTextBanner(rs = 1) {
  const W = +S.bannerW || 250, H = Math.round(W * 63 / 250), c = document.createElement('canvas');
  const x = sizeCanvas(c, W, H, rs), f = fontOf(S.font);
  let onImage = false;
  if (S.bannerBgMode === 'color') { x.fillStyle = S.bannerBg; x.fillRect(0, 0, W, H); }
  else if (S.bannerBgMode === 'image' && S.bannerBgImage) {
    const rec = BGIMGS.find(r => r.id === S.bannerBgImage);
    if (rec) {
      try {
        const img = await loadImg(rec.data);
        const g = bgGeom(img, W, H);
        x.drawImage(img, g.x, g.y, g.w, g.h);
        onImage = true;
      } catch (e) { }
    }
  }
  if (onImage) { x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 4 * rs; x.shadowOffsetY = 1 * rs; }
  const L = bannerLayout(W, H);
  x.textAlign = 'center'; x.textBaseline = 'middle';
  const put = (t, ink, ow, oc, sh, alpha) => {
    x.save(); x.font = `${t.font.w} ${t.size}px ${t.font.css}`; x.globalAlpha = alpha;
    if (sh) { x.shadowColor = 'rgba(0,0,0,.8)'; x.shadowOffsetX = rs; x.shadowOffsetY = rs; x.shadowBlur = rs; }
    if (ow > 0) { x.lineJoin = 'round'; x.lineWidth = ow * 2; x.strokeStyle = oc; x.strokeText(t.text, t.x, t.y); x.shadowColor = 'transparent'; }
    x.fillStyle = ink; x.fillText(t.text, t.x, t.y); x.restore();
  };
  put(L.title, S.kitInk, +S.kitOutline || 0, S.kitOutlineColor, S.kitShadow, 1);
  if (L.tag) put(L.tag, S.tagInk, +S.tagOutline || 0, S.tagOutlineColor, S.tagShadow, .8);
  return c;
}
const imgCache = new Map();
function loadImg(src) {
  if (!imgCache.has(src)) imgCache.set(src, new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }));
  return imgCache.get(src);
}
async function renderImageBanner(rs = 1) {
  if (!S.bannerData) return null;
  const img = await loadImg(S.bannerData), iw = img.naturalWidth, ih = img.naturalHeight;
  const c = document.createElement('canvas'); let x;
  if (S.bannerSize === 'auto') {
    x = sizeCanvas(c, 250, 63, rs); x.imageSmoothingQuality = 'high';
    const sc = Math.max(250 / iw, 63 / ih), w = iw * sc, h = ih * sc;
    x.drawImage(img, (250 - w) / 2, (63 - h) / 2, w, h);
  } else if (S.bannerSize === 'crop' && S.bannerCrop) {
    const r = S.bannerCrop;
    x = sizeCanvas(c, r.w, r.h, rs); x.imageSmoothingQuality = 'high';
    x.drawImage(img, r.x, r.y, r.w, r.h, 0, 0, r.w, r.h);
  } else {
    x = sizeCanvas(c, iw, ih, Math.min(rs, 1)); // already the original's own pixels
    x.drawImage(img, 0, 0);
  }
  return c;
}

/* ---------- crop tool ---------- */
let cropDragging = false;
function defaultCrop(iw, ih) {
  let w = iw, h = Math.round(w * 63 / 250);
  if (h > ih) { h = ih; w = Math.min(iw, Math.round(h * 250 / 63)); }
  return { x: Math.round((iw - w) / 2), y: Math.round((ih - h) / 2), w, h };
}
function clampCrop(r, iw, ih) {
  r.w = Math.max(10, Math.min(iw, Math.round(r.w)));
  r.h = Math.max(10, Math.min(ih, Math.round(r.h)));
  r.x = Math.max(0, Math.min(iw - r.w, Math.round(r.x)));
  r.y = Math.max(0, Math.min(ih - r.h, Math.round(r.y)));
  return r;
}
function placeCropRect() {
  const img = $('cropImg');
  if (!img.naturalWidth || !S.bannerCrop) return;
  const k = img.clientWidth / img.naturalWidth, r = S.bannerCrop;
  $('cropRect').style.cssText = `left:${r.x * k}px;top:${r.y * k}px;width:${r.w * k}px;height:${r.h * k}px`;
  $('cropDims').textContent = `${r.w} × ${r.h} px`;
  if (document.activeElement !== $('cropW')) $('cropW').value = r.w;
  if (document.activeElement !== $('cropH')) $('cropH').value = r.h;
}
function syncCropUI() {
  if (cropDragging) return;
  const img = $('cropImg');
  if (S.bannerData && img.getAttribute('src') !== S.bannerData) { img.onload = placeCropRect; img.src = S.bannerData; return; }
  placeCropRect();
}
function cropPointer(e, resize) {
  if (e.button !== 0 || !S.bannerCrop) return;
  e.preventDefault(); e.stopPropagation();
  const img = $('cropImg'), k = img.clientWidth / img.naturalWidth;
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const start = { ...S.bannerCrop }, x0 = e.clientX, y0 = e.clientY;
  cropDragging = true;
  const move = ev => {
    const dx = (ev.clientX - x0) / k, dy = (ev.clientY - y0) / k;
    const r = resize
      ? { x: start.x, y: start.y, w: start.w + dx, h: start.h + dy }
      : { x: start.x + dx, y: start.y + dy, w: start.w, h: start.h };
    if (resize) { r.w = Math.min(r.w, iw - r.x); r.h = Math.min(r.h, ih - r.y); }
    S.bannerCrop = clampCrop(r, iw, ih);
    placeCropRect();
    schedule();
  };
  const up = () => { cropDragging = false; removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); schedule(); };
  addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
}
$('cropRect').addEventListener('pointerdown', e => { if (e.target === $('cropHandle')) return; cropPointer(e, false); });
$('cropHandle').addEventListener('pointerdown', e => cropPointer(e, true));
['cropW', 'cropH'].forEach((id, i) => $(id).addEventListener('input', () => {
  const img = $('cropImg');
  if (!img.naturalWidth || !S.bannerCrop) return;
  const r = { ...S.bannerCrop };
  if (i === 0) r.w = +$(id).value || r.w; else r.h = +$(id).value || r.h;
  S.bannerCrop = clampCrop(r, img.naturalWidth, img.naturalHeight);
  placeCropRect(); schedule();
}));
document.querySelectorAll('#bannerSizeSeg button').forEach(b => b.onclick = () => {
  S.bannerSize = b.dataset.v;
  if (S.bannerSize === 'crop' && S.bannerData && !S.bannerCrop) {
    const img = new Image();
    img.onload = () => { S.bannerCrop = defaultCrop(img.naturalWidth, img.naturalHeight); syncSeg(); syncCropUI(); schedule(); };
    img.src = S.bannerData;
  }
  syncSeg(); syncCropUI(); schedule();
});
$('bannerRemove').onclick = () => { S.bannerData = null; S.bannerCrop = null; syncSeg(); schedule(); };
/* a folder's own label image: 'fit' fills the label size (same as the generated label), 'original' keeps its pixels, 'custom' is moved/resized by hand */
function lblGeom(c, img, W, H) {
  const ar = img.naturalWidth / img.naturalHeight, p = c.imgPos;
  if (c.imgMode === 'custom' && p) { const w = p.fw * W; return { x: p.fx * W, y: p.fy * H, w, h: p.fh ? p.fh * H : w / ar }; }
  const sc = Math.max(W / img.naturalWidth, H / img.naturalHeight), w = img.naturalWidth * sc, h = img.naturalHeight * sc;
  return { x: (W - w) / 2, y: (H - h) / 2, w, h };
}
async function fitPos(c) {
  const im = await loadImg(c.img), hh = c.imgH || S.lh, g = lblGeom({ imgMode: 'fit' }, im, S.lw, hh);
  return { fx: g.x / S.lw, fy: g.y / hh, fw: g.w / S.lw, fh: g.h / hh };
}
async function renderCustom(c, rs = 1) {
  const img = await loadImg(c.img), cv = document.createElement('canvas');
  if (c.imgMode === 'original') { const x = sizeCanvas(cv, img.naturalWidth, img.naturalHeight, 1); x.drawImage(img, 0, 0); return cv; }
  const x = sizeCanvas(cv, S.lw, c.imgH || S.lh, rs); x.imageSmoothingQuality = 'high';
  const g = lblGeom(c, img, cv.lw, cv.lh); x.drawImage(img, g.x, g.y, g.w, g.h);
  return cv;
}
async function bannerCanvas(rs = 1) {
  if (S.bannerMode === 'none') return null;
  if (S.bannerMode === 'text') { await ensureFont(fontOf(S.bannerFont), 30); await ensureFont(fontOf(S.tagFont), 30); return await renderTextBanner(rs); }
  return renderImageBanner(rs);
}
/* what a folder's label is: its generated text, its own image, or nothing at all */
function labelKind(c) { return c.labelMode === 'none' ? 'none' : (c.img && c.labelMode !== 'gen') ? 'img' : 'gen'; }
async function labelCanvas(c, i, rs = 1) {
  const kind = labelKind(c); if (kind === 'none') return null;
  if (kind === 'img') return renderCustom(c, rs);
  const st = labelStyle(c); await ensureFont(fontOf(st.font), st.size);
  return renderLabel(catLabel(c, i), st, rs);
}
const toBlob = c => new Promise(r => c.toBlob(r, 'image/png'));

/* ---------- .nfo ---------- */
function nfo({ color, icon, bitmap, sort, hidden }) {
  if (hidden) return 'Visible=False\r\n';
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
/* ---------- credit in the files' metadata ----------
   Every exported audio file carries "Made with Drum Kit Designer by @Willyswaggedout" in its
   metadata (the Details/Comments fields), written per format: WAV and AIFF get an info chunk,
   MP3 an ID3 comment, FLAC a vorbis comment. Names and audio stay untouched; a file whose
   format can't be tagged safely is exported exactly as it came in. */
const CREDIT = 'Made with Drum Kit Designer by @Willyswaggedout';
const ASC = s => new TextEncoder().encode(s);
function tagWav(u) {
  const t4 = o => String.fromCharCode(u[o], u[o + 1], u[o + 2], u[o + 3]);
  if (u.length < 12 || t4(0) !== 'RIFF' || t4(8) !== 'WAVE') return null;
  const dv = new DataView(u.buffer, u.byteOffset, u.byteLength);
  const parts = []; let o = 12;
  while (o + 8 <= u.length) {
    const sz = dv.getUint32(o + 4, true), end = Math.min(u.length, o + 8 + sz + (sz & 1));
    const isInfo = t4(o) === 'LIST' && o + 12 <= u.length && t4(o + 8) === 'INFO';
    const isId3 = /^id3 $/i.test(t4(o));
    if (!isInfo && !isId3) parts.push(u.subarray(o, end)); // an existing INFO or id3 chunk is replaced by ours
    o = end;
  }
  const field = (id, text) => { const d = ASC(text + '\0'); const b = new Uint8Array(8 + d.length + (d.length & 1)); b.set(ASC(id)); new DataView(b.buffer).setUint32(4, d.length, true); b.set(d, 8); return b; };
  const f1 = field('ICMT', CREDIT), f2 = field('ISFT', 'Drum Kit Designer by @Willyswaggedout');
  const info = new Uint8Array(12 + f1.length + f2.length);
  info.set(ASC('LIST')); new DataView(info.buffer).setUint32(4, 4 + f1.length + f2.length, true);
  info.set(ASC('INFO'), 8); info.set(f1, 12); info.set(f2, 12 + f1.length);
  const tag = id3Tag();
  const id3 = new Uint8Array(8 + tag.length + (tag.length & 1));
  id3.set(ASC('id3 ')); new DataView(id3.buffer).setUint32(4, tag.length, true); id3.set(tag, 8);
  let total = 4; parts.forEach(p => total += p.length); total += info.length + id3.length;
  const out = new Uint8Array(8 + total);
  out.set(ASC('RIFF')); new DataView(out.buffer).setUint32(4, total, true); out.set(ASC('WAVE'), 8);
  let w = 12; parts.forEach(p => { out.set(p, w); w += p.length; }); out.set(info, w); out.set(id3, w + info.length);
  return out;
}
function tagAiff(u) {
  const t4 = o => String.fromCharCode(u[o], u[o + 1], u[o + 2], u[o + 3]);
  if (u.length < 12 || t4(0) !== 'FORM' || !/^AIF[FC]$/.test(t4(8))) return null;
  const d = ASC(CREDIT);
  const anno = new Uint8Array(8 + d.length + (d.length & 1));
  anno.set(ASC('ANNO')); new DataView(anno.buffer).setUint32(4, d.length, false); anno.set(d, 8);
  const out = new Uint8Array(u.length + anno.length);
  out.set(u); out.set(anno, u.length);
  new DataView(out.buffer).setUint32(4, out.length - 8, false);
  return out;
}
const syncsafe = n => new Uint8Array([(n >>> 21) & 127, (n >>> 14) & 127, (n >>> 7) & 127, n & 127]);
const id3Frames = v4 => {
    const sz = n => { const b = new Uint8Array(4); if (v4) b.set(syncsafe(n)); else new DataView(b.buffer).setUint32(0, n, false); return b; };
    const frame = (id, data) => { const b = new Uint8Array(10 + data.length); b.set(ASC(id)); b.set(sz(data.length), 4); b.set(data, 10); return b; };
    const txt = ASC(CREDIT);
    const comm = new Uint8Array(5 + txt.length); comm.set(ASC('eng'), 1); comm.set(txt, 5); // latin-1, no description
    const tsse = new Uint8Array(1 + txt.length); tsse.set(txt, 1);
    const a = frame('COMM', comm), b = frame('TSSE', tsse);
    const o = new Uint8Array(a.length + b.length); o.set(a); o.set(b, a.length); return o;
};
function id3Tag() { // a complete standalone ID3v2.3 tag
  const fr = id3Frames(false);
  const t = new Uint8Array(10 + fr.length);
  t.set(ASC('ID3')); t[3] = 3; t.set(syncsafe(fr.length), 6); t.set(fr, 10);
  return t;
}
function tagMp3(u) {
  const frames = id3Frames;
  if (u.length >= 10 && u[0] === 0x49 && u[1] === 0x44 && u[2] === 0x33) {
    const ver = u[3], flags = u[5];
    if ((ver !== 3 && ver !== 4) || flags !== 0) return null; // unusual tag: left exactly as it was
    const oldSize = ((u[6] & 127) << 21) | ((u[7] & 127) << 14) | ((u[8] & 127) << 7) | (u[9] & 127);
    if (10 + oldSize > u.length) return null;
    const fr = frames(ver === 4);
    const out = new Uint8Array(u.length + fr.length);
    out.set(u.subarray(0, 10)); out.set(fr, 10); out.set(u.subarray(10), 10 + fr.length);
    out.set(syncsafe(oldSize + fr.length), 6);
    return out;
  }
  const t = id3Tag();
  const out = new Uint8Array(t.length + u.length);
  out.set(t); out.set(u, t.length);
  return out;
}
function tagFlac(u) {
  if (u.length < 8 || String.fromCharCode(u[0], u[1], u[2], u[3]) !== 'fLaC') return null;
  let o = 4, vcAt = -1; const blocks = [];
  while (o + 4 <= u.length) {
    const last = u[o] & 128, type = u[o] & 127, len = (u[o + 1] << 16) | (u[o + 2] << 8) | u[o + 3];
    if (o + 4 + len > u.length) return null;
    blocks.push({ o, type, len });
    if (type === 4) vcAt = blocks.length - 1;
    o += 4 + len;
    if (last) break;
  }
  if (!blocks.length) return null;
  const audio = u.subarray(o);
  const fields = [ASC('DESCRIPTION=' + CREDIT), ASC('COMMENT=' + CREDIT)];
  let vc;
  if (vcAt >= 0) {
    const b = blocks[vcAt], d = u.subarray(b.o + 4, b.o + 4 + b.len);
    const dv = new DataView(d.buffer, d.byteOffset, d.byteLength);
    if (d.length < 8) return null;
    const vlen = dv.getUint32(0, true);
    if (8 + vlen > d.length) return null;
    const cnt = dv.getUint32(4 + vlen, true);
    let extra = 0; fields.forEach(f => extra += 4 + f.length);
    vc = new Uint8Array(d.length + extra); vc.set(d);
    new DataView(vc.buffer).setUint32(4 + vlen, cnt + fields.length, true);
    let w = d.length;
    fields.forEach(f => { new DataView(vc.buffer).setUint32(w, f.length, true); vc.set(f, w + 4); w += 4 + f.length; });
  } else {
    const vend = ASC('Drum Kit Designer');
    let sz = 8 + vend.length; fields.forEach(f => sz += 4 + f.length);
    vc = new Uint8Array(sz);
    new DataView(vc.buffer).setUint32(0, vend.length, true); vc.set(vend, 4);
    let w = 4 + vend.length;
    new DataView(vc.buffer).setUint32(w, fields.length, true); w += 4;
    fields.forEach(f => { new DataView(vc.buffer).setUint32(w, f.length, true); vc.set(f, w + 4); w += 4 + f.length; });
  }
  if (vc.length > 0xFFFFFF) return null;
  const parts = [];
  blocks.forEach((b, i) => {
    if (i === vcAt) return;
    const h = new Uint8Array(4); h[0] = b.type; h[1] = b.len >> 16; h[2] = (b.len >> 8) & 255; h[3] = b.len & 255;
    parts.push(h, u.subarray(b.o + 4, b.o + 4 + b.len));
  });
  const vh = new Uint8Array(4); vh[0] = 4 | 128; vh[1] = vc.length >> 16; vh[2] = (vc.length >> 8) & 255; vh[3] = vc.length & 255;
  parts.push(vh, vc);
  let total = 4; parts.forEach(p => total += p.length);
  const out = new Uint8Array(total + audio.length);
  out.set(ASC('fLaC')); let w = 4;
  parts.forEach(p => { out.set(p, w); w += p.length; }); out.set(audio, w);
  return out;
}
const TAGGED = new WeakMap(); // file -> tagged blob, so repeated exports don't redo the work
function tagAudio(file) {
  const n = file.name.toLowerCase();
  if (!/\.(wav|aiff?|aifc|mp3|flac)$/.test(n)) return Promise.resolve(file);
  let out = TAGGED.get(file);
  if (!out) {
    out = (async () => {
      try {
        const u = new Uint8Array(await file.arrayBuffer());
        const t = /\.wav$/.test(n) ? tagWav(u) : /\.mp3$/.test(n) ? tagMp3(u) : /\.flac$/.test(n) ? tagFlac(u) : tagAiff(u);
        return t ? new Blob([t], { type: file.type || 'application/octet-stream' }) : file;
      } catch (e) { return file; }
    })();
    TAGGED.set(file, out);
  }
  return out;
}

async function buildEntries() {
  await ensureFont(fontOf(S.font), S.size);
  const out = [], K = kitFolder(), root = K;
  const add = (path, blob) => out.push({ path, blob }), dir = p => out.push({ path: p, dir: true });
  dir(root);
  const bc = await bannerCanvas();
  // image folders are named "zimages" so they sort below the kit, and (optionally) hidden from FL's browser
  if (bc) { dir(`${root}/zimages`); add(`${root}/zimages/banner.png`, await toBlob(bc)); if (S.hideImgs) add(`${root}/zimages.nfo`, new Blob([nfo({ hidden: true })])); }
  add(`${root}/${K}.nfo`, new Blob([nfo({ color: S.kitColorOn ? flColor(S.kitColor) : '', icon: S.kitIcon, bitmap: bc ? 'zimages/banner.png' : '' })]));
  dir(`${root}/${K}`); dir(`${root}/${K}/zimages`);
  if (S.hideImgs) add(`${root}/${K}/zimages.nfo`, new Blob([nfo({ hidden: true })]));
  for (let i = 0; i < S.cats.length; i++) {
    const c = S.cats[i], F = catFolder(c, i), base = `${root}/${K}`;
    const lc = await labelCanvas(c, i);
    if (lc) add(`${base}/zimages/${i + 1}.png`, await toBlob(lc));
    add(`${base}/${F}.nfo`, new Blob([nfo({ color: c.colorOn ? flColor(c.color) : '', icon: c.icon, bitmap: lc ? `zimages/${i + 1}.png` : '', sort: S.sortGroup ? S.cats.length - i : null })]));
    dir(`${base}/${F}`);
    const used = new Set(), dirs = new Set();
    for (const f of FILES.filter(f => f.cat === c.id)) {
      const sub = (f.sub || '').split('/').map(clean).filter(Boolean).join('/');
      const folder = `${base}/${F}${sub ? '/' + sub : ''}`;
      let p = `${folder}/${outName(f)}`;
      if (used.has(p.toLowerCase())) {
        const m = outName(f).match(/^(.*?)(\.[^.]*)?$/); let n = 2;
        do { p = `${folder}/${m[1]} (${n++})${m[2] || ''}`; } while (used.has(p.toLowerCase()));
      }
      used.add(p.toLowerCase());
      if (sub) { let acc = `${base}/${F}`; sub.split('/').forEach(s => { acc += '/' + s; if (!dirs.has(acc)) { dirs.add(acc); dir(acc); } }); }
      add(p, await tagAudio(f.file));
    }
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
function setStatus(msg, kind) { // shown as a small toast that slides in and fades out
  const s = $('status'); clearTimeout(setStatus._t);
  if (!msg) { s.classList.remove('show'); return; }
  s.textContent = msg; s.className = 'status show' + (kind ? ' ' + kind : '');
  void s.offsetWidth; s.classList.add('pop'); // retrigger the little pop on message change
  setStatus._t = setTimeout(() => s.classList.remove('show'), kind === 'err' ? 5000 : 2600);
}
function celebrate(btn, label) { // brief checkmark on the button that did it
  if (!btn || btn._celebrating) return; btn._celebrating = true;
  const old = btn.textContent; btn.textContent = '\u2713 ' + (btn.id === 'dlZip' ? 'Kit saved' : 'Saved');
  btn.classList.add('done');
  setTimeout(() => { btn.textContent = label || old; btn.classList.remove('done'); btn._celebrating = false; }, 1700);
}
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
    if (ok) celebrate($('dlZip'), 'Download Kit');
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
    celebrate($('writeDir'), 'Save into a folder\u2026');
  } catch (e) { setStatus('Saving stopped: ' + (e && e.message || e), 'err'); }
};

/* ---------- custom fonts (saved in this browser via IndexedDB) ---------- */
const FONT_RE = /\.(ttf|otf|woff2?)$/i;
const CUSTOM_FF = {}; // id -> FontFace, so fonts can be removed again
let fontDB = null;
function openFontDB() {
  return new Promise(res => {
    try {
      const q = indexedDB.open('dkb-fonts', 1);
      q.onupgradeneeded = () => q.result.createObjectStore('fonts', { keyPath: 'id' });
      q.onsuccess = () => res(q.result);
      q.onerror = () => res(null);
    } catch (e) { res(null); }
  });
}
function fontDBAll() {
  return new Promise(res => {
    if (!fontDB) return res([]);
    try { const r = fontDB.transaction('fonts').objectStore('fonts').getAll(); r.onsuccess = () => res(r.result || []); r.onerror = () => res([]); }
    catch (e) { res([]); }
  });
}
function fontDBPut(rec) { try { fontDB && fontDB.transaction('fonts', 'readwrite').objectStore('fonts').put(rec); } catch (e) { } }
function fontDBDel(id) { try { fontDB && fontDB.transaction('fonts', 'readwrite').objectStore('fonts').delete(id); } catch (e) { } }

async function registerCustomFont(rec) {
  try {
    const ff = new FontFace(rec.family, rec.data);
    await ff.load();
    document.fonts.add(ff);
    CUSTOM_FF[rec.id] = ff;
    FONTS.push({ id: rec.id, label: rec.name, css: `"${rec.family}"`, w: '400', web: rec.family, custom: true });
    return true;
  } catch (e) { return false; }
}
/* ---- favorites (kept in this browser, not part of undo history) ---- */
const FAVS = new Set((() => { try { return JSON.parse(localStorage.getItem('dkb-favs') || '[]'); } catch (e) { return []; } })());
const saveFavs = () => { try { localStorage.setItem('dkb-favs', JSON.stringify([...FAVS])); } catch (e) { } };
const STAR = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M12 2.8l2.8 6 6.5.7-4.8 4.5 1.3 6.5L12 17.2 6.2 20.5l1.3-6.5L2.7 9.5l6.5-.7z" stroke-linejoin="round"/></svg>';
function toggleFav(id) {
  FAVS.has(id) ? FAVS.delete(id) : FAVS.add(id); saveFavs();
  rebuildFontSelect(); renderFontList(); renderCats();
}
function fillFontOptions(sel, value) {
  sel.innerHTML = '';
  const opt = f => new Option((FAVS.has(f.id) ? '\u2605 ' : '') + f.label, f.id);
  const group = (label, list) => { if (!list.length) return; const g = document.createElement('optgroup'); g.label = label; list.forEach(f => g.appendChild(opt(f))); sel.appendChild(g); };
  const favs = FONTS.filter(f => FAVS.has(f.id));
  group('\u2605 Favorites', favs);
  group('Your fonts', FONTS.filter(f => f.custom));
  group('Built in', FONTS.filter(f => !f.custom));
  sel.value = value;
}
/* ---- font picker: hover a font and the preview shows it; click to keep it, Esc / click away to cancel ---- */
const PICKERS = [];
/* Hover previews in the pickers. Scrolling slides rows under a still mouse, and every row it passes
   would otherwise redraw the whole preview in that font, piling up into long freezes. So: while the
   list scrolls, rows are only highlighted; a row previews once the mouse actually moves onto it or
   rests on it, and only after it stays there a moment, so sweeping past ten rows costs one redraw. */
const HOVER_SETTLE = 120, SCROLL_QUIET = 220;
function hoverPreviews(apply) {
  let t = 0, lastScroll = 0, shown = null, want = null;
  const go = id => { clearTimeout(t); want = id; t = setTimeout(() => { if (want !== shown) { shown = want; apply(want); } }, HOVER_SETTLE); };
  return {
    // a row came under the pointer: preview it unless that happened because the list scrolled
    enter(id) { want = id; if (performance.now() - lastScroll < SCROLL_QUIET) return; /* the scroll-settle timer will show it */ go(id); },
    // the mouse really moved over a row
    move(id, e) { if (e && !e.movementX && !e.movementY) return; if (id !== shown) go(id); },
    // keyboard choice: preview right away (still settled)
    key(id) { go(id); },
    // list scrolled: hold previews until it has been still for a moment, then show the row under the mouse
    scrolled() { lastScroll = performance.now(); clearTimeout(t); t = setTimeout(() => { if (want != null && want !== shown) { shown = want; apply(want); } }, SCROLL_QUIET); },
    cancel() { clearTimeout(t); },
    reset() { clearTimeout(t); shown = want = null; lastScroll = 0; }
  };
}
function fontPicker(host, { get, commit, temp, revert, label }) {
  const btn = el('button', { type: 'button', className: 'fp-btn' }); btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
  if (label) btn.setAttribute('aria-label', label);
  const txt = el('span', { className: 'fp-txt' }), chev = el('span', { className: 'fp-chev', textContent: '\u25be' });
  btn.append(txt, chev);
  let pop = null, io = null, rows = [], cur = -1, hoverT = 0, committed = false;
  const refresh = () => { const f = fontOf(get()); txt.textContent = (FAVS.has(f.id) ? '\u2605 ' : '') + f.label; };
  const hv = hoverPreviews(id => { PREVIEW = true; temp(id); });
  const preview = id => hv.key(id);
  const close = keep => {
    if (!pop) return;
    hv.reset(); clearTimeout(hoverT); pop.remove(); pop = null; if (io) io.disconnect();
    removeEventListener('pointerdown', away, true); removeEventListener('keydown', key, true); removeEventListener('resize', onWin); removeEventListener('scroll', onWin, true);
    btn.setAttribute('aria-expanded', 'false');
    if (!keep) { if (PREVIEW) { revert(); PREVIEW = false; schedule(); } }
  };
  const pick = id => { committed = true; hv.cancel(); clearTimeout(hoverT); PREVIEW = false; close(true); commit(id); refresh(); btn.focus(); };
  const away = e => { if (pop && !pop.contains(e.target) && !btn.contains(e.target)) close(false); };
  const onWin = e => { if (pop && !(e && e.target && pop.contains(e.target))) close(false); };
  const focusRow = i => {
    rows.forEach((r, k) => r.classList.toggle('on', k === i)); cur = i;
    if (rows[i]) { rows[i].scrollIntoView({ block: 'nearest' }); preview(rows[i].dataset.id); }
  };
  const key = e => {
    if (!pop) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(false); btn.focus(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); focusRow(Math.min(rows.length - 1, cur + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); focusRow(Math.max(0, cur - 1)); }
    else if (e.key === 'Enter' && cur >= 0) { e.preventDefault(); e.stopPropagation(); pick(rows[cur].dataset.id); }
  };
  const open = () => {
    if (pop) { close(false); return; }
    pop = el('div', { className: 'fp-pop', role: 'listbox' }); pop.setAttribute('aria-label', 'Fonts');
    pop.addEventListener('scroll', () => hv.scrolled(), { passive: true }); pop.addEventListener('wheel', () => hv.scrolled(), { passive: true });
    io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return; const sm = en.target.querySelector('.fsample'); sm.style.fontFamily = sm.dataset.css; io.unobserve(en.target);
    }), { root: pop, rootMargin: '60px' }) : null;
    rows = [];
    const build = (title, list) => {
      if (!list.length) return;
      pop.appendChild(el('div', { className: 'fp-h', textContent: title }));
      list.forEach(f => {
        const fav = FAVS.has(f.id);
        const star = el('span', { className: 'fp-star' + (fav ? ' on' : ''), innerHTML: STAR, title: fav ? 'Remove from favorites' : 'Add to favorites' });
        star.setAttribute('role', 'button'); star.setAttribute('aria-label', (fav ? 'Unfavorite ' : 'Favorite ') + f.label);
        const sm = el('span', { className: 'fsample', textContent: 'Aa' }); sm.dataset.css = f.css; sm.setAttribute('aria-hidden', 'true');
        const del = f.custom ? el('span', { className: 'fp-del', title: 'Delete this font', textContent: '\u00d7' }) : null;
        if (del) { del.setAttribute('role', 'button'); del.setAttribute('aria-label', 'Delete ' + f.label); }
        const row = el('div', { className: 'fp-row' + (f.id === get() ? ' sel' : ''), role: 'option' }, star, el('span', { className: 'fname', textContent: f.label }), sm, ...(del ? [del] : []));
        row.dataset.id = f.id; row.setAttribute('aria-selected', f.id === get());
        row.addEventListener('pointerenter', () => { cur = rows.indexOf(row); rows.forEach(r => r.classList.remove('on')); row.classList.add('on'); hv.enter(f.id); });
        row.addEventListener('pointermove', e => hv.move(f.id, e));
        row.addEventListener('click', e => {
          if (e.target.closest('.fp-del')) { // remove an added font (asks first)
            close(false);
            confirmDelete(`Delete "${f.label}"?`, 'This removes the font from this browser. You can add it again from its file.', 'Delete', () => removeFonts([f.id]));
            return;
          }
          if (e.target.closest('.fp-star')) { // favorite without leaving the list
            const top = pop.scrollTop; toggleFavQuiet(f.id); const was = pop; close(true); open(); if (pop) pop.scrollTop = top; return;
          }
          pick(f.id);
        });
        pop.appendChild(row); rows.push(row);
        if (io && f.web) io.observe(row); else sm.style.fontFamily = f.css;
      });
    };
    build('\u2605 Favorites', FONTS.filter(f => FAVS.has(f.id)));
    build('Your fonts', FONTS.filter(f => f.custom));
    build('Built in', FONTS.filter(f => !f.custom));
    host.appendChild(pop);
    const r = btn.getBoundingClientRect(), room = innerHeight - r.bottom - 12, up = room < 220 && r.top > room;
    pop.style.cssText = `left:${Math.max(8, Math.min(r.left, innerWidth - Math.max(r.width, 260) - 8))}px;min-width:${Math.max(r.width, 260)}px;` + (up ? `bottom:${innerHeight - r.top + 6}px;max-height:${Math.min(360, r.top - 16)}px` : `top:${r.bottom + 6}px;max-height:${Math.min(360, room)}px`);
    btn.setAttribute('aria-expanded', 'true');
    cur = rows.findIndex(x => x.dataset.id === get()); const sel = rows[cur]; if (sel) { rows.forEach(x => x.classList.remove('on')); sel.classList.add('on'); sel.scrollIntoView({ block: 'center' }); }
    addEventListener('pointerdown', away, true); addEventListener('keydown', key, true); addEventListener('resize', onWin); addEventListener('scroll', onWin, true);
    pop.addEventListener('pointerleave', () => { clearTimeout(hoverT); if (PREVIEW) { revert(); PREVIEW = false; schedule(); } });
  };
  btn.onclick = open;
  btn.addEventListener('keydown', e => { if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !pop) { e.preventDefault(); open(); } });
  host.appendChild(btn); refresh();
  const api = { refresh, close: () => close(false) }; PICKERS.push(api); return api;
}
/* a drop-down list that previews each option live while the pointer is over it (same behaviour as the font picker) */
function optionPicker(host, { options, get, commit, temp, revert, label, icons }) {
  const btn = el('button', { type: 'button', className: 'fp-btn' }); btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
  if (label) btn.setAttribute('aria-label', label);
  const txt = el('span', { className: 'fp-txt' }); btn.append(txt, el('span', { className: 'fp-chev', textContent: '▾' }));
  let pop = null, rows = [], cur = -1, hoverT = 0;
  const chip = icons ? el('span', { className: 'fp-ic' }) : null; if (chip) btn.prepend(chip);
  const refresh = () => { const o = options.find(x => x[0] === get()); txt.textContent = o ? o[1] : ''; if (chip) chip.innerHTML = o ? iconChip(o[0]) : ''; };
  const hv = hoverPreviews(v => { PREVIEW = true; temp(v); });
  const preview = v => hv.key(v);
  const undo = () => { hv.reset(); clearTimeout(hoverT); if (PREVIEW) { revert(); PREVIEW = false; schedule(); } };
  const close = keep => {
    if (!pop) return;
    hv.reset(); clearTimeout(hoverT); pop.remove(); pop = null;
    removeEventListener('pointerdown', away, true); removeEventListener('keydown', key, true); removeEventListener('resize', onWin); removeEventListener('scroll', onWin, true);
    btn.setAttribute('aria-expanded', 'false'); if (!keep) undo();
  };
  const pick = v => { hv.cancel(); clearTimeout(hoverT); PREVIEW = false; close(true); commit(v); refresh(); btn.focus(); };
  const away = e => { if (pop && !pop.contains(e.target) && !btn.contains(e.target)) close(false); };
  const onWin = e => { if (pop && !(e && e.target && pop.contains(e.target))) close(false); };
  const focusRow = i => { rows.forEach((r, k) => r.classList.toggle('on', k === i)); cur = i; if (rows[i]) { rows[i].scrollIntoView({ block: 'nearest' }); preview(rows[i].dataset.v); } };
  const key = e => {
    if (!pop) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(false); btn.focus(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); focusRow(Math.min(rows.length - 1, cur + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); focusRow(Math.max(0, cur - 1)); }
    else if (e.key === 'Enter' && cur >= 0) { e.preventDefault(); e.stopPropagation(); pick(rows[cur].dataset.v); }
  };
  const open = () => {
    if (pop) { close(false); return; }
    pop = el('div', { className: 'fp-pop', role: 'listbox' }); pop.setAttribute('aria-label', label || 'Options'); rows = [];
    pop.addEventListener('scroll', () => hv.scrolled(), { passive: true }); pop.addEventListener('wheel', () => hv.scrolled(), { passive: true });
    options.forEach(([v, t]) => {
      const row = el('div', { className: 'fp-row' + (v === get() ? ' sel' : ''), role: 'option' }, ...(icons ? [el('span', { className: 'fp-ic', innerHTML: iconChip(v) })] : []), el('span', { className: 'fname', textContent: t }));
      row.dataset.v = v; row.setAttribute('aria-selected', v === get());
      row.addEventListener('pointerenter', () => { cur = rows.indexOf(row); rows.forEach(r => r.classList.remove('on')); row.classList.add('on'); hv.enter(v); });
      row.addEventListener('pointermove', e => hv.move(v, e));
      row.addEventListener('click', () => pick(v));
      pop.appendChild(row); rows.push(row);
    });
    if (icons && window.FLI && FLI.found) {
      // say where the icons come from, with a switch for anyone who'd rather see the program's own drawings
      const sw = el('input', { type: 'checkbox', checked: FLI.enabled() });
      sw.onchange = () => { FLI.setEnabled(sw.checked); close(false); };
      const lab = el('label', { className: 'fp-src' }, sw, el('span', { textContent: 'Use FL Studio’s icons' }));
      pop.append(el('div', { className: 'fp-foot' }, el('div', { className: 'fp-note', textContent: FLI.enabled() ? 'Icons are shown using your installed FL Studio.' : 'Showing this program’s own icon drawings.' }), lab));
    }
    host.appendChild(pop);
    const MAXH = icons ? 300 : 360; // long icon lists scroll rather than run down the page
    const r = btn.getBoundingClientRect(), w = Math.max(r.width, icons ? 220 : 190), room = innerHeight - r.bottom - 12, up = room < 220 && r.top > room;
    pop.style.cssText = `left:${Math.max(8, Math.min(r.left, innerWidth - w - 8))}px;min-width:${w}px;` + (up ? `bottom:${innerHeight - r.top + 6}px;max-height:${Math.min(MAXH, r.top - 16)}px` : `top:${r.bottom + 6}px;max-height:${Math.min(MAXH, room)}px`);
    btn.setAttribute('aria-expanded', 'true');
    cur = rows.findIndex(x => x.dataset.v === get()); if (rows[cur]) { rows[cur].classList.add('on'); rows[cur].scrollIntoView({ block: 'center' }); }
    addEventListener('pointerdown', away, true); addEventListener('keydown', key, true); addEventListener('resize', onWin); addEventListener('scroll', onWin, true);
    pop.addEventListener('pointerleave', undo);
  };
  btn.onclick = open;
  btn.addEventListener('keydown', e => { if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !pop) { e.preventDefault(); open(); } });
  host.appendChild(btn); refresh();
  return { refresh, close: () => close(false) };
}
function toggleFavQuiet(id) { FAVS.has(id) ? FAVS.delete(id) : FAVS.add(id); saveFavs(); renderFontList(); rebuildFontSelect(); }
function setupFontPickers() {
  [['font', 'font', 'Label font'], ['bannerFont', 'bannerFont', 'Kit name font'], ['tagFont', 'tagFont', 'Your @ font']].forEach(([id, key, label]) => {
    const sel = $(id); sel.hidden = true;
    const host = el('div', { className: 'fp' }); sel.after(host);
    fontPicker(host, {
      label, get: () => sel.value,
      commit: v => { sel.value = v; sel.dispatchEvent(new Event('change')); },
      temp: v => { S[key] = v; schedule(); },
      revert: () => { S[key] = sel.value; }
    });
  });
}
function rebuildFontSelect() {
  [['font', 'font'], ['bannerFont', 'bannerFont'], ['tagFont', 'tagFont']].forEach(([id, key]) => {
    const sel = $(id); fillFontOptions(sel, S[key]);
    if (sel.value !== S[key]) { S[key] = key === 'tagFont' ? 'segoe' : 'arialbold'; sel.value = S[key]; }
  });
  PICKERS.forEach(p => p.refresh());
}
const selectedFonts = new Set();
function removeFonts(ids) {
  ids.forEach(id => {
    const f = FONTS.find(x => x.id === id && x.custom); if (!f) return;
    if (CUSTOM_FF[f.id]) { try { document.fonts.delete(CUSTOM_FF[f.id]); } catch (e) { } delete CUSTOM_FF[f.id]; }
    fontDBDel(f.id); FONTS.splice(FONTS.indexOf(f), 1); selectedFonts.delete(id); FAVS.delete(id); saveFavs();
    if (S.font === f.id) S.font = 'arialbold';
  });
  rebuildFontSelect(); renderFontList(); schedule();
}
function setFontSelection(ids) {
  selectedFonts.clear(); ids.forEach(id => selectedFonts.add(id));
  document.querySelectorAll('#fontList li').forEach(li => li.classList.toggle('selected', selectedFonts.has(li.dataset.id)));
  updateFontSel();
}
function updateFontSel() {
  const n = selectedFonts.size; $('fontSel').hidden = n === 0;
  if (n) $('fontSelCount').textContent = n === 1 ? '1 font selected' : (n === FONTS.filter(f => f.custom).length ? 'All fonts selected' : n + ' fonts selected');
}
let favOnly = false, fontIO = null;
function renderFontList() {
  const ul = $('fontList'); ul.innerHTML = '';
  const cus = FONTS.filter(f => f.custom);
  [...selectedFonts].forEach(id => { if (!cus.some(f => f.id === id)) selectedFonts.delete(id); });
  if (fontIO) fontIO.disconnect();
  fontIO = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; const nm = en.target.querySelector('.fsample'); nm.style.fontFamily = nm.dataset.css; fontIO.unobserve(en.target);
  }), { root: ul, rootMargin: '80px' }) : null;
  // favorites first, then your own fonts, then the built-in ones
  const rank = f => (FAVS.has(f.id) ? 0 : 2) + (f.custom ? 0 : 1);
  const list = FONTS.map((f, i) => ({ f, i })).filter(x => !favOnly || FAVS.has(x.f.id)).sort((a, b) => rank(a.f) - rank(b.f) || a.i - b.i);
  list.forEach(({ f }) => {
    const fav = FAVS.has(f.id);
    const star = el('button', { type: 'button', className: 'fav' + (fav ? ' on' : ''), innerHTML: STAR, title: fav ? 'Remove from favorites' : 'Add to favorites' });
    star.setAttribute('aria-pressed', fav); star.setAttribute('aria-label', (fav ? 'Unfavorite ' : 'Favorite ') + f.label);
    star.onclick = () => toggleFav(f.id);
    const name = el('span', { className: 'fname', textContent: f.label, title: f.label });
    const sample = el('span', { className: 'fsample', textContent: 'Aa', 'aria-hidden': 'true' }); sample.dataset.css = f.css; sample.setAttribute('aria-hidden', 'true');
    const li = el('li', { className: (f.custom ? 'custom' : '') + (selectedFonts.has(f.id) ? ' selected' : '') }, star, name, sample); li.dataset.id = f.id;
    if (f.custom) {
      const x = el('button', { type: 'button', className: 'rm', textContent: '\u00d7', title: 'Remove font' });
      x.setAttribute('aria-label', 'Remove font ' + f.label);
      x.onclick = () => confirmDelete(`Delete "${f.label}"?`, 'This removes the font from this browser. You can add it again from its file.', 'Delete font', () => removeFonts([f.id]));
      li.appendChild(x);
    }
    ul.appendChild(li);
    if (fontIO && f.web) fontIO.observe(li); else sample.style.fontFamily = f.css;
  });
  if (!list.length) ul.appendChild(el('li', { className: 'empty', textContent: 'No favorites yet. Tap a star to add one.' }));
  $('favOnly').classList.toggle('on', favOnly); $('favOnly').setAttribute('aria-pressed', favOnly);
  updateFontSel();
}
$('favOnly').onclick = () => { favOnly = !favOnly; renderFontList(); };
$('fontClear').onclick = () => setFontSelection([]);
$('fontDelete').onclick = () => {
  const ids = [...selectedFonts], n = ids.length; if (!n) return;
  confirmDelete(n === 1 ? 'Delete this font?' : `Delete ${n} fonts?`, 'They will be removed from this browser. You can add them again from their files.', n === 1 ? 'Delete font' : 'Delete fonts', () => { removeFonts(ids); setStatus(`Deleted ${n} font${n > 1 ? 's' : ''}.`); });
};
// a font file is the same font if its contents match, whatever the file is called
async function fontHash(buf) {
  try { const h = await crypto.subtle.digest('SHA-256', buf); return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join(''); }
  catch (e) { const a = new Uint8Array(buf); let x = 2166136261; for (let i = 0; i < a.length; i++) { x ^= a[i]; x = Math.imul(x, 16777619); } return 'f' + a.length + '-' + (x >>> 0).toString(16); }
}
async function addFontFiles(files) {
  let added = 0, failed = 0, dup = 0;
  await fontsReady.catch(() => { });
  const have = new Set();
  for (const r of await fontDBAll()) if (r && r.data) have.add(r.hash || await fontHash(r.data));
  for (const file of files) {
    if (!FONT_RE.test(file.name)) continue;
    const name = file.name.replace(FONT_RE, '');
    const id = 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const family = 'DKB ' + name.replace(/[^\w ()-]/g, '').trim() + ' ' + id.slice(-4);
    let data;
    try { data = await file.arrayBuffer(); } catch (e) { failed++; continue; }
    const hash = await fontHash(data);
    if (have.has(hash)) { dup++; continue; } // already imported (also catches the same file twice in one drop)
    const rec = { id, name, family, data, hash };
    if (await registerCustomFont(rec)) { fontDBPut(rec); have.add(hash); added++; } else failed++;
  }
  if (added || failed || dup) {
    if (added || failed) { rebuildFontSelect(); renderFontList(); schedule(); }
    let msg = added ? `Added ${added} font${added > 1 ? 's' : ''}. Pick ${added > 1 ? 'one' : 'it'} under Label style.` : '';
    if (dup) msg += dup === 1 ? ' This font is already imported.' : ` ${dup} of these fonts are already imported.`;
    if (failed) msg += ` ${failed} file${failed > 1 ? 's' : ''} couldn't be read as a font.`;
    setStatus(msg.trim(), (failed || dup) && !added ? 'err' : 'ok');
  }
}
$('addFonts').onchange = e => { addFontFiles([...e.target.files]); e.target.value = ''; };
renderFontList();
const fontsReady = (async () => {
  fontDB = await openFontDB();
  const all = await fontDBAll();
  for (const rec of all) await registerCustomFont(rec);
  if (all.length) { rebuildFontSelect(); renderFontList(); schedule(); }
})();

/* ---------- saved banner background images ---------- */
let BGIMGS = [], bgDB = null;
function openBgDB() {
  return new Promise(res => {
    try {
      const q = indexedDB.open('dkb-bgimgs', 1);
      q.onupgradeneeded = () => q.result.createObjectStore('imgs', { keyPath: 'id' });
      q.onsuccess = () => res(q.result);
      q.onerror = () => res(null);
    } catch (e) { res(null); }
  });
}
function bgDBAll() {
  return new Promise(res => {
    if (!bgDB) return res([]);
    try { const r = bgDB.transaction('imgs').objectStore('imgs').getAll(); r.onsuccess = () => res(r.result || []); r.onerror = () => res([]); }
    catch (e) { res([]); }
  });
}
function bgDBPut(rec) { try { bgDB && bgDB.transaction('imgs', 'readwrite').objectStore('imgs').put(rec); } catch (e) { } }
function bgDBDel(id) { try { bgDB && bgDB.transaction('imgs', 'readwrite').objectStore('imgs').delete(id); } catch (e) { } }
function renderBgThumbs() {
  const box = $('bgThumbs'); box.innerHTML = '';
  BGIMGS.forEach(rec => {
    const btn = el('button', { type: 'button', className: 'bgthumb' + (S.bannerBgImage === rec.id ? ' selected' : ''), title: rec.name });
    btn.setAttribute('aria-label', 'Use background ' + rec.name);
    btn.appendChild(el('img', { src: rec.data, alt: '' }));
    btn.onclick = () => { S.bannerBgPos = null; S.bannerBgImage = rec.id; S.bannerBgMode = 'image'; $('bgMode').value = 'image'; renderBgThumbs(); schedule(); };
    const del = el('button', { type: 'button', className: 'bgdel', textContent: '×', title: 'Remove from saved backgrounds' });
    del.setAttribute('aria-label', 'Remove background ' + rec.name);
    del.onclick = ev => {
      ev.stopPropagation();
      bgDBDel(rec.id); BGIMGS = BGIMGS.filter(r => r !== rec);
      if (S.bannerBgImage === rec.id) { S.bannerBgImage = null; if (S.bannerBgMode === 'image') { S.bannerBgMode = 'none'; $('bgMode').value = 'none'; } }
      renderBgThumbs(); schedule();
    };
    btn.appendChild(del);
    box.appendChild(btn);
  });
}
$('addBgImg').onchange = e => {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    const rec = { id: 'b' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name: f.name, data: r.result };
    BGIMGS.push(rec); bgDBPut(rec);
    S.bannerBgPos = null; S.bannerBgImage = rec.id; S.bannerBgMode = 'image'; $('bgMode').value = 'image';
    renderBgThumbs(); schedule();
  };
  r.readAsDataURL(f);
  e.target.value = '';
};
const bgReady = (async () => {
  bgDB = await openBgDB();
  BGIMGS = await bgDBAll();
  if (BGIMGS.length) { renderBgThumbs(); if (S.bannerBgMode === 'image') schedule(); }
})();

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
// Only audio belongs in folders. Known audio goes in, known non-audio is
// skipped with a note, and anything unrecognized gets a "did you mean to
// drop this here?" dialog.
const AUDIO_RE = /\.(wav|mp3|ogg|oga|flac|aiff?|aifc|m4a|aac|wma|opus|mid|midi|sf2|sfz|wv|caf)$/i;
const NONAUDIO_RE = /\.(png|jpe?g|gif|webp|bmp|tiff?|svg|ico|heic|txt|rtf|pdf|docx?|xlsx?|pptx?|csv|zip|rar|7z|gz|exe|msi|dll|app|dmg|html?|css|js|json|xml|md|mov|mp4|avi|mkv|webm|url|lnk|ini|db)$/i;
let askQueue = [];
function showAsk() {
  const files = askQueue.flatMap(b => b.list.map(x => x.file.name));
  if (!files.length) { $('askDrop').hidden = true; return; }
  $('askText').textContent = (files.length === 1 ? "This file doesn't" : "These files don't") + ' look like audio:';
  const ul = $('askList'); ul.innerHTML = '';
  files.slice(0, 8).forEach(n => ul.appendChild(el('li', { textContent: n })));
  if (files.length > 8) ul.appendChild(el('li', { textContent: '…and ' + (files.length - 8) + ' more' }));
  $('askDrop').classList.remove('closing'); $('askDrop').hidden = false;
  $('askYes').focus();
}
$('askYes').onclick = () => { const q = askQueue; askQueue = []; hideModal($('askDrop')); q.forEach(b => addFiles(b.list, b.targetCat, true)); };
$('askNo').onclick = () => { askQueue = []; hideModal($('askDrop')); };
addEventListener('keydown', e => { if (e.key === 'Escape' && !$('askDrop').hidden) { askQueue = []; hideModal($('askDrop')); } });

function addFiles(list, targetCat, force, dupOk) {
  const fontFiles = list.filter(x => FONT_RE.test(x.file.name)).map(x => x.file);
  if (fontFiles.length) addFontFiles(fontFiles);
  list = list.filter(x => !FONT_RE.test(x.file.name) && !IGNORE.test(x.file.name));
  let skipped = 0, asked = 0;
  if (!force) {
    const rejected = list.filter(x => NONAUDIO_RE.test(x.file.name));
    const unknown = list.filter(x => !NONAUDIO_RE.test(x.file.name) && !AUDIO_RE.test(x.file.name));
    skipped = rejected.length; asked = unknown.length;
    if (unknown.length) { askQueue.push({ list: unknown, targetCat }); showAsk(); }
    list = list.filter(x => AUDIO_RE.test(x.file.name));
  }
  /* the same file again (same name and size): held back and asked about first */
  if (!dupOk) {
    const key = f => f.name.toLowerCase() + '\u0000' + f.size;
    const have = new Set(FILES.filter(f => !targetCat || f.cat === targetCat).map(f => key(f.file)));
    const dups = [];
    list = list.filter(x => { const k = key(x.file); if (have.has(k)) { dups.push(x); return false; } have.add(k); return true; });
    if (dups.length) {
      const where = targetCat ? 'this folder' : 'the kit';
      const names = dups.map(x => x.file.name), shown = names.slice(0, 5).join(', ') + (names.length > 5 ? ` and ${names.length - 5} more` : '');
      confirmDelete(
        dups.length === 1 ? 'Add a duplicate sample?' : `Add ${dups.length} duplicate samples?`,
        `${shown} ${dups.length === 1 ? 'is' : 'are'} already in ${where}. Are you sure you want to add ${dups.length === 1 ? 'it' : 'them'} again?`,
        dups.length === 1 ? 'Add duplicate' : 'Add duplicates',
        () => addFiles(dups, targetCat, true, true), true);
    }
  }
  if (!list.length) {
    if (skipped && !asked) setStatus(`Skipped ${skipped} file${skipped > 1 ? 's' : ''} that ${skipped > 1 ? "aren't" : "isn't"} audio.`, 'err');
    return;
  }
  let placed = 0, uns = 0;
  const before = S.cats.length, hitCats = new Set();
  list.forEach(({ file, rel }) => {
    let cat, sub = '';
    if (targetCat) { cat = targetCat; const parts = (rel || '').split('/'); parts.pop(); parts.shift(); sub = parts.join('/'); }
    else cat = folderFor(file.name, rel);
    if (cat) { placed++; hitCats.add(cat); } else uns++;
    FILES.push({ id: nid(), file, cat, sub });
  });
  renderCats(); schedule();
  // the folders that received samples flash once
  [...$('cats').children].forEach(x => { if (hitCats.has(x.dataset.id)) { x.classList.add('flash'); x.addEventListener('animationend', () => x.classList.remove('flash'), { once: true }); } });
  const made = S.cats.length - before;
  let msg = `Added ${placed + uns} sample${placed + uns === 1 ? '' : 's'}` + (made > 0 ? ` and ${made} new folder${made === 1 ? '' : 's'}` : '') + '.';
  if (uns) msg += ` ${uns} ${uns === 1 ? 'needs' : 'need'} a folder.`;
  if (skipped) msg += ` Skipped ${skipped} non-audio file${skipped > 1 ? 's' : ''}.`;
  setStatus(msg, uns || skipped ? 'err' : 'ok');
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
const hasFiles = e => e.dataTransfer && [...e.dataTransfer.types].includes('Files');
addEventListener('dragleave', e => { if (!e.relatedTarget) document.querySelector('.font-drop').classList.remove('drag'); });
addEventListener('dragover', e => {
  if (!hasFiles(e)) return; e.preventDefault();
  const onFolder = e.target.closest && e.target.closest('.folder');
  const onFontDrop = e.target.closest && e.target.closest('.fonts-block');
  document.querySelector('.font-drop').classList.toggle('drag', !!onFontDrop);
  document.querySelectorAll('.folder.drag').forEach(x => { if (x !== onFolder) x.classList.remove('drag'); });
  if (onFolder) onFolder.classList.add('drag');
});
addEventListener('drop', async e => {
  if (!hasFiles(e)) return; e.preventDefault();
  const card = e.target.closest && e.target.closest('.folder');
  document.querySelectorAll('.folder.drag').forEach(x => x.classList.remove('drag'));
  document.querySelector('.font-drop').classList.remove('drag');
  addFiles(await readDrop(e.dataTransfer), card ? card.dataset.id : null);
});
if ($('addFiles')) $('addFiles').onchange = e => { addFiles([...e.target.files].map(f => ({ file: f, rel: f.name })), null); e.target.value = ''; };

/* ---------- folders UI ---------- */
function folderSelect(cur, withPrompt) {
  const s = el('select');
  if (withPrompt) s.add(new Option('Choose folder…', ''));
  S.cats.forEach((c, i) => s.add(new Option(catFolder(c, i), c.id)));
  s.value = cur || '';
  return s;
}
/* ---------- sample playback ---------- */
const PLAY_SVG = '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor"/></svg>';
const STOP_SVG = '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><rect x="2.5" y="2.5" width="7" height="7" rx="1" fill="currentColor"/></svg>';
const player = new Audio();
let playingId = null, playingUrl = null, playingBtn = null;
function stopSample() {
  player.pause();
  if (playingUrl) URL.revokeObjectURL(playingUrl);
  if (playingBtn) { playingBtn.innerHTML = PLAY_SVG; playingBtn.classList.remove('on'); playingBtn.setAttribute('aria-label', 'Play ' + playingBtn.dataset.name); }
  playingId = playingUrl = playingBtn = null;
}
player.onended = stopSample;
function toggleSample(f, btn) {
  const same = playingId === f.id;
  stopSample();
  if (same) return;
  playingUrl = URL.createObjectURL(f.file); playingId = f.id; playingBtn = btn;
  btn.innerHTML = STOP_SVG; btn.classList.add('on'); btn.setAttribute('aria-label', 'Stop ' + f.file.name);
  player.src = playingUrl;
  player.play().catch(() => { stopSample(); setStatus(`Can't play "${f.file.name}" here.`, 'err'); });
}

const splitExt = n => { const m = n.match(/^(.*?)(\.[^.]*)?$/); return [m[1], m[2] || '']; };
const outName = f => f.rename ? f.rename + splitExt(f.file.name)[1] : f.file.name;
const badChars = /[\\/:*?"<>|]/g;

// In a folder: play + remove. In the "need a folder" box: folder picker + remove.
function fileList(files, needsFolder, catId) {
  const ul = el('ul', { className: 'flist' + (catId ? ' sortable' : '') });
  if (catId) { ul.dataset.cat = catId; enableReorder(ul, catId); }
  files.forEach(f => {
    const name = (f.sub ? f.sub + '/' : '') + outName(f);
    const play = el('button', { type: 'button', className: 'play' + (playingId === f.id ? ' on' : ''), innerHTML: playingId === f.id ? STOP_SVG : PLAY_SVG, title: 'Play' });
    play.dataset.name = f.file.name;
    play.setAttribute('aria-label', (playingId === f.id ? 'Stop ' : 'Play ') + f.file.name);
    play.onclick = () => toggleSample(f, play);
    if (playingId === f.id) playingBtn = play;
    let sel = null;
    if (needsFolder) {
      sel = folderSelect(f.cat, true);
      sel.setAttribute('aria-label', 'Folder for ' + f.file.name);
      sel.onchange = () => { f.cat = sel.value || null; renderCats(); schedule(); };
    }
    const x = el('button', { type: 'button', className: 'rm', textContent: '×', title: 'Remove' });
    x.setAttribute('aria-label', 'Remove ' + f.file.name);
    x.onclick = () => { if (playingId === f.id) stopSample(); FILES = FILES.filter(g => g !== f); renderCats(); schedule(); };
    const fn = el('span', { className: 'fn' + (catId ? ' editable' : '') + (f.rename ? ' renamed' : ''), textContent: name, title: catId ? name + ' (click to rename)' : name });
    if (catId) fn.onclick = () => {
      const [stem, ext] = splitExt(outName(f));
      const inp = el('input', { type: 'text', className: 'fn-edit', value: stem });
      inp.setAttribute('aria-label', 'File name');
      fn.replaceWith(inp); inp.focus(); inp.select();
      let done = false;
      const finish = ok => {
        if (done) return; done = true;
        const v = inp.value.replace(badChars, '').trim();
        if (ok && v && v !== stem) { f.rename = v === splitExt(f.file.name)[0] ? '' : v; schedule(); }
        renderCats();
      };
      inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); finish(true); } else if (e.key === 'Escape') finish(false); };
      inp.onblur = () => finish(true);
    };
    const li = el('li', {}, play, fn, sel, x);
    li.dataset.id = f.id;
    ul.append(li);
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
    fileList(un, true)));
}
function renderCats() {
  renderUnsorted();
  const wrap = $('cats');
  const scrolls = {}; wrap.querySelectorAll('ul.flist[data-cat]').forEach(u => { scrolls[u.dataset.cat] = u.scrollTop; });
  wrap.innerHTML = '';
  S.cats.forEach((c, i) => {
    const mine = FILES.filter(f => f.cat === c.id);
    const open = expanded.has(c.id);
    const d = el('div', { className: 'folder' + (selectedCats.has(c.id) ? ' selected' : '') }); d.dataset.id = c.id;

    // summary row
    const ico = el('span', { className: 'ico', innerHTML: iconSVG(c.icon) });
    const idx = S.numbering ? el('span', { className: 'idx', textContent: i + 1 }) : null;
    const name = el('input', { type: 'text', className: 'name', value: c.name, placeholder: i === 0 ? 'Folder name, e.g. 808s' : 'Folder name' });
    name.setAttribute('aria-label', `Folder ${i + 1} name`);
    name.oninput = () => { c.name = name.value; schedule(); };
    const count = el('span', { className: 'count', textContent: mine.length ? `${mine.length} sample${mine.length > 1 ? 's' : ''}` : '' });
    const chev = el('button', { type: 'button', className: 'chev', textContent: '›', title: open ? 'Hide options' : 'More options' });
    chev.setAttribute('aria-expanded', open); chev.setAttribute('aria-label', `Options for folder ${i + 1}`);
    chev.onclick = () => { open ? expanded.delete(c.id) : expanded.add(c.id); renderCats(); schedule(); };
    const grab = el('div', { className: 'folder-grab', title: 'Drag to reorder' }, ico, idx);
    grab.addEventListener('pointerdown', ev => startFolderDrag(ev, d));
    d.append(el('div', { className: 'folder-row' }, grab, name, count, chev));

    if (open) {

      const isel = el('select'); fillIconSelect(isel); isel.setAttribute('aria-label', 'Icon');
      const inum = el('input', { type: 'number', min: 0, max: 1200, className: 'num' }); inum.setAttribute('aria-label', 'Icon number');
      const known = c.icon === 'none' || KNOWN_ICONS.includes(String(c.icon));
      isel.value = known ? String(c.icon) : 'custom'; inum.value = known ? '' : c.icon; inum.hidden = known;
      const ihost = el('div', { className: 'fp' }); let savedIcon;
      const ipick = optionPicker(ihost, {
        options: ICONS, label: 'Icon', icons: true, get: () => isel.value,
        commit: v => { savedIcon = undefined; isel.value = v; isel.onchange(); },
        temp: v => { if (savedIcon === undefined) savedIcon = c.icon; c.icon = v === 'custom' ? savedIcon : v; ico.innerHTML = iconSVG(c.icon); schedule(); },
        revert: () => { if (savedIcon !== undefined) { c.icon = savedIcon; ico.innerHTML = iconSVG(c.icon); savedIcon = undefined; } }
      });
      isel.onchange = () => {
        if (isel.value === 'custom') { inum.hidden = false; inum.value = inum.value || '1'; c.icon = inum.value; inum.focus(); }
        else { inum.hidden = true; c.icon = isel.value; }
        ico.innerHTML = iconSVG(c.icon); schedule();
      };
      inum.oninput = () => { c.icon = inum.value || 'none'; ico.innerHTML = iconSVG(c.icon); schedule(); };
      const icp = iconCopyPaste(() => c.icon, v => {
        c.icon = v; const k = KNOWN_ICONS.includes(v) || v === 'none';
        isel.value = k ? v : 'custom'; inum.value = k ? '' : v; inum.hidden = k; ipick.refresh();
        ico.innerHTML = iconSVG(c.icon); histCommit(); schedule();
      });

      const cb = el('input', { type: 'checkbox', checked: c.colorOn });
      const cc = el('input', { type: 'color', value: c.color, disabled: !c.colorOn }); cc.setAttribute('aria-label', 'Name color');
      cb.onchange = () => { c.colorOn = cb.checked; cc.disabled = !cb.checked; schedule(); };
      cc.oninput = () => { c.color = cc.value; schedule(); };

      const kind = c.labelMode || (c.img ? 'img' : 'gen');
      const kindSeg = el('div', { className: 'seg small', role: 'group' }); kindSeg.setAttribute('aria-label', 'Label type');
      [['gen', 'Generated'], ['img', 'Custom image'], ['none', 'None']].forEach(([v, t]) => {
        const b = el('button', { type: 'button', textContent: t }); b.setAttribute('aria-pressed', kind === v);
        b.onclick = () => { if (kind === v) return; c.labelMode = v; renderCats(); schedule(); };
        kindSeg.append(b);
      });
      let imgCtl = null;
      if (kind === 'img' && c.img) {
        const mode = c.imgMode || 'fit', seg = el('div', { className: 'seg small', role: 'group' });
        seg.setAttribute('aria-label', 'Label image size');
        const H0 = c.imgH || S.lh;
        const sel = el('select', { className: 'fit-size' }); sel.dataset.v = 'fit'; sel.setAttribute('aria-label', 'Label size');
        sel.setAttribute('aria-pressed', mode !== 'original' && mode !== 'custom');
        [...new Set([S.lh, 30, 40, 50, 60, 80])].forEach(hh => sel.add(new Option(`Fit label · ${S.lw}×${hh}` + (hh === S.lh ? ' (default)' : ''), hh)));
        if (!sel.querySelector(`option[value="${H0}"]`)) sel.add(new Option(`Fit label · ${S.lw}×${H0}`, H0));
        sel.value = H0;
        sel.onchange = async () => { const hh = +sel.value; c.imgH = hh === S.lh ? null : hh; if (mode === 'custom') c.imgPos = await fitPos(c); else c.imgMode = 'fit'; renderCats(); schedule(); };
        seg.append(sel);
        [['original', 'Original size'], ['custom', 'Custom']].forEach(([v, t]) => {
          const b = el('button', { type: 'button', textContent: t }); b.dataset.v = v; b.setAttribute('aria-pressed', mode === v);
          b.onclick = async () => {
            if (v === 'custom' && mode !== 'custom') c.imgPos = await fitPos(c);   // always start from a proportional fit
            c.imgMode = v; renderCats(); schedule();
          };
          seg.append(b);
        });
        // size slider, same idea as the banner image's: 100% = the fitted size, scales around the label's center
        let im0 = null; loadImg(c.img).then(i => { im0 = i; syncScale(); }).catch(() => { });
        const cover = () => lblGeom({ imgMode: 'fit' }, im0, S.lw, c.imgH || S.lh);
        const sc = el('input', { type: 'range', min: 10, max: 400, step: 1, value: 100 }); sc.setAttribute('aria-label', 'Label image size');
        const scv = el('output', { textContent: '100%' });
        const syncScale = () => {
          if (!im0) return;
          const pct = mode === 'custom' ? Math.round(lblGeom(c, im0, S.lw, c.imgH || S.lh).w / cover().w * 100) : 100;
          sc.value = Math.max(10, Math.min(400, pct)); scv.textContent = pct + '%';
        };
        sc.oninput = () => {
          if (!im0) return;
          const W = S.lw, H = c.imgH || S.lh, cv0 = cover(), g = lblGeom(c, im0, W, H);
          const w = cv0.w * sc.value / 100, u = (W / 2 - g.x) / g.w, v = (H / 2 - g.y) / g.h, h2 = w * g.h / g.w;
          c.imgMode = 'custom'; c.imgPos = { fx: (W / 2 - u * w) / W, fy: (H / 2 - v * h2) / H, fw: w / W, fh: h2 / H };
          scv.textContent = sc.value + '%'; schedule();
        };
        sc.onchange = () => renderCats();
        const replaceLbl = el('button', { type: 'button', className: 'link', textContent: 'Remove image' });
        replaceLbl.onclick = () => { c.img = null; c.imgMode = 'fit'; c.imgPos = null; c.imgH = null; renderCats(); schedule(); };
        const scr = el('button', { type: 'button', className: 'link', textContent: 'Reset' });
        scr.onclick = () => { c.imgMode = 'fit'; c.imgPos = null; renderCats(); schedule(); };
        const scaleRow = el('div', { className: 'inline bg-scale' }, el('span', { className: 'note', textContent: 'Size' }), sc, scv, scr);
        imgCtl = el('div', { className: 'stack' }, seg, scaleRow,
          el('p', { className: 'note', textContent: mode === 'original' ? 'Uses the image at its own size.' : 'With this folder open, hover its label in the preview: drag to move the image, drag a corner to resize (Shift stretches it).' }),
          el('div', { className: 'inline' }, replaceLbl));
      } else if (kind === 'img') {
        const fid = 'img-' + c.id;
        const fi = el('input', { type: 'file', accept: 'image/*', id: fid, className: 'vh' });
        fi.onchange = () => { const f = fi.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { c.img = r.result; c.labelMode = 'img'; renderCats(); schedule(); }; r.readAsDataURL(f); };
        imgCtl = el('div', { className: 'inline' }, el('label', { className: 'link', htmlFor: fid, textContent: 'Upload your own…' }), fi);
      }

      // generated labels only: this folder's own label look (falls back to the global Label style)
      let styleRows = [];
      if (kind === 'gen') {
        const eff = labelStyle(c), setO = (k, v) => { (c.ls || (c.ls = {}))[k] = v; rst.hidden = false; schedule(); };
        const fsel = el('div', { className: 'fp' }); let fcur = FONTS.some(f => f.id === eff.font) ? eff.font : S.font, saved;
        fontPicker(fsel, {
          label: 'Label font', get: () => fcur,
          commit: v => { fcur = v; saved = undefined; setO('font', v); },
          temp: v => { if (saved === undefined) saved = c.ls ? JSON.parse(JSON.stringify(c.ls)) : null; (c.ls || (c.ls = {})).font = v; schedule(); },
          revert: () => { if (saved !== undefined) { if (saved) c.ls = saved; else delete c.ls; saved = undefined; } }
        });
        const sz = el('input', { type: 'range', min: 9, max: 100, step: 1, value: eff.size }); sz.setAttribute('aria-label', 'Label size');
        const szv = el('span', { className: 'note', textContent: eff.size + ' px' });
        sz.oninput = () => { szv.textContent = sz.value + ' px'; setO('size', +sz.value); };
        const tc = el('input', { type: 'color', value: eff.color }); tc.setAttribute('aria-label', 'Label text color');
        tc.oninput = () => setO('color', tc.value);
        const ow = el('input', { type: 'range', min: 0, max: 3, step: .5, value: eff.outline }); ow.setAttribute('aria-label', 'Label outline');
        const oc = el('input', { type: 'color', value: eff.outlineColor, disabled: !(+eff.outline) }); oc.setAttribute('aria-label', 'Label outline color');
        const owv = el('span', { className: 'note', textContent: +eff.outline ? eff.outline + ' px' : 'Off' });
        ow.oninput = () => { owv.textContent = +ow.value ? ow.value + ' px' : 'Off'; oc.disabled = !(+ow.value); setO('outline', +ow.value); };
        oc.oninput = () => setO('outlineColor', oc.value);
        const sh = el('input', { type: 'range', min: 0, max: 6, step: .5, value: eff.shadow }); sh.setAttribute('aria-label', 'Label drop shadow');
        const shv = el('span', { className: 'note', textContent: +eff.shadow ? eff.shadow + ' px' : 'Off' });
        sh.oninput = () => { shv.textContent = +sh.value ? sh.value + ' px' : 'Off'; setO('shadow', +sh.value); };
        var rst = el('button', { type: 'button', className: 'link', textContent: 'Use default label style', hidden: !(c.ls && Object.keys(c.ls).length) });
        rst.onclick = () => { delete c.ls; renderCats(); schedule(); };
        styleRows = [
          el('span', { textContent: 'Label font' }), fsel,
          el('span', { textContent: 'Label size' }), el('div', { className: 'inline grow' }, sz, szv),
          el('span', { textContent: 'Label text' }), el('label', { className: 'check' }, tc),
          el('span', { textContent: 'Outline' }), el('div', { className: 'inline grow' }, ow, oc, owv),
          el('span', { textContent: 'Drop shadow' }), el('div', { className: 'inline grow' }, sh, shv),
          el('span', {}), rst
        ];
      }
      const grid = el('div', { className: 'grid' },
        el('span', { textContent: 'Icon' }), el('div', { className: 'inline' }, ihost, inum, icp),
        el('span', { textContent: 'Name color' }), el('label', { className: 'check' }, cb, cc),
        el('span', { textContent: 'Label' }), kindSeg, ...(imgCtl ? [el('span', {}), imgCtl] : []), ...styleRows);

      const fid2 = 'add-' + c.id;
      const af = el('input', { type: 'file', multiple: true, id: fid2, className: 'vh' });
      af.onchange = () => { addFiles([...af.files].map(f => ({ file: f, rel: f.name })), c.id); af.value = ''; };
      const dz = el('div', { className: 'dropzone' }, 'Drop samples here or ', el('label', { className: 'link', htmlFor: fid2, textContent: 'choose files' }), af);

      const mk = (txt, fn, cls, dis) => { const b = el('button', { type: 'button', className: 'link' + (cls ? ' ' + cls : ''), textContent: txt, disabled: !!dis }); b.onclick = fn; return b; };
      const acts = el('div', { className: 'folder-actions' },
        mk('Move up', () => { S.cats.splice(i - 1, 0, S.cats.splice(i, 1)[0]); renderCats(); schedule(); }, '', i === 0),
        mk('Move down', () => { S.cats.splice(i + 1, 0, S.cats.splice(i, 1)[0]); renderCats(); schedule(); }, '', i === S.cats.length - 1),
        mk('Delete folder', () => {
          const nm = catName(c, i), n = mine.length;
          confirmDelete(`Delete "${nm}"?`, n ? `Its ${n} sample${n > 1 ? 's' : ''} won't be deleted, but will need a new folder. You can undo with Ctrl+Z.` : 'You can undo with Ctrl+Z.', 'Delete folder', () => collapseFolders(new Set([c.id]), () => {
          const n = mine.length, at = S.cats.indexOf(c); if (at >= 0) S.cats.splice(at, 1); expanded.delete(c.id); selectedCats.delete(c.id); updateBulkPanel();
          FILES.forEach(f => { if (f.cat === c.id) f.cat = null; });
          if (!S.cats.length) S.cats.push(newCat());
          renderCats(); schedule();
          setStatus(`Deleted "${catName(c, i)}".` + (n ? ` Its ${n} samples need a new folder.` : ''));
        }));
        }, 'danger'));

      let ren = null;
      if (mine.length) {
        const rin = el('input', { type: 'text', className: 'ren-in', placeholder: 'Name all samples, e.g. Hi-Hats by You' });
        rin.setAttribute('aria-label', 'Base name for all samples in this folder');
        const go = () => {
          const base = rin.value.replace(badChars, '').trim(); if (!base) { rin.focus(); return; }
          const w = String(mine.length).length;
          mine.forEach((f, k) => { f.rename = `${base} ${String(k + 1).padStart(w, '0')}`; });
          renderCats(); schedule(); setStatus(`Renamed ${mine.length} sample${mine.length > 1 ? 's' : ''} in this folder.`);
        };
        rin.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); go(); } };
        const gob = el('button', { type: 'button', className: 'ren-go', textContent: 'Rename & number' }); gob.onclick = go;
        const parts = [rin, gob];
        if (mine.some(f => f.rename)) parts.push(mk('Reset names', () => { mine.forEach(f => { f.rename = ''; }); renderCats(); schedule(); }));
        ren = el('div', { className: 'rename-row' }, ...parts);
      }
      d.append(el('div', { className: 'folder-more' }, grid, dz, ren, mine.length ? fileList(mine, false, c.id) : null, acts));
    }
    wrap.appendChild(d);
  });
  wrap.querySelectorAll('ul.flist[data-cat]').forEach(u => { if (scrolls[u.dataset.cat]) u.scrollTop = scrolls[u.dataset.cat]; });
}

/* ---------- drag to reorder samples inside a folder ----------
   Press on the empty part of a row and drag. The row lifts and follows the
   pointer; the others slide out of the way, and it settles into its slot. */
function enableReorder(ul, catId) {
  ul.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    const li = e.target.closest('li');
    if (!li || e.target.closest('button, select, input, a')) return;
    e.preventDefault();
    const items = [...ul.children], from = items.indexOf(li), h = li.offsetHeight;
    const startY = e.clientY, startScroll = ul.scrollTop;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let dragging = false, to = from, lastY = startY, raf = 0;

    function update() {
      const dy = lastY - startY + (ul.scrollTop - startScroll);
      const cdy = Math.max(-from * h, Math.min((items.length - 1 - from) * h, dy));
      li.style.transform = `translateY(${cdy}px) scale(1.01)`;
      to = Math.max(0, Math.min(items.length - 1, from + Math.round(cdy / h)));
      items.forEach((it, i) => {
        if (it === li) return;
        let shift = 0;
        if (from < to && i > from && i <= to) shift = -h;
        else if (from > to && i < from && i >= to) shift = h;
        it.style.transform = shift ? `translateY(${shift}px)` : '';
      });
      // scroll the list when dragging near its top or bottom edge
      const r = ul.getBoundingClientRect(); let v = 0;
      if (lastY < r.top + 28) v = -Math.ceil((r.top + 28 - lastY) / 4);
      else if (lastY > r.bottom - 28) v = Math.ceil((lastY - (r.bottom - 28)) / 4);
      if (v && !raf) raf = requestAnimationFrame(() => { raf = 0; const b = ul.scrollTop; ul.scrollTop += v; if (ul.scrollTop !== b) update(); });
    }
    function move(ev) {
      lastY = ev.clientY;
      if (!dragging) {
        if (Math.abs(lastY - startY) < 4) return;
        dragging = true;
        ul.classList.add('reordering'); li.classList.add('lifted');
      }
      update();
    }
    function up() {
      removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
      if (raf) cancelAnimationFrame(raf);
      if (!dragging) return;
      li.classList.remove('lifted'); li.classList.add('settling');
      li.style.transform = `translateY(${(to - from) * h}px)`;
      const commit = () => {
        const ids = items.map(it => it.dataset.id);
        ids.splice(to, 0, ids.splice(from, 1)[0]);
        const ordered = ids.map(id => FILES.find(f => f.id === id)).filter(Boolean);
        FILES = FILES.filter(f => f.cat !== catId).concat(ordered);
        renderCats(); schedule();
      };
      if (reduce || to === from) setTimeout(commit, reduce ? 0 : 200); else setTimeout(commit, 240);
    }
    addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
  });
}
function enterLast() { const f = $('cats').lastElementChild; if (f) { f.classList.add('enter'); f.addEventListener('animationend', () => f.classList.remove('enter'), { once: true }); } }
$('addCat').onclick = () => {
  const c = newCat(); S.cats.push(c); renderCats(); enterLast(); schedule();
  const ins = $('cats').querySelectorAll('input.name'); ins[ins.length - 1].focus();
};
$('dupCat').onclick = () => {
  const src = S.cats[S.cats.length - 1];
  const c = newCat(src.name.trim() ? src.name.trim() + ' copy' : '', src.icon);
  c.colorOn = src.colorOn; c.color = src.color; c.img = src.img; c.labelMode = src.labelMode; c.imgH = src.imgH; c.imgMode = src.imgMode; c.imgPos = src.imgPos && { ...src.imgPos };
  if (src.ls) c.ls = JSON.parse(JSON.stringify(src.ls)); // the folder's own label style (font, size, outline, shadow) comes along too
  S.cats.push(c); renderCats(); enterLast(); schedule();
  const ins = $('cats').querySelectorAll('input.name');
  const last = ins[ins.length - 1]; last.focus(); last.select();
};

/* ---------- kit & style controls ---------- */
const BINDS = [];
function bind(id, key, kind) {
  const e = $(id), get = () => kind === 'check' ? e.checked : kind === 'num' ? +e.value : e.value;
  BINDS.push([e, key, kind]);
  if (kind === 'check') e.checked = !!S[key]; else e.value = S[key] == null ? '' : S[key];
  const h = () => { S[key] = get(); schedule(); };
  e.addEventListener('input', h); e.addEventListener('change', h);
}
fillIconSelect($('kitIcon'));
const KIT_OPTS = ICONS.filter(o => o[0] !== 'custom');
function syncKitIcon() { // a kit icon number outside the list (pasted from a folder) still shows
  const ks = $('kitIcon'), v = String(S.kitIcon);
  if (![...ks.options].some(o => o.value === v)) ks.add(new Option('Icon ' + v, v));
  if (!KIT_OPTS.some(o => o[0] === v)) KIT_OPTS.push([v, 'Icon ' + v]);
  ks.value = v;
}
rebuildFontSelect();
setupFontPickers();
[['kitName', 'kitName'], ['tip', 'tip'], ['kitColor', 'kitColor'], ['bannerSub', 'bannerSub'], ['bannerBg', 'bannerBg'], ['kitInk', 'kitInk'], ['tagInk', 'tagInk'], ['kitOutlineColor', 'kitOutlineColor'], ['tagOutlineColor', 'tagOutlineColor'],
 ['font', 'font'], ['bannerFont', 'bannerFont'], ['tagFont', 'tagFont'], ['bgMode', 'bannerBgMode'], ['labelColor', 'labelColor'], ['outlineColor', 'outlineColor'], ['colorOrder', 'colorOrder']].forEach(([a, b]) => bind(a, b));
[['kitShadow', 'kitShadow'], ['tagShadow', 'tagShadow'], ['kitColorOn', 'kitColorOn'], ['matchColor', 'matchColor'], ['numbering', 'numbering'], ['sortGroup', 'sortGroup'], ['hideImgs', 'hideImgs']].forEach(([a, b]) => bind(a, b, 'check'));
[['size', 'size'], ['kitSize', 'kitSize'], ['tagSize', 'tagSize'], ['kitOutline', 'kitOutline'], ['tagOutline', 'tagOutline'], ['outline', 'outline'], ['shadow', 'shadow'], ['lw', 'lw'], ['lh', 'lh'], ['heightOfs', 'heightOfs']].forEach(([a, b]) => bind(a, b, 'num'));
syncKitIcon();
[...$('kitIcon').options].forEach(o => { if (o.value === 'custom') o.remove(); });
$('kitIcon').onchange = () => { S.kitIcon = $('kitIcon').value; schedule(); };
{
  const ks = $('kitIcon'); ks.hidden = true; const kh = el('div', { className: 'fp' }); ks.after(kh); let saved;
  const kopts = KIT_OPTS;
  const kp = optionPicker(kh, {
    options: kopts, label: 'Kit folder icon', icons: true, get: () => ks.value,
    commit: v => { saved = undefined; ks.value = v; ks.onchange(); },
    temp: v => { if (saved === undefined) saved = S.kitIcon; S.kitIcon = v; schedule(); },
    revert: () => { if (saved !== undefined) { S.kitIcon = saved; saved = undefined; } }
  });
  PICKERS.push(kp);
  // a pasted icon that isn't in the list (a folder's own number) is added so it can be shown
  kh.after(iconCopyPaste(() => S.kitIcon, v => {
    S.kitIcon = v; syncKitIcon(); kp.refresh(); histCommit(); schedule();
  }));
}
{
  const cs = $('colorOrder'); cs.hidden = true; const ch = el('div', { className: 'fp' }); cs.after(ch); let saved;
  PICKERS.push(optionPicker(ch, {
    options: [...cs.options].map(o => [o.value, o.textContent]), label: 'Color format', get: () => cs.value,
    commit: v => { saved = undefined; cs.value = v; cs.dispatchEvent(new Event('change')); },
    temp: v => { if (saved === undefined) saved = S.colorOrder; S.colorOrder = v; },
    revert: () => { if (saved !== undefined) { S.colorOrder = saved; saved = undefined; } }
  }));
}
$('numbering').addEventListener('change', () => renderCats());
$('bannerFile').onchange = e => {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader(); r.onload = () => { S.bannerData = r.result; S.bannerMode = 'image'; S.bannerCrop = null; if (S.bannerSize === 'crop') S.bannerSize = 'original'; syncSeg(); syncCropUI(); schedule(); }; r.readAsDataURL(f);
  e.target.value = '';
};
function syncSeg() {
  document.querySelectorAll('#bannerMode button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.bannerMode));
  document.querySelectorAll('#bannerSizeSeg button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.bannerSize));
  $('bannerRemove').hidden = !S.bannerData;
  $('bannerSizeOpts').hidden = !S.bannerData;
  $('cropBox').hidden = S.bannerSize !== 'crop' || !S.bannerData;
  $('bannerImageOpts').hidden = S.bannerMode !== 'image';
  $('bannerTextOpts').hidden = S.bannerMode !== 'text';
  document.querySelectorAll('#zoom button').forEach(b => b.setAttribute('aria-pressed', +b.dataset.v === S.zoom));
}
document.querySelectorAll('#bannerBgSeg button').forEach(b => b.onclick = () => {
  S.bannerBgMode = b.dataset.v;
  if (S.bannerBgMode === 'image' && !BGIMGS.some(r => r.id === S.bannerBgImage) && BGIMGS.length) { S.bannerBgPos = null; S.bannerBgImage = BGIMGS[0].id; renderBgThumbs(); }
  $('bgMode').value = S.bannerBgMode; schedule();
});
document.querySelectorAll('#zoom button').forEach(b => b.onclick = () => {
  const prev = S.zoom; S.zoom = +b.dataset.v; syncSeg(); schedule();
  const fl = $('fl');
  if (prev !== S.zoom && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    fl.style.transition = 'none'; fl.style.transformOrigin = 'top left'; fl.style.transform = `scale(${prev / S.zoom})`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      fl.style.transition = 'transform .18s ease'; fl.style.transform = 'scale(1)';
      setTimeout(() => { fl.style.transition = fl.style.transform = fl.style.transformOrigin = ''; }, 240);
    }));
  }
});

/* ---------- preview ---------- */
let pending = false, ver = 0;
function schedule() { if (pending) return; pending = true; requestAnimationFrame(() => { pending = false; renderPreview(); }); }
let bgEditImg = null;
function syncBgSlider(g, W, H) {
  const cv = bgCover(bgEditImg, W, H), pct = Math.round(g.w / cv.w * 100);
  $('bgScale').value = Math.max(10, Math.min(400, pct)); $('bgScaleVal').textContent = pct + '%'; if (typeof paintRange === 'function') paintRange($('bgScale'));
}
/* The editing outlines appear when the pointer is over the banner/label, and stay while the pointer
   is anywhere inside the picture's own bounds (so you can travel out to a corner dot). */
let hotWrap = null, hotMove = null, hotKey = null;
function clearHot() { if (hotWrap) hotWrap.classList.remove('hot'); if (hotMove) removeEventListener('pointermove', hotMove); hotWrap = hotMove = hotKey = null; }
function setHot(wrap) {
  clearHot(); hotWrap = wrap; hotKey = wrap.dataset.ek; wrap.classList.add('hot');
  hotMove = e => {
    if (!hotWrap || !hotWrap.isConnected) { clearHot(); return; }
    if (hotWrap.classList.contains('editing') || hotWrap === pinWrap) return;
    const r = hotWrap.getBoundingClientRect(); let L = r.left, T = r.top, R = r.right, B = r.bottom;
    hotWrap.querySelectorAll('.bg-box').forEach(b => { if (b.style.display === 'none') return; const q = b.getBoundingClientRect(); L = Math.min(L, q.left); T = Math.min(T, q.top); R = Math.max(R, q.right); B = Math.max(B, q.bottom); });
    const p = 12;
    if (e.clientX < L - p || e.clientX > R + p || e.clientY < T - p || e.clientY > B + p) clearHot();
  };
  addEventListener('pointermove', hotMove);
}
/* Click an editable object to pin it: its outline and corner dots stay visible, wherever the pointer goes,
   until Enter / Esc is pressed or something else is clicked. */
let pinWrap = null, pinKey = null;
function unpin() { const w = pinWrap; pinWrap = pinKey = null; if (w) w.classList.remove('pinned'); clearHot(); }
function pin(wrap) {
  const a = document.activeElement; if (a && a !== document.body && a.blur) a.blur();
  pinWrap = wrap; pinKey = wrap.dataset.ek; setHot(wrap); wrap.classList.add('pinned');
}
const TEXTY = 'input:not([type=range]):not([type=checkbox]):not([type=radio]):not([type=color]), textarea, select, [contenteditable]';
addEventListener('keydown', e => {
  if (!pinWrap || (e.key !== 'Enter' && e.key !== 'Escape')) return;
  const a = document.activeElement; if (a && a.matches && a.matches(TEXTY)) return;
  e.preventDefault(); unpin();
});
addEventListener('pointerdown', e => {
  if (!pinWrap) return;
  if (e.target.closest('.bg-edit')) return;
  if (e.target.closest('#bannerSec, #kitSec, #tagSec') && !e.target.closest('summary')) return;
  unpin();
}, true);
function wireHot(wrap, main, key) {
  wrap.dataset.ek = key;
  main.addEventListener('pointerenter', () => { if (!pinWrap || pinWrap === wrap) setHot(wrap); });
  if (hotKey === key && hotWrap && !hotWrap.isConnected) setHot(wrap);
  if (pinKey === key && pinWrap && !pinWrap.isConnected) pin(wrap);
}
function buildLabelEditor(cv, img, c, indent, z, gap) {
  const W = lwOf(cv), H = lhOf(cv), T = 3, GX = [0, .25, .5, .75, 1].map(v => v * W), GY = [0, .5, 1].map(v => v * H);
  const near = (vals, v) => vals.map(t => ({ t, d: Math.abs(t - v) })).sort((a, b) => a.d - b.d)[0];
  const ar = img.naturalWidth / img.naturalHeight;
  const wrap = el('div', { className: 'bg-edit' }); wrap.style.cssText = `width:${W * z}px;height:${H * z}px;margin:1px 0 ${gap}px ${indent}px`;
  const main = el('img', { className: 'bg-main', src: cv.toDataURL(), width: W * z, height: H * z, alt: '' }); main.draggable = false; main.style.cursor = 'grab';
  const frame = el('div', { className: 'bg-frame' }), box = el('div', { className: 'bg-box img sel' });
  const gv = el('div', { className: 'bg-guide v' }), gh = el('div', { className: 'bg-guide h' });
  const corners = ['nw', 'ne', 'sw', 'se'].map(k => { const d = el('div', { className: 'bg-h ' + k }); d.setAttribute('aria-label', 'Resize'); return [k, d]; });
  wrap.append(main, frame, box, gv, gh, ...corners.map(x => x[1]));
  const geom = () => lblGeom(c, img, W, H);
  const apply = g => { c.imgMode = 'custom'; c.imgPos = { fx: g.x / W, fy: g.y / H, fw: g.w / W, fh: g.h / H }; };
  const place = () => {
    const g = geom();
    box.style.cssText = `left:${g.x * z}px;top:${g.y * z}px;width:${g.w * z}px;height:${g.h * z}px`;
    corners.forEach(([k, d]) => { d.style.left = ((k.includes('e') ? g.x + g.w : g.x) * z) + 'px'; d.style.top = ((k.includes('s') ? g.y + g.h : g.y) * z) + 'px'; });
  };
  let pend = 0, token = 0;
  const live = () => { place(); if (!pend) pend = requestAnimationFrame(async () => { pend = 0; const t = ++token; const r = await renderCustom(c); if (t === token) main.src = r.toDataURL(); }); };
  const guides = (vx, vy) => { gv.style.display = vx == null ? 'none' : 'block'; gh.style.display = vy == null ? 'none' : 'block'; if (vx != null) gv.style.left = vx * z + 'px'; if (vy != null) gh.style.top = vy * z + 'px'; };
  const drag = (ev, onMove) => {
    ev.preventDefault(); ev.stopPropagation();
    const r = wrap.getBoundingClientRect(), g0 = { ...geom() }; wrap.classList.add('editing'); guides(null, null);
    const mv = e => { onMove((e.clientX - r.left) / z, (e.clientY - r.top) / z, (ev.clientX - r.left) / z, (ev.clientY - r.top) / z, g0, e.altKey, e.shiftKey); live(); };
    const up = () => {
      removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
      wrap.classList.remove('editing'); guides(null, null); renderCats(); schedule();
    };
    addEventListener('pointermove', mv); addEventListener('pointerup', up); addEventListener('pointercancel', up);
  };
  const startMove = ev => { if (ev.button !== 0) return; pin(wrap); drag(ev, (px, py, sx, sy, g0, alt) => {
    let x = g0.x + px - sx, y = g0.y + py - sy, gx = null, gy = null;
    if (!alt) {
      const bx = [near(GX, x), near(GX, x + g0.w / 2), near(GX, x + g0.w)], offx = [0, g0.w / 2, g0.w];
      const by = [near(GY, y), near(GY, y + g0.h / 2), near(GY, y + g0.h)], offy = [0, g0.h / 2, g0.h];
      const i = bx.reduce((m, b, n) => b.d < bx[m].d ? n : m, 0); if (bx[i].d <= T) { x = bx[i].t - offx[i]; gx = bx[i].t; }
      const j = by.reduce((m, b, n) => b.d < by[m].d ? n : m, 0); if (by[j].d <= T) { y = by[j].t - offy[j]; gy = by[j].t; }
    }
    apply({ x, y, w: g0.w, h: g0.h }); guides(gx, gy);
  }); };
  main.addEventListener('pointerdown', startMove); box.addEventListener('pointerdown', startMove);
  corners.forEach(([ck, d]) => d.addEventListener('pointerdown', ev => { if (ev.button !== 0) return; pin(wrap); drag(ev, (px, py, sx, sy, g0, alt, shift) => {
    const ax = ck.includes('w') ? g0.x + g0.w : g0.x, ay = ck.includes('n') ? g0.y + g0.h : g0.y, ar0 = g0.w / g0.h;
    const dx = ck.includes('e') ? 1 : -1, dy = ck.includes('s') ? 1 : -1;
    let gx = null, gy = null, w, h;
    if (shift) {
      let mx = px, my = py;
      if (!alt) { const a = near(GX, mx), b = near(GY, my); if (a.d <= T) { mx = a.t; gx = a.t; } if (b.d <= T) { my = b.t; gy = b.t; } }
      w = Math.max(8, (mx - ax) * dx); h = Math.max(4, (my - ay) * dy);
    } else {
      w = Math.max(8, (px - ax) * dx);
      if (!alt) {
        const mx = ax + dx * w, my = ay + dy * w / ar0, sx2 = near(GX, mx), sy2 = near(GY, my);
        if (sx2.d <= T && sx2.d <= sy2.d) { w = Math.max(8, Math.abs(sx2.t - ax)); gx = sx2.t; }
        else if (sy2.d <= T) { w = Math.max(8, Math.abs(sy2.t - ay) * ar0); gy = sy2.t; }
      }
      h = w / ar0;
    }
    apply({ x: dx > 0 ? ax : ax - w, y: dy > 0 ? ay : ay - h, w, h }); guides(gx, gy);
  }); }));
  place(); wireHot(wrap, main, 'lbl-' + c.id);
  return wrap;
}
let bannerSel = 'title';
function syncTextControls() {
  if (S.bannerMode !== 'text') return;
  const W = +S.bannerW || 250, H = Math.round(W * 63 / 250), L = bannerLayout(W, H), ts = Math.round(L.title.size), gs = Math.round(L.tagSize);
  $('kitSize').value = ts; $('kitSizeVal').textContent = ts + ' px';
  $('tagSize').value = gs; $('tagSizeVal').textContent = gs + ' px';
}
const clampSize = v => Math.max(6, Math.min(80, Math.round(v * 2) / 2));
function buildBannerEditor(cv, img, indent, z, gap, en) {
  const W = lwOf(cv), H = lhOf(cv), T = 4, KEYS = ['img', 'title', 'tag'];
  const GX = [0, .25, .5, .75, 1].map(v => v * W), GY = [0, .25, .5, .75, 1].map(v => v * H);
  const near = (vals, v) => vals.map(t => ({ t, d: Math.abs(t - v) })).sort((a, b) => a.d - b.d)[0];
  const wrap = el('div', { className: 'bg-edit' }); wrap.style.cssText = `width:${W * z}px;height:${H * z}px;margin:1px 0 ${gap}px ${indent}px`;
  const main = el('img', { className: 'bg-main', src: cv.toDataURL(), width: W * z, height: H * z, alt: '' }); main.draggable = false;
  const frame = el('div', { className: 'bg-frame' });
  const boxes = {}; KEYS.forEach(k => { boxes[k] = el('div', { className: 'bg-box ' + k }); });
  const gv = el('div', { className: 'bg-guide v' }), gh = el('div', { className: 'bg-guide h' });
  const corners = ['nw', 'ne', 'sw', 'se'].map(k => { const d = el('div', { className: 'bg-h ' + k }); d.setAttribute('aria-label', 'Resize'); return [k, d]; });
  wrap.append(main, frame, boxes.img, boxes.title, boxes.tag, gv, gh, ...corners.map(x => x[1]));
  const objs = () => {
    const L = bannerLayout(W, H), o = {};
    if (img && en.img) o.img = bgGeom(img, W, H);
    ['title', 'tag'].forEach(k => { const t = L[k]; if (t && en[k]) o[k] = { x: t.x - t.w / 2, y: t.y - t.h / 2, w: t.w, h: t.h, size: t.size }; });
    return o;
  };
  const apply = (k, g, resized, g0) => {
    if (k === 'img') { setBgGeom(g, W, H); return; }
    const pos = { fx: (g.x + g.w / 2) / W, fy: (g.y + g.h / 2) / H };
    if (k === 'title') { S.kitPos = pos; if (resized) S.kitSize = clampSize(g0.size * g.w / g0.w); }
    else { S.tagPos = pos; if (resized) S.tagSize = clampSize(g0.size * g.w / g0.w); }
  };
  const place = () => {
    const o = objs(); if (!o[bannerSel]) bannerSel = KEYS.find(k => o[k]) || 'title';
    KEYS.forEach(k => {
      const g = o[k], b = boxes[k];
      b.style.cssText = g ? `left:${g.x * z}px;top:${g.y * z}px;width:${g.w * z}px;height:${g.h * z}px` : 'display:none';
      b.classList.toggle('sel', k === bannerSel);
    });
    const g = o[bannerSel]; if (!g) return;
    corners.forEach(([k, d]) => { d.style.left = ((k.includes('e') ? g.x + g.w : g.x) * z) + 'px'; d.style.top = ((k.includes('s') ? g.y + g.h : g.y) * z) + 'px'; });
    if (bannerSel === 'img' && bgEditImg) syncBgSlider(g, W, H);
    syncTextControls();
  };
  let pend = 0, token = 0;
  const live = () => {
    place();
    if (!pend) pend = requestAnimationFrame(async () => { pend = 0; const t = ++token; const c = await renderTextBanner(); if (t === token) main.src = c.toDataURL(); });
  };
  const guides = (vx, vy) => { gv.style.display = vx == null ? 'none' : 'block'; gh.style.display = vy == null ? 'none' : 'block'; if (vx != null) gv.style.left = vx * z + 'px'; if (vy != null) gh.style.top = vy * z + 'px'; };
  const drag = (ev, k, onMove) => {
    ev.preventDefault(); ev.stopPropagation();
    const r = wrap.getBoundingClientRect(), g0 = { ...objs()[k] }; wrap.classList.add('editing'); guides(null, null);
    const mv = e => { onMove((e.clientX - r.left) / z, (e.clientY - r.top) / z, (ev.clientX - r.left) / z, (ev.clientY - r.top) / z, g0, e.altKey, e.shiftKey); live(); };
    const up = () => {
      removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
      wrap.classList.remove('editing'); guides(null, null); schedule();
    };
    addEventListener('pointermove', mv); addEventListener('pointerup', up); addEventListener('pointercancel', up);
  };
  const hit = (px, py) => {
    const o = objs(), pad = 2;
    for (const k of ['tag', 'title']) { const g = o[k]; if (g && px >= g.x - pad && px <= g.x + g.w + pad && py >= g.y - pad && py <= g.y + g.h + pad) return k; }
    return o.img ? 'img' : null;
  };
  const toLocal = ev => { const r = wrap.getBoundingClientRect(); return [(ev.clientX - r.left) / z, (ev.clientY - r.top) / z]; };
  main.addEventListener('pointermove', ev => { if (!wrap.classList.contains('editing')) main.style.cursor = hit(...toLocal(ev)) ? 'grab' : 'default'; });
  const startMove = ev => {
    if (ev.button !== 0) return;
    const k = hit(...toLocal(ev)); if (!k) return;
    bannerSel = k; place(); pin(wrap);
    drag(ev, k, (px, py, sx, sy, g0, alt) => {
      let x = g0.x + px - sx, y = g0.y + py - sy, gx = null, gy = null;
      if (!alt) {
        const bx = [near(GX, x), near(GX, x + g0.w / 2), near(GX, x + g0.w)], offx = [0, g0.w / 2, g0.w];
        const by = [near(GY, y), near(GY, y + g0.h / 2), near(GY, y + g0.h)], offy = [0, g0.h / 2, g0.h];
        const i = bx.reduce((m, b, n) => b.d < bx[m].d ? n : m, 0); if (bx[i].d <= T) { x = bx[i].t - offx[i]; gx = bx[i].t; }
        const j = by.reduce((m, b, n) => b.d < by[m].d ? n : m, 0); if (by[j].d <= T) { y = by[j].t - offy[j]; gy = by[j].t; }
      }
      apply(k, { x, y, w: g0.w, h: g0.h }, false, g0); guides(gx, gy);
    });
  };
  main.addEventListener('pointerdown', startMove); Object.values(boxes).forEach(b => b.addEventListener('pointerdown', startMove));
  corners.forEach(([ck, d]) => d.addEventListener('pointerdown', ev => {
    if (ev.button !== 0) return;
    const k = bannerSel; pin(wrap);
    drag(ev, k, (px, py, sx, sy, g0, alt, shift) => {
      const ax = ck.includes('w') ? g0.x + g0.w : g0.x, ay = ck.includes('n') ? g0.y + g0.h : g0.y, ar0 = g0.w / g0.h;
      const dx = ck.includes('e') ? 1 : -1, dy = ck.includes('s') ? 1 : -1, MIN = k === 'img' ? 16 : 10;
      let gx = null, gy = null, w, h;
      if (shift && k === 'img') {
        // free stretch: the corner follows the pointer on both axes
        let mx = px, my = py;
        if (!alt) { const a = near(GX, mx), b = near(GY, my); if (a.d <= T) { mx = a.t; gx = a.t; } if (b.d <= T) { my = b.t; gy = b.t; } }
        w = Math.max(MIN, (mx - ax) * dx); h = Math.max(MIN, (my - ay) * dy);
      } else {
        w = Math.max(MIN, (px - ax) * dx);
        if (!alt) {
          const mx = ax + dx * w, my = ay + dy * w / ar0, sx2 = near(GX, mx), sy2 = near(GY, my);
          if (sx2.d <= T && sx2.d <= sy2.d) { w = Math.max(MIN, Math.abs(sx2.t - ax)); gx = sx2.t; }
          else if (sy2.d <= T) { w = Math.max(MIN, Math.abs(sy2.t - ay) * ar0); gy = sy2.t; }
        }
        h = w / ar0;
      }
      apply(k, { x: dx > 0 ? ax : ax - w, y: dy > 0 ? ay : ay - h, w, h }, true, g0); guides(gx, gy);
    });
  }));
  place(); wireHot(wrap, main, 'banner');
  return wrap;
}
$('bgScale').addEventListener('input', () => {
  if (!bgEditImg) return;
  const W = +S.bannerW || 250, H = Math.round(W * 63 / 250), g = bgGeom(bgEditImg, W, H), cv = bgCover(bgEditImg, W, H);
  const w = cv.w * $('bgScale').value / 100, u = (W / 2 - g.x) / g.w, v = (H / 2 - g.y) / g.h, h2 = w * g.h / g.w;
  setBgGeom({ x: W / 2 - u * w, y: H / 2 - v * h2, w, h: h2 }, W, H);
  $('bgScaleVal').textContent = $('bgScale').value + '%'; schedule();
});
$('bgReset').onclick = () => { S.bannerBgPos = null; schedule(); };
/* the preview can be edited only while one of the dropdowns (or a folder's options) is open */
function syncPreviewLock() {
  const open = [...document.querySelectorAll('details.disclosure')].some(d => d.open) || expanded.size > 0;
  const fl = $('fl'); if (fl) fl.classList.toggle('locked', !open);
  if (open) dropSnap(); else snapSoon();
}
document.addEventListener('toggle', syncPreviewLock, true);
/* ---------- the preview as one still picture ----------
   Between changes the preview is shown as a single image drawn from the live preview, pixel for
   pixel at the screen's real resolution. Scaling a picture moves text, icons and labels together,
   so the hover lift can grow everything by exactly the same amount with no text snapping or label
   shimmer. Any change re-renders the live preview and takes a fresh picture. While a section is
   open for editing, the live preview stays (dragging works) and the box doesn't lift. */
let SNAP_T = 0, SNAP_V = 0;
function dropSnap() { SNAP_V++; const fl = $('fl'); if (!fl) return; fl.classList.remove('snap'); fl.querySelectorAll('.fl-snap').forEach(c => { if (c.src) URL.revokeObjectURL(c.src); c.remove(); }); }
function snapSoon() { clearTimeout(SNAP_T); dropSnap(); if (PREVIEW) return; /* hovering through a list: picture comes after the choice */ SNAP_T = setTimeout(takeSnap, 90); }
// Resizing the window: the page rescales every frame (cheap), but the expensive work — redrawing the
// preview's labels at the new sharpness and retaking its picture — waits until the resize settles,
// so dragging the window edge stays smooth. Until then the current preview simply scales along.
let RESIZE_T = 0;
// FL Studio's icons arrive a moment after start (or when the person loads them): redraw with them
if (window.FLI) FLI.onChange(() => { renderCats(); schedule(); PICKERS.forEach(p => p.refresh()); bulkIconRefresh(); });
addEventListener('resize', () => {
  clearTimeout(SNAP_T); clearTimeout(RESIZE_T);
  RESIZE_T = setTimeout(() => { schedule(); snapSoon(); }, 160);
});
const svgImg = svg => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg)); });
// the moving background holds still for the moment the picture takes, so the two don't compete
async function takeSnap() { window.DKD_BG_HOLD = true; try { await makeSnap(); } finally { window.DKD_BG_HOLD = false; } }
async function makeSnap() {
  const fl = $('fl'); if (!fl || !fl.classList.contains('locked') || !fl.childElementCount) return;
  const v = ++SNAP_V;
  try { await document.fonts.ready; } catch (e) { }
  await Promise.all([...fl.querySelectorAll('img:not(.fl-snap)')].map(i => i.decode ? i.decode().catch(() => { }) : null));
  if (v !== SNAP_V || !fl.classList.contains('locked')) return;
  // everything is drawn straight at final screen pixels (k = page zoom x display scale), the way the
  // browser draws the live preview, so glyphs and images rasterize the same way
  const Z = window.DKD_ZOOM || 1, dpr = window.devicePixelRatio || 1, k = Z * dpr;
  const W = fl.offsetWidth, H = fl.offsetHeight, R = fl.getBoundingClientRect();
  const cv = document.createElement('canvas'); cv.className = 'fl-snap';
  cv.width = Math.round(W * k); cv.height = Math.round(H * k);
  cv.style.width = W + 'px'; cv.style.height = H + 'px';
  // opaque: lets Windows use the same ClearType text smoothing as the live text
  const g = cv.getContext('2d', { alpha: false, willReadFrequently: true }); // CPU-backed: quick to turn into an image
  const cs = getComputedStyle(fl); g.fillStyle = cs.backgroundColor; g.fillRect(0, 0, cv.width, cv.height);
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
  const dev = r => ({ x: (r.left - R.left) * k, y: (r.top - R.top) * k, w: r.width * k, h: r.height * k });
  const svgs = [...fl.querySelectorAll('svg')], icons = await Promise.all(svgs.map(svgImg));
  if (v !== SNAP_V) return;
  svgs.forEach((sv, i) => { if (icons[i]) { const r = dev(sv.getBoundingClientRect()); g.drawImage(icons[i], r.x, r.y, r.w, r.h); } });
  fl.querySelectorAll('img:not(.fl-snap)').forEach(im => { const r = dev(im.getBoundingClientRect()); if (r.w && r.h) g.drawImage(im, r.x, r.y, r.w, r.h); });
  const walker = document.createTreeWalker(fl, NodeFilter.SHOW_TEXT);
  for (let t = walker.nextNode(); t; t = walker.nextNode()) {
    const txt = t.textContent; if (!txt.trim()) continue;
    const pe = t.parentElement, st = getComputedStyle(pe), range = document.createRange(); range.selectNodeContents(t);
    const rr = range.getBoundingClientRect(); // ranges report on-screen pixels
    const x = (rr.left / Z - R.left) * k, y = (rr.top / Z - R.top) * k, h = rr.height / Z * k;
    g.font = `${st.fontStyle} ${st.fontWeight} ${parseFloat(st.fontSize) * k}px ${st.fontFamily}`;
    g.fillStyle = st.color; g.textBaseline = 'alphabetic';
    const m = g.measureText(txt), asc = m.fontBoundingBoxAscent, desc = m.fontBoundingBoxDescent;
    g.fillText(txt, x, Math.round(y + (h - (asc + desc)) / 2 + asc));
  }
  if (v !== SNAP_V || !fl.classList.contains('locked')) return;
  // shown as a plain image rather than a drawing surface: a live canvas composited over the WebGL
  // background can show as a patch of static on some graphics drivers
  const t0 = performance.now();
  const blob = await new Promise(r => cv.toBlob(r, 'image/png'));
  window.DKD_SNAP_ENC = performance.now() - t0;
  if (!blob || v !== SNAP_V || !fl.classList.contains('locked')) return;
  const img = new Image(); img.className = 'fl-snap'; img.alt = ''; img.draggable = false;
  img.style.width = W + 'px'; img.style.height = H + 'px';
  img.src = URL.createObjectURL(blob);
  try { await img.decode(); } catch (e) { }
  if (v !== SNAP_V || !fl.classList.contains('locked')) { URL.revokeObjectURL(img.src); return; }
  fl.querySelectorAll('.fl-snap').forEach(c => { if (c.src) URL.revokeObjectURL(c.src); c.remove(); });
  fl.appendChild(img); fl.classList.add('snap');
}
async function renderPreview() {
  const my = ++ver; save(); if (!PREVIEW) histSoon();
  $('sizeVal').textContent = S.size + ' px';
  $('outlineVal').textContent = S.outline ? S.outline + ' px' : 'Off'; $('shadowVal').textContent = +S.shadow ? S.shadow + ' px' : 'Off';
  $('kitColor').disabled = !S.kitColorOn; $('outlineColor').disabled = !S.outline;
  $('bannerValue').textContent = { none: 'None', image: 'Custom image', color: 'Custom color' }[S.bannerBgMode] || 'None';
  $('bgColorRow').hidden = S.bannerBgMode !== 'color';
  document.querySelectorAll('#bannerBgSeg button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.bannerBgMode));
  $('bgImgRow').hidden = S.bannerBgMode !== 'image';
  let bgImg = null;
  if (S.bannerMode === 'text' && S.bannerBgMode === 'image' && S.bannerBgImage) {
    const rec = BGIMGS.find(r => r.id === S.bannerBgImage);
    if (rec) bgImg = await loadImg(rec.data).catch(() => null);
  }
  bgEditImg = bgImg; syncTextControls();
  for (const p of ['kit', 'tag']) { $(p + 'OutlineVal').textContent = S[p + 'Outline'] ? S[p + 'Outline'] + ' px' : 'Off'; $(p + 'OutlineColor').disabled = !S[p + 'Outline']; }
  $('kitValue').textContent = S.kitName.trim() || 'My Drum Kit'; $('tagValue').textContent = S.tip.trim() || '@yourname';
  $('kitTextOpts').hidden = $('tagTextOpts').hidden = S.bannerMode !== 'text';
  $('bgPosRow').hidden = !bgImg;
  if (bgImg) { const W = +S.bannerW || 250; syncBgSlider(bgGeom(bgImg, W, Math.round(W * 63 / 250)), W, Math.round(W * 63 / 250)); }
  $('styleValue').textContent = `${fontOf(S.font).label}, ${S.size} px`;

  await ensureFont(fontOf(S.font), S.size);
  // at 2x the preview's images are drawn at the screen's real pixel density, so they stay sharp
  const RS = S.zoom >= 2 ? Math.min(6, S.zoom * (window.DKD_ZOOM || 1) * (window.devicePixelRatio || 1)) : 1;
  const bc = await bannerCanvas(RS).catch(() => null);
  const labels = [];
  const lblImgs = [];
  for (let i = 0; i < S.cats.length; i++) { labels.push(await labelCanvas(S.cats[i], i, RS).catch(() => null)); lblImgs.push(labelKind(S.cats[i]) === 'img' ? await loadImg(S.cats[i].img).catch(() => null) : null); }
  if (my !== ver) return;

  document.documentElement.style.setProperty('--side-w', Math.max(340, Math.round(280 * S.zoom + 60)) + 'px');
  const fl = $('fl'), z = S.zoom, gap = Math.round((+S.heightOfs || 0) * z * .6);
  fl.innerHTML = ''; fl.classList.toggle('zoom', z >= 2);
  const row = (icon, text, color, indent) => {
    const t = el('span', { textContent: text }); if (color) t.style.color = color;
    const r = el('div', { className: 'fl-row' }, el('span', { innerHTML: iconSVG(icon, z, color), style: 'display:inline-flex;gap:3px;align-items:center' }), t);
    r.style.cssText += `padding-left:${indent}px;font-size:${13 * z}px;height:${22 * z}px`;
    fl.appendChild(r);
  };
  const img = (cv, indent) => {
    if (!cv) return;
    const i = el('img', { src: cv.toDataURL(), width: lwOf(cv) * z, height: lhOf(cv) * z, alt: '' });
    i.style.cssText = `margin:1px 0 ${gap}px ${indent}px`;
    fl.appendChild(i);
  };
  syncPreviewLock();
  row(S.kitIcon, kitFolder(), S.kitColorOn ? S.kitColor : '', 8 * z);
  const en = S.bannerMode === 'text' ? { img: !!bgImg && $('bannerSec').open, title: $('kitSec').open, tag: $('tagSec').open } : {};
  if (bc && (en.img || en.title || en.tag)) fl.appendChild(buildBannerEditor(bc, bgImg, 30 * z, z, gap, en)); else img(bc, 30 * z);
  S.cats.forEach((c, i) => {
    row(c.icon, catFolder(c, i), c.colorOn ? c.color : '', 26 * z);
    if (labels[i] && lblImgs[i] && expanded.has(c.id) && c.imgMode !== 'original') fl.appendChild(buildLabelEditor(labels[i], lblImgs[i], c, 48 * z, z, gap)); else img(labels[i], 48 * z);
  });

  const sideEl = document.querySelector('.side'); sideEl.classList.remove('tall'); if (sideEl.offsetHeight > innerHeight - 48) sideEl.classList.add('tall');
  const placed = FILES.filter(f => f.cat), bytes = placed.reduce((a, f) => a + f.file.size, 0), un = FILES.length - placed.length;
  $('summary').textContent = `${S.cats.length} folder${S.cats.length === 1 ? '' : 's'} · ${placed.length} sample${placed.length === 1 ? '' : 's'}` + (bytes ? ` · ${fmtBytes(bytes)}` : '') + (un ? ` · ${un} unsorted` : '') + (FILES.length ? '' : ' — drop samples anywhere to start');
  const names = S.cats.map((c, i) => catFolder(c, i).toLowerCase()), dup = names.find((n, i) => names.indexOf(n) !== i);
  if (dup) setStatus(`Two folders are named "${dup}". Rename one so they don't merge.`, 'err');
  snapSoon();
}

/* ---------- drag a folder by its handle to reorder ----------
   Works with mixed row heights (an expanded folder slides as one block). */
function startFolderDrag(e, item) {
  if (e.button !== 0) return;
  e.preventDefault();
  const wrap = $('cats'), items = [...wrap.children], from = items.indexOf(item);
  if (from < 0 || items.length < 2) return;
  // dragging a selected folder carries every selected folder with it
  const groupIdx = selectedCats.size > 1 && selectedCats.has(item.dataset.id)
    ? items.map((x, i) => i).filter(i => selectedCats.has(items[i].dataset.id)) : [from];
  const inGroup = new Set(groupIdx), rest = items.map((x, i) => i).filter(i => !inGroup.has(i));
  const rects = items.map(x => { const r = x.getBoundingClientRect(); return { top: r.top + scrollY, h: r.height, mid: r.top + scrollY + r.height / 2 }; });
  const base = rects[0].top, listBottom = rects[items.length - 1].top + rects[items.length - 1].h;
  const Hg = groupIdx.reduce((a, i) => a + rects[i].h, 0);
  const y0 = e.pageY;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let dragging = false, slot = rest.filter(i => i < from).length;
  // final top of every row if the group were dropped at `slot` (= number of other folders above it)
  const layout = sl => {
    const tops = {}; let y = base;
    const put = i => { tops[i] = y; y += rects[i].h; };
    rest.forEach((i, k) => { if (k === sl) groupIdx.forEach(put); put(i); });
    if (sl >= rest.length) groupIdx.forEach(put);
    return tops;
  };
  const move = ev => {
    const dy = ev.pageY - y0;
    if (!dragging) {
      if (Math.abs(dy) < 5) return;
      dragging = true; wrap.classList.add('reordering');
      groupIdx.forEach(i => items[i].classList.add('lifted'));
    }
    ev.preventDefault();
    const cur = rects[from].mid + dy;
    slot = rest.filter(i => rects[i].mid < cur).length;
    const gTop = Math.min(...groupIdx.map(i => rects[i].top)), gBot = Math.max(...groupIdx.map(i => rects[i].top + rects[i].h));
    const cdy = Math.max(base - gTop, Math.min(listBottom - gBot, dy));
    groupIdx.forEach(i => { items[i].style.transform = `translateY(${cdy}px)`; });
    const tops = layout(slot);
    rest.forEach(i => { const sh = tops[i] - rects[i].top; items[i].style.transform = sh ? `translateY(${sh}px)` : ''; });
    if (ev.clientY < 70) scrollBy(0, -12);
    else if (ev.clientY > innerHeight - 70) scrollBy(0, 12);
  };
  const up = () => {
    removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
    if (!dragging) return;
    const tops = layout(slot);
    groupIdx.forEach(i => { items[i].classList.remove('lifted'); items[i].classList.add('settling'); items[i].style.transform = `translateY(${tops[i] - rects[i].top}px)`; });
    setTimeout(() => {
      wrap.classList.remove('reordering');
      const order = [...rest.slice(0, slot), ...groupIdx, ...rest.slice(slot)];
      const cats = order.map(i => S.cats.find(c => c.id === items[i].dataset.id));
      if (cats.every(Boolean) && cats.length === S.cats.length) S.cats = cats;
      renderCats(); schedule();
    }, reduce ? 0 : 240);
  };
  addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
}

/* ---------- drag a box on the background to select folders ---------- */
const marquee = el('div', { id: 'marquee' }); marquee.hidden = true; document.body.appendChild(marquee);
function updateBulkPanel() {
  const n = selectedCats.size, panel = $('bulkPanel');
  panel.hidden = n === 0;
  if (n) {
    const bc = $('bulkCount'), btxt = n === S.cats.length && n > 1 ? 'All folders selected' : n + (n === 1 ? ' folder selected' : ' folders selected');
    if (bc.textContent !== btxt) { bc.textContent = btxt; bc.classList.remove('tick'); void bc.offsetWidth; bc.classList.add('tick'); }
    const sel = S.cats.filter(c => selectedCats.has(c.id));
    if (sel.length) {
      $('bulkColor').value = sel[0].color; $('bulkColorOn').checked = sel[0].colorOn;
      $('bulkGradA').value = sel[0].color; $('bulkGradB').value = sel[sel.length - 1].color;
    }
    $('bulkName').value = ''; $('bulkIcon').value = ''; $('bulkIconNum').hidden = true; bulkIconRefresh();
    const gen = sel.filter(c => labelKind(c) === 'gen'); $('bulkGen').hidden = !gen.length;
    if (gen.length) {
      const st = gen.map(labelStyle), fonts = new Set(st.map(x => x.font)), sizes = new Set(st.map(x => x.size));
      bulkFontCur = FONTS.some(f => f.id === st[0].font) ? st[0].font : S.font; bulkFontPicker && bulkFontPicker.refresh();
      $('bulkOutline').value = st[0].outline; $('bulkOutlineColor').value = st[0].outlineColor; $('bulkOutlineColor').disabled = !(+st[0].outline);
      $('bulkOutlineVal').textContent = new Set(st.map(x => +x.outline)).size > 1 ? 'Mixed' : (+st[0].outline ? st[0].outline + ' px' : 'Off');
      $('bulkShadow').value = st[0].shadow; $('bulkShadowVal').textContent = new Set(st.map(x => x.shadow)).size > 1 ? 'Mixed' : (st[0].shadow ? st[0].shadow + ' px' : 'Off');
      $('bulkSize').value = st[0].size; $('bulkSizeVal').textContent = sizes.size === 1 ? st[0].size + ' px' : 'Mixed';
      $('bulkGenTitle').textContent = gen.length === sel.length ? 'Generated labels' : `Generated labels (${gen.length} of ${sel.length})`;
      $('bulkFontHost').title = fonts.size > 1 ? 'The selected folders use different fonts' : '';
    }
    const withImg = sel.filter(c => labelKind(c) === 'img'); $('bulkImg').hidden = !withImg.length;
    if (withImg.length) {
      const fit = $('bulkFit'); fit.innerHTML = '';
      fit.add(new Option(`Fit label size… (${withImg.length} image${withImg.length > 1 ? 's' : ''})`, ''));
      [...new Set([S.lh, 30, 40, 50, 60, 80])].forEach(hh => fit.add(new Option(`Fit label · ${S.lw}×${hh}` + (hh === S.lh ? ' (default)' : ''), hh)));
      const modes = new Set(withImg.map(c => c.imgMode || 'fit')), hs = new Set(withImg.map(c => c.imgH || S.lh));
      fit.value = modes.size === 1 && modes.has('fit') && hs.size === 1 ? String([...hs][0]) : '';
      document.querySelectorAll('#bulkImgSeg button').forEach(b => b.setAttribute('aria-pressed', modes.size === 1 && modes.has(b.dataset.v)));
    }
    if (typeof paintRange === 'function') panel.querySelectorAll('input[type=range]').forEach(paintRange);
  }
}
function setSelection(ids) {
  selectedCats.clear(); ids.forEach(id => selectedCats.add(id));
  document.querySelectorAll('#cats .folder').forEach(d => d.classList.toggle('selected', selectedCats.has(d.dataset.id)));
  updateBulkPanel();
}
addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  if (e.target.closest('input, button, select, label, a, summary, .folder, .font-drop, .fl, .seg, #bulkPanel, #fontSel, #cropStage, .fp-pop')) return;
  const x0 = e.clientX, y0 = e.clientY;
  let active = false;
  document.body.classList.add('marquee-on');
  function move(ev) {
    const x = ev.clientX, y = ev.clientY;
    if (!active) {
      if (Math.abs(x - x0) < 5 && Math.abs(y - y0) < 5) return;
      active = true; marquee.hidden = false;
    }
    ev.preventDefault();
    const L = Math.min(x0, x), T = Math.min(y0, y), W = Math.abs(x - x0), H = Math.abs(y - y0);
    marquee.style.cssText = `left:${L}px;top:${T}px;width:${W}px;height:${H}px`;
    marquee.hidden = false;
    const hit = [], P = 2; // a row counts as soon as the box touches it
    document.querySelectorAll('#cats .folder').forEach(d => {
      const r = d.getBoundingClientRect();
      const on = r.left <= L + W + P && r.right >= L - P && r.top <= T + H + P && r.bottom >= T - P;
      d.classList.toggle('selected', on);
      if (on) hit.push(d.dataset.id);
    });
    marquee.dataset.hit = hit.join(',');
    const fh = [];
    const cr = $('fontList').getBoundingClientRect();
    document.querySelectorAll('#fontList li.custom').forEach(li => {
      const r = li.getBoundingClientRect();
      const on = r.top < cr.bottom && r.bottom > cr.top && r.left <= L + W + P && r.right >= L - P && r.top <= T + H + P && r.bottom >= T - P;
      li.classList.toggle('selected', on); if (on) fh.push(li.dataset.id);
    });
    marquee.dataset.fhit = fh.join(',');
  }
  function up(ev) {
    removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
    if (active && ev && ev.type === 'pointerup') move(ev); // use the exact release point
    document.body.classList.remove('marquee-on');
    if (active) {
      setSelection(marquee.dataset.hit ? marquee.dataset.hit.split(',').filter(Boolean) : []);
      setFontSelection(marquee.dataset.fhit ? marquee.dataset.fhit.split(',').filter(Boolean) : []);
      marquee.hidden = true; marquee.dataset.hit = marquee.dataset.fhit = '';
    } else { if (selectedCats.size) setSelection([]); if (selectedFonts.size) setFontSelection([]); } // plain click on the background clears
  }
  addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
});
addEventListener('keydown', e => { if (e.key === 'Escape' && $('confirmDlg').hidden) { if (selectedCats.size) setSelection([]); if (selectedFonts.size) setFontSelection([]); } });

let bulkFontCur = '', bulkFontPicker = null, bulkIconRefresh = () => { };
/* bulk controls apply to every selected folder */
const eachSel = fn => { let n = 0; S.cats.forEach(c => { if (selectedCats.has(c.id)) { fn(c); n++; } }); if (n) { renderCats(); schedule(); } };
{
  const bi = $('bulkIcon');
  bi.innerHTML = ''; bi.add(new Option('Leave as is', ''));
  ICONS.forEach(([v, t]) => bi.add(new Option(t, v)));
  $('bulkName').addEventListener('input', () => { const v = $('bulkName').value; eachSel(c => { c.name = v; }); });
  let savedIcons = null;
  const bhost = el('div', { className: 'fp' }); bi.hidden = true; bi.after(bhost);
  const bp = optionPicker(bhost, {
    options: [['', 'Leave as is'], ...ICONS], label: 'Icon for selected folders', icons: true, get: () => bi.value,
    commit: v => { savedIcons = null; bi.value = v; bi.onchange(); },
    temp: v => {
      if (!savedIcons) savedIcons = new Map(S.cats.filter(c => selectedCats.has(c.id)).map(c => [c, c.icon]));
      savedIcons.forEach((ic, c) => { c.icon = (v === '' || v === 'custom') ? ic : v; }); schedule();
    },
    revert: () => { if (savedIcons) { savedIcons.forEach((ic, c) => { c.icon = ic; }); savedIcons = null; } }
  });
  bulkIconRefresh = bp.refresh;
  bi.onchange = () => {
    if (bi.value === 'custom') { $('bulkIconNum').hidden = false; $('bulkIconNum').value = $('bulkIconNum').value || '1'; eachSel(c => { c.icon = $('bulkIconNum').value; }); $('bulkIconNum').focus(); }
    else { $('bulkIconNum').hidden = true; if (bi.value !== '') eachSel(c => { c.icon = bi.value; }); }
  };
  $('bulkIconNum').addEventListener('input', () => { const v = $('bulkIconNum').value || 'none'; eachSel(c => { c.icon = v; }); });
  // copy: the icon the selected folders share (or the one just chosen here); paste: onto all of them
  $('bulkIconNum').after(iconCopyPaste(() => {
    if (bi.value === 'custom') return $('bulkIconNum').value || null;
    if (bi.value !== '') return bi.value;
    const set = new Set(S.cats.filter(c => selectedCats.has(c.id)).map(c => String(c.icon)));
    return set.size === 1 ? [...set][0] : null;
  }, v => {
    const k = KNOWN_ICONS.includes(v) || v === 'none';
    bi.value = k ? v : 'custom'; $('bulkIconNum').hidden = k; if (!k) $('bulkIconNum').value = v;
    bp.refresh(); eachSel(c => { c.icon = v; }); histCommit();
  }));
  // coloring folders from here recolors their labels too: a folder's own saved label color would
  // otherwise keep its label the old color while the name changes
  const followName = c => { if (c.ls && 'color' in c.ls) delete c.ls.color; };
  $('bulkColor').addEventListener('input', () => { const v = $('bulkColor').value; $('bulkColorOn').checked = true; eachSel(c => { c.color = v; c.colorOn = true; followName(c); }); });
  $('bulkColorOn').addEventListener('change', () => { const on = $('bulkColorOn').checked; eachSel(c => { c.colorOn = on; }); });
  // Gradient: top color on the first selected folder, bottom on the last,
  // every folder between blended step by step.
  const lerpHex = (a, b, k) => '#' + [0, 2, 4].map(i => {
    const x = parseInt(a.slice(1 + i, 3 + i), 16), y = parseInt(b.slice(1 + i, 3 + i), 16);
    return Math.round(x + (y - x) * k).toString(16).padStart(2, '0');
  }).join('');
  const applyGradient = () => {
    const A = $('bulkGradA').value, B = $('bulkGradB').value;
    const sel = S.cats.filter(c => selectedCats.has(c.id));
    sel.forEach((c, i) => { c.color = sel.length === 1 ? A : lerpHex(A, B, i / (sel.length - 1)); c.colorOn = true; followName(c); });
    if (sel.length) { $('bulkColorOn').checked = true; renderCats(); schedule(); }
  };
  $('bulkGradA').addEventListener('input', applyGradient);
  $('bulkGradB').addEventListener('input', applyGradient);
  $('bulkClear').onclick = () => setSelection([]);
  // generated labels: one font and one size for every selected folder that uses a generated label
  const genCats = () => S.cats.filter(c => selectedCats.has(c.id) && labelKind(c) === 'gen');
  const setLs = (k, v) => genCats().forEach(c => { (c.ls || (c.ls = {}))[k] = v; });
  let savedLs = null;
  bulkFontPicker = fontPicker($('bulkFontHost'), {
    label: 'Label font for selected folders', get: () => bulkFontCur,
    commit: v => { savedLs = null; bulkFontCur = v; setLs('font', v); renderCats(); schedule(); },
    temp: v => { if (!savedLs) savedLs = new Map(genCats().map(c => [c, c.ls ? JSON.parse(JSON.stringify(c.ls)) : null])); setLs('font', v); schedule(); },
    revert: () => { if (savedLs) { savedLs.forEach((ls, c) => { if (ls) c.ls = ls; else delete c.ls; }); savedLs = null; } }
  });
  $('bulkSize').oninput = () => { $('bulkSizeVal').textContent = $('bulkSize').value + ' px'; setLs('size', +$('bulkSize').value); schedule(); };
  $('bulkSize').onchange = () => { renderCats(); updateBulkPanel(); };
  $('bulkOutline').oninput = () => { const v = +$('bulkOutline').value; $('bulkOutlineVal').textContent = v ? v + ' px' : 'Off'; $('bulkOutlineColor').disabled = !v; setLs('outline', v); if (v) setLs('outlineColor', $('bulkOutlineColor').value); schedule(); };
  $('bulkOutlineColor').oninput = () => { setLs('outlineColor', $('bulkOutlineColor').value); schedule(); };
  $('bulkShadow').oninput = () => { const v = +$('bulkShadow').value; $('bulkShadowVal').textContent = v ? v + ' px' : 'Off'; setLs('shadow', v); schedule(); };
  $('bulkOutline').onchange = $('bulkOutlineColor').onchange = $('bulkShadow').onchange = () => { renderCats(); updateBulkPanel(); };
  // label images: apply one size choice to every selected folder that has its own image
  const imgCats = () => S.cats.filter(c => selectedCats.has(c.id) && labelKind(c) === 'img');
  const imgDone = () => { renderCats(); schedule(); updateBulkPanel(); };
  $('bulkFit').onchange = async () => {
    const v = $('bulkFit').value; if (!v) return; const hh = +v;
    for (const c of imgCats()) { c.imgH = hh === S.lh ? null : hh; if (c.imgMode === 'custom') c.imgPos = await fitPos(c); else c.imgMode = 'fit'; }
    imgDone();
  };
  document.querySelectorAll('#bulkImgSeg button').forEach(b => b.onclick = async () => {
    for (const c of imgCats()) { if (b.dataset.v === 'custom' && c.imgMode !== 'custom') c.imgPos = await fitPos(c); c.imgMode = b.dataset.v; }
    imgDone();
  });
  $('bulkDelete').onclick = () => {
    const ids0 = new Set(selectedCats); if (!ids0.size) return;
    const cnt = FILES.filter(f => ids0.has(f.cat)).length, k = ids0.size;
    confirmDelete(`Delete ${k} folder${k > 1 ? 's' : ''}?`, cnt ? `The ${cnt} sample${cnt > 1 ? 's' : ''} in ${k > 1 ? 'them' : 'it'} won't be deleted, but will need a new folder. You can undo with Ctrl+Z.` : 'You can undo with Ctrl+Z.', k > 1 ? 'Delete folders' : 'Delete folder', doBulkDelete);
  };
  const doBulkDelete = () => collapseFolders(new Set(selectedCats), () => {
    const ids = new Set(selectedCats); if (!ids.size) return;
    const n = ids.size; let moved = 0;
    FILES.forEach(f => { if (ids.has(f.cat)) { f.cat = null; moved++; } });
    S.cats = S.cats.filter(c => !ids.has(c.id));
    ids.forEach(id => expanded.delete(id));
    if (!S.cats.length) S.cats.push(newCat());
    setSelection([]); renderCats(); schedule();
    setStatus(`Deleted ${n} folder${n > 1 ? 's' : ''}.` + (moved ? ` Their ${moved} sample${moved > 1 ? 's' : ''} need a new folder.` : ''));
  });
}

/* "Are you sure?" before anything gets deleted */
let confirmYes = null, confirmFrom = null;
function collapseFolders(ids, done) { // rows shrink away, then the real delete happens
  const els = [...$('cats').children].filter(x => ids.has(x.dataset.id));
  if (!els.length || matchMedia('(prefers-reduced-motion: reduce)').matches) { done(); return; }
  els.forEach(x => { x.style.height = x.getBoundingClientRect().height + 'px'; x.classList.add('leave'); });
  requestAnimationFrame(() => requestAnimationFrame(() => els.forEach(x => { x.style.height = '0px'; })));
  setTimeout(done, 190);
}
function confirmDelete(title, text, yesLabel, onYes, safe) {
  confirmYes = onYes; confirmFrom = document.activeElement;
  $('confTitle').textContent = title; $('confText').textContent = text; $('confYes').textContent = yesLabel;
  $('confYes').classList.toggle('danger-btn', !safe);
  $('confirmDlg').classList.remove('closing'); $('confirmDlg').hidden = false; $('confNo').focus();
}
function hideModal(m) { // play the exit animation, then actually hide
  if (m.hidden) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { m.hidden = true; return; }
  m.classList.add('closing');
  setTimeout(() => { if (!m.classList.contains('closing')) return; /* reopened meanwhile */ m.classList.remove('closing'); m.hidden = true; }, 150);
}
function closeConfirm(run) {
  const f = confirmYes, from = confirmFrom; confirmYes = confirmFrom = null; hideModal($('confirmDlg'));
  if (run && f) f(); else if (from && from.isConnected && from.focus) from.focus();
}
$('confYes').onclick = () => closeConfirm(true);
$('confNo').onclick = () => closeConfirm(false);
$('confirmDlg').addEventListener('pointerdown', e => { if (e.target === $('confirmDlg')) closeConfirm(false); });
addEventListener('keydown', e => { if (e.key === 'Escape' && !$('confirmDlg').hidden) { e.preventDefault(); closeConfirm(false); } });

// Enter leaves the text box you're typing in
addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const t = e.target;
  if (t && t.tagName === 'INPUT' && (t.type === 'text' || t.type === 'number')) { e.preventDefault(); t.blur(); }
});

$('bannerSec').addEventListener('toggle', () => schedule());
$('kitReset').onclick = () => { S.kitPos = null; S.kitSize = null; schedule(); };
$('tagReset').onclick = () => { S.tagPos = null; S.tagSize = null; schedule(); };
$('kitSec').addEventListener('toggle', () => schedule());
$('tagSec').addEventListener('toggle', () => schedule());

/* ---------- undo / redo ----------
   Snapshots of the whole kit setup (not the sample files). Quick changes in a row
   count as one step. Ctrl/Cmd+Z undoes, Ctrl+Y (or Ctrl+Shift+Z) redoes. */
const HIST = { stack: [], i: -1, timer: 0 }, HREFS = new Map(), HREV = [];
const hsnap = () => JSON.stringify(S, function (k, v) {
  if (k === 'zoom' && this === S) return undefined;
  if (typeof v === 'string' && v.length > 2000) { if (!HREFS.has(v)) { HREFS.set(v, HREV.length); HREV.push(v); } return '\u0000ref:' + HREFS.get(v); }
  return v;
});
const hparse = j => JSON.parse(j, (k, v) => typeof v === 'string' && v.startsWith('\u0000ref:') ? HREV[+v.slice(5)] : v);
function histCommit() {
  clearTimeout(HIST.timer); HIST.timer = 0;
  if (PREVIEW) return;
  const j = hsnap(); if (j === HIST.stack[HIST.i]) return;
  HIST.stack.length = HIST.i + 1; HIST.stack.push(j);
  if (HIST.stack.length > 80) HIST.stack.shift();
  HIST.i = HIST.stack.length - 1;
}
function histSoon() { clearTimeout(HIST.timer); HIST.timer = setTimeout(histCommit, 350); }
function syncControls() {
  normShadow();
  PICKERS.forEach(p => p.refresh());
  BINDS.forEach(([e, key, kind]) => { if (kind === 'check') e.checked = !!S[key]; else { e.value = S[key] == null ? '' : S[key]; if (e.type === 'range' && typeof paintRange === 'function') paintRange(e); } });
  rebuildFontSelect();
  syncKitIcon();
  PICKERS.forEach(p => p.refresh());
  syncSeg(); syncCropUI(); renderBgThumbs();
}
function histGo(d) {
  if (HIST.timer) histCommit();
  const n = HIST.i + d; if (n < 0 || n >= HIST.stack.length) { setStatus(d < 0 ? 'Nothing to undo.' : 'Nothing to redo.'); return; }
  HIST.i = n;
  const zoom = S.zoom; S = Object.assign(defaultState(), hparse(HIST.stack[n])); S.zoom = zoom;
  const ids = new Set(S.cats.map(c => c.id));
  FILES.forEach(f => { if (f.cat && !ids.has(f.cat)) f.cat = null; });
  [...selectedCats].forEach(id => { if (!ids.has(id)) selectedCats.delete(id); });
  syncControls(); renderCats(); if (typeof updateBulkPanel === 'function') updateBulkPanel();
  schedule(); setStatus(d < 0 ? 'Undone.' : 'Redone.');
}
addEventListener('keydown', e => {
  if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
  const k = e.key.toLowerCase(), t = e.target;
  if (k !== 'z' && k !== 'y') return;
  // inside a text box, leave Ctrl+Z to the browser's own typing undo
  if (t && t.matches && t.matches('textarea, [contenteditable], input:not([type=range]):not([type=checkbox]):not([type=radio]):not([type=color]):not([type=file]):not([type=button])')) return;
  e.preventDefault();
  histGo(k === 'y' || e.shiftKey ? 1 : -1);
});

/* ---------- reopen exactly as it was left: which folders were open, which were selected, which sections were open, where the page was scrolled ---------- */
const UI_KEY = 'dkb-ui';
const allDetails = () => [...document.querySelectorAll('details')];
function uiSnap() {
  return JSON.stringify({ exp: [...expanded], sel: [...selectedCats], det: allDetails().map(d => d.open ? 1 : 0), y: Math.round(window.scrollY) });
}
let UI_SCROLL = 0;
function uiRestore(raw) {
  let u; try { u = JSON.parse(raw); } catch (e) { return false; }
  if (!u) return false;
  const ids = new Set(S.cats.map(c => c.id));
  expanded.clear(); (u.exp || []).forEach(id => ids.has(id) && expanded.add(id));
  selectedCats.clear(); (u.sel || []).forEach(id => ids.has(id) && selectedCats.add(id));
  const ds = allDetails(); (u.det || []).forEach((o, i) => { if (ds[i]) ds[i].open = !!o; });
  UI_SCROLL = u.y || 0;
  return true;
}
let UI_TOUCHED = false; // once the person scrolls themselves, a late restore must not yank the page
['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(t => addEventListener(t, () => { UI_TOUCHED = true; }, { capture: true, passive: true, once: true }));
function uiScroll() { if (UI_SCROLL && !UI_TOUCHED) window.scrollTo(0, UI_SCROLL); }
{
  let raw = null; try { raw = localStorage.getItem(UI_KEY); } catch (e) { }
  if (raw && HAD_SAVE) {
    const root = document.documentElement; root.classList.add('restoring');
    uiRestore(raw);
    requestAnimationFrame(() => requestAnimationFrame(() => { root.classList.remove('restoring'); uiScroll(); }));
  }
}
syncSeg(); renderCats(); renderPreview(); histCommit(); if (selectedCats.size) updateBulkPanel(); syncPreviewLock();


/* ---------- starting template ----------
   The first time the program opens (nothing saved in this browser yet), it loads template.json if one ships with
   the program. "Export template" below writes the current setup in that same format. */
const b64 = buf => { let t = ''; const u = new Uint8Array(buf); for (let i = 0; i < u.length; i += 0x8000) t += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(t); };
const unb64 = str => { const t = atob(str), u = new Uint8Array(t.length); for (let i = 0; i < t.length; i++) u[i] = t.charCodeAt(i); return u.buffer; };
async function buildTemplate() {
  histCommit();
  const state = JSON.parse(JSON.stringify(S)); delete state.zoom;
  const want = new Set([S.font, S.bannerFont, S.tagFont]); S.cats.forEach(c => c.ls && c.ls.font && want.add(c.ls.font));
  const fonts = (await fontDBAll()).filter(r => want.has(r.id)).map(r => ({ id: r.id, name: r.name, family: r.family, data: b64(r.data) }));
  const bgimgs = BGIMGS.filter(r => r.id === S.bannerBgImage);
  return { v: 1, state, bgimgs, fonts };
}
/* templates saved inside the program (IndexedDB) */
const tplDBp = new Promise(res => {
  try {
    const q = indexedDB.open('dkb-templates', 1);
    q.onupgradeneeded = () => q.result.createObjectStore('tpls', { keyPath: 'id' });
    q.onsuccess = () => res(q.result); q.onerror = () => res(null);
  } catch (e) { res(null); }
});
const tplReq = async (mode, fn) => {
  const db = await tplDBp; if (!db) throw new Error('storage');
  return new Promise((res, rej) => { try { const r = fn(db.transaction('tpls', mode).objectStore('tpls')); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); } catch (e) { rej(e); } });
};
const tplAll = () => tplReq('readonly', st => st.getAll()).then(l => (l || []).sort((x, y) => y.updated - x.updated)).catch(() => []);
const tplPut = rec => tplReq('readwrite', st => st.put(rec));
const tplDel = id => tplReq('readwrite', st => st.delete(id));
const tplDlg = $('tplDlg'), tplBody = $('tplBody');
let tplFrom = null;
function tplShow(title) { $('tplImport').hidden = title !== 'Open template'; $('tplClose').textContent = title === 'Save template' ? 'Cancel' : 'Close'; tplFrom = document.activeElement; $('tplTitle').textContent = title; tplBody.innerHTML = ''; tplDlg.classList.remove('closing'); tplDlg.hidden = false; }
function tplHide() { hideModal(tplDlg); if (tplFrom && tplFrom.isConnected && tplFrom.focus) tplFrom.focus(); tplFrom = null; }
$('tplClose').onclick = tplHide;
tplDlg.addEventListener('pointerdown', e => { if (e.target === tplDlg) tplHide(); });
addEventListener('keydown', e => { if (e.key === 'Escape' && !tplDlg.hidden && $('confirmDlg').hidden) { e.preventDefault(); tplHide(); } });
async function openSaveTemplate() {
  tplShow('Save template');
  const existing = await tplAll();
  const input = el('input', { type: 'text', id: 'tplName', placeholder: 'Template name', autocomplete: 'off', value: S.kitName.trim() || 'My template' });
  input.setAttribute('aria-label', 'Template name');
  const msg = el('p', { className: 'note', textContent: 'Saves the whole build (kit name, banner, fonts, folders and their styles) inside the program. Samples are not included.' });
  const save = el('button', { type: 'button', className: 'btn primary', textContent: 'Save template' });
  const doSave = async () => {
    const name = input.value.trim(); if (!name) { input.focus(); return; }
    const same = existing.find(r => r.name.toLowerCase() === name.toLowerCase());
    const data = await buildTemplate(), now = Date.now();
    try {
      await tplPut({ id: same ? same.id : 't' + now.toString(36) + Math.random().toString(36).slice(2, 6), name, created: same ? same.created : now, updated: now, count: S.cats.length, data });
      tplHide(); setStatus(same ? `Updated “${name}”.` : `Saved “${name}” to your templates.`, 'ok');
    } catch (e) { setStatus("Couldn't save the template in this browser.", 'err'); }
  };
  save.onclick = doSave; input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); doSave(); } });
  const hint = el('p', { className: 'note', textContent: '' });
  input.addEventListener('input', () => { const n = input.value.trim().toLowerCase(); hint.textContent = n && existing.some(r => r.name.toLowerCase() === n) ? 'A template with this name exists. Saving replaces it.' : ''; }); input.dispatchEvent(new Event('input'));
  tplBody.append(input, hint, msg, el('div', { className: 'inline', style: 'justify-content:flex-end' }, save));
  input.focus(); input.select();
}
async function openTemplateList() {
  tplShow('Open template');
  const draw = async () => {
    const list = await tplAll(); tplBody.innerHTML = '';
    if (!list.length) { tplBody.append(el('p', { className: 'note', textContent: 'No saved templates yet. Use Export template to save the current build here.' })); return; }
    const ul = el('ul', { className: 'tpl-list' });
    list.forEach(r => {
      const open = el('button', { type: 'button', className: 'btn', textContent: 'Open' });
      const dl = el('button', { type: 'button', className: 'link', textContent: 'Download' });
      const del = el('button', { type: 'button', className: 'link danger', textContent: 'Delete' });
      open.onclick = () => confirmDelete(`Open “${r.name}”?`, 'This replaces everything in the builder with this template. Your added samples stay.', 'Open template', async () => { tplHide(); await applyTemplate(r.data); setStatus(`Opened “${r.name}”.`, 'ok'); });
      del.onclick = () => confirmDelete(`Delete “${r.name}”?`, 'This removes the saved template from the program. It can’t be undone.', 'Delete', async () => { await tplDel(r.id); draw(); });
      dl.onclick = async () => { const ok = await saveBlob((r.name.replace(/[^\w\- ]+/g, '').trim() || 'template') + '.json', new Blob([JSON.stringify(r.data)], { type: 'application/json' })).catch(() => false); setStatus(ok ? `Downloaded “${r.name}”.` : 'Download canceled.', ok ? 'ok' : ''); };
      ul.append(el('li', {}, el('div', { className: 'tpl-info' }, el('span', { className: 'tpl-name', textContent: r.name }), el('span', { className: 'note', textContent: `${r.count} folder${r.count === 1 ? '' : 's'} · ${new Date(r.updated).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}` })), el('div', { className: 'tpl-acts' }, open, dl, del)));
    });
    tplBody.append(ul);
  };
  TPL_REDRAW = draw;
  await draw();
}
/* ---------- add a template from a .json file (one downloaded from this program) ---------- */
let TPL_REDRAW = null;
async function importTemplateFiles(files) {
  const have = await tplAll(); let added = 0, bad = 0, last = '';
  for (const f of files) {
    let t = null;
    try { t = JSON.parse(await f.text()); } catch (e) { }
    if (!t || !t.state || !Array.isArray(t.state.cats)) { bad++; continue; }
    const base = f.name.replace(/\.json$/i, '').replace(/[_]+/g, ' ').trim() || 'Template';
    let name = base, n = 2;
    while (have.some(r => r.name.toLowerCase() === name.toLowerCase())) name = `${base} (${n++})`;
    const now = Date.now();
    const rec = { id: 't' + now.toString(36) + Math.random().toString(36).slice(2, 6), name, created: now, updated: now, count: t.state.cats.length, data: t };
    await tplPut(rec); have.push(rec); added++; last = name;
  }
  if (TPL_REDRAW && !tplDlg.hidden) await TPL_REDRAW();
  if (added) setStatus(added === 1 ? `Added \u201c${last}\u201d to your templates.` + (bad ? ` ${bad} file${bad > 1 ? 's' : ''} weren't templates.` : '') : `Added ${added} templates.` + (bad ? ` ${bad} file${bad > 1 ? 's' : ''} weren't templates.` : ''), 'ok');
  else if (bad) setStatus(bad === 1 ? "That file isn't a Drum Kit Designer template." : "Those files aren't Drum Kit Designer templates.", 'err');
}
$('tplFile').onchange = () => { const fs = [...$('tplFile').files]; $('tplFile').value = ''; if (fs.length) importTemplateFiles(fs); };
async function applyTemplate(t) {
  if (!t || !t.state) return false;
  for (const r of t.bgimgs || []) if (!BGIMGS.some(x => x.id === r.id)) { BGIMGS.push(r); bgDBPut(r); }
  for (const r of t.fonts || []) if (!FONTS.some(f => f.id === r.id)) { const rec = { id: r.id, name: r.name, family: r.family, data: unb64(r.data) }; if (await registerCustomFont(rec)) fontDBPut(rec); }
  const zoom = S.zoom;
  S = Object.assign(defaultState(), t.state); S.zoom = zoom;
  if (!S.cats || !S.cats.length) S.cats = [newCat()];
  selectedCats.clear(); expanded.clear();
  syncControls(); renderFontList(); renderCats(); schedule();
  HIST.stack.length = 0; HIST.i = -1; histCommit();
  return true;
}
const loadTemplateFile = () => window.DKB_TEMPLATE ? Promise.resolve(window.DKB_TEMPLATE) : fetch('template.json', { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).catch(() => null); // bundled template first (works in the desktop app too)
$('tplExport').onclick = openSaveTemplate;
$('tplOpen').onclick = openTemplateList;
$('tplReset').onclick = () => confirmDelete('Are you sure you want to start over?', 'This replaces everything in the builder with the starting template. Your added samples stay.', 'Start over', async () => {
  const t = await loadTemplateFile();
  if (t) { await applyTemplate(t); setStatus('Back to the starting template.', 'ok'); }
  else { S = Object.assign(defaultState(), { zoom: S.zoom }); selectedCats.clear(); expanded.clear(); syncControls(); renderCats(); schedule(); setStatus('Back to a blank kit.', 'ok'); }
});
/* ---------- autosave ----------
   Everything is saved as you work, a moment after each change, and again the instant the window is closed or hidden:
   - the kit setup (also kept in localStorage so it is there on the very first frame),
   - your dropped sample files (copied into the browser's own storage),
   - the undo history, and
   - the screen itself: open folders, selections, open sections, scroll position.
   On the next open everything is put back before you touch anything. */
const SESS = (() => {
  let dbp;
  const open = () => dbp || (dbp = new Promise((res, rej) => {
    const q = indexedDB.open('dkb-session', 1);
    q.onupgradeneeded = () => { q.result.createObjectStore('kv'); q.result.createObjectStore('files'); };
    q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error);
  }));
  const run = async (stores, mode, fn) => {
    const db = await open();
    return new Promise((res, rej) => {
      const t = db.transaction(stores, mode); let out;
      try { out = fn(...stores.map(n => t.objectStore(n))); } catch (e) { try { t.abort(); } catch (e2) { } return rej(e); }
      t.oncomplete = () => res(out); t.onerror = t.onabort = () => rej(t.error || new Error('aborted'));
    });
  };
  const req = r => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  return { run, req };
})();
const SAVE_STATE = { ready: false, dirtyState: false, timer: 0, files: new Map(), meta: '', ui: '', hist: null, histKey: '', warned: false, busy: false, again: false };
const saveLabel = (() => {
  const e = $('saveState'); let t, dimT;
  return (msg, bad, quiet) => {
    if (!e) return; e.textContent = msg; e.classList.toggle('bad', !!bad); e.classList.add('show');
    e.classList.remove('dim'); clearTimeout(dimT); if (!bad) dimT = setTimeout(() => e.classList.add('dim'), 4000); // settles out of the way
    if (quiet) return; e.classList.add('pulse'); clearTimeout(t); t = setTimeout(() => e.classList.remove('pulse'), 900);
  };
})();
SESS_HOOK = dirty => { if (dirty) SAVE_STATE.dirtyState = true; if (SAVE_STATE.ready) SAVE_STATE.timer = SAVE_STATE.timer || setTimeout(flushSession, 600); };
async function flushSession() {
  clearTimeout(SAVE_STATE.timer); SAVE_STATE.timer = 0;
  const st = SAVE_STATE; if (!st.ready) return;
  if (st.busy) { st.again = true; return; }
  st.busy = true;
  try {
    const ui = uiSnap(), uiChanged = ui !== st.ui;
    if (uiChanged) { try { localStorage.setItem(UI_KEY, ui); } catch (e) { } }
    const meta = JSON.stringify(FILES.map(f => [f.id, f.cat, f.sub]));
    const fresh = FILES.filter(f => !st.files.has(f.id)), live = new Set(FILES.map(f => f.id));
    const gone = [...st.files.keys()].filter(id => !live.has(id));
    const top = HIST.stack[HIST.i], histKey = HIST.i + '|' + HIST.stack.length;
    const histChanged = top !== st.hist || histKey !== st.histKey;
    const stateJson = st.dirtyState ? JSON.stringify(S) : null;
    if (uiChanged || stateJson || fresh.length || gone.length || meta !== st.meta || histChanged) {
      st.dirtyState = false;
      const histPayload = histChanged ? { stack: HIST.stack.slice(), i: HIST.i, rev: HREV.slice() } : null;
      await SESS.run(['kv', 'files'], 'readwrite', (kv, fs) => {
        if (stateJson) kv.put(stateJson, 'state');
        if (uiChanged) kv.put(ui, 'ui');
        if (meta !== st.meta) kv.put(meta, 'filemeta');
        if (histPayload) kv.put(histPayload, 'hist');
        fresh.forEach(f => fs.put(f.file, f.id));
        gone.forEach(id => fs.delete(id));
      }).then(() => {
        st.ui = ui; st.meta = meta; if (histChanged) { st.hist = top; st.histKey = histKey; }
        fresh.forEach(f => st.files.set(f.id, 1)); gone.forEach(id => st.files.delete(id));
      }, async err => {
        st.dirtyState = true;
        // most likely the disk quota: keep the settings, and say so once if samples could not be kept
        if (fresh.length) {
          try { await SESS.run(['kv'], 'readwrite', kv => { if (stateJson) kv.put(stateJson, 'state'); kv.put(ui, 'ui'); kv.put(JSON.stringify(FILES.filter(f => st.files.has(f.id)).map(f => [f.id, f.cat, f.sub])), 'filemeta'); }); st.dirtyState = false; st.ui = ui; } catch (e) { }
          if (!st.warned) { st.warned = true; setStatus("Your kit is saved, but there isn't enough storage to keep your samples for next time.", 'err'); }
        }
        throw err;
      });
      saveLabel('Saved');
    }
  } catch (e) { saveLabel('Not saved', true); }
  st.busy = false;
  if (st.again) { st.again = false; SAVE_STATE.timer = setTimeout(flushSession, 400); }
}
function flushNow() { try { save(); } catch (e) { } flushSession(); }
async function restoreSession() {
  let rec = {};
  try {
    rec = await SESS.run(['kv', 'files'], 'readonly', (kv, fs) => {
      const o = {}; const g = k => SESS.req(kv.get(k)).then(v => { o[k] = v; });
      o.p = Promise.all([g('state'), g('ui'), g('filemeta'), g('hist'), SESS.req(fs.getAllKeys()).then(k => { o.fileKeys = k; return SESS.req(fs.getAll()); }).then(v => { o.fileVals = v; })]);
      return o;
    });
    await rec.p;
  } catch (e) { rec = {}; }
  let restored = false;
  const fromLocal = HAD_SAVE && !SAVED_IN_IDB; // localStorage already put the kit and the screen back on the first frame
  if (rec.state && !fromLocal) {
    try {
      S = hydrate(JSON.parse(rec.state)); normShadow(); HAD_SAVE = true; restored = true;
      if (rec.ui) uiRestore(rec.ui);
      syncControls(); renderFontList(); renderCats(); schedule();
    } catch (e) { }
  } else if (fromLocal) restored = true;
  // 3. dropped samples
  if (rec.filemeta && rec.fileKeys) {
    try {
      const byId = new Map(rec.fileKeys.map((k, i) => [k, rec.fileVals[i]])), ids = new Set(S.cats.map(c => c.id));
      FILES = JSON.parse(rec.filemeta).filter(([id]) => byId.has(id)).map(([id, cat, sub]) => ({ id, file: byId.get(id), cat: cat && ids.has(cat) ? cat : null, sub: sub || '' }));
      FILES.forEach(f => SAVE_STATE.files.set(f.id, 1)); SAVE_STATE.meta = rec.filemeta;
      if (FILES.length) { renderCats(); schedule(); }
    } catch (e) { }
  }
  // 4. undo history
  if (rec.hist && rec.hist.stack && rec.hist.stack.length) {
    try {
      HREV.length = 0; HREFS.clear(); rec.hist.rev.forEach((v, i) => { HREV.push(v); HREFS.set(v, i); });
      HIST.stack = rec.hist.stack.slice(); HIST.i = Math.min(rec.hist.i, HIST.stack.length - 1);
      histCommit(); // if the live setup differs from the saved step, it simply becomes the newest step
    } catch (e) { }
  }
  if (selectedCats.size) { renderCats(); updateBulkPanel(); }
  syncPreviewLock(); uiScroll();
  setTimeout(uiScroll, 250);
  SAVE_STATE.ui = rec.ui || ''; SAVE_STATE.dirtyState = !rec.state; SAVE_STATE.hist = HIST.stack[HIST.i]; SAVE_STATE.histKey = HIST.i + '|' + HIST.stack.length;
  SAVE_STATE.ready = true; saveLabel('Saved', false, true);
  flushSession();
  return restored;
}
const SESSION_READY = Promise.all([fontsReady, bgReady]).then(() => restoreSession()).catch(() => { SAVE_STATE.ready = true; return false; });
['toggle', 'click', 'input', 'change', 'drop', 'keyup'].forEach(t => document.addEventListener(t, () => SESS_HOOK(false), true));
addEventListener('scroll', () => SESS_HOOK(false), { passive: true });
addEventListener('scroll', () => document.documentElement.classList.toggle('scrolled', scrollY > 4), { passive: true });
document.documentElement.classList.toggle('scrolled', scrollY > 4);
setInterval(() => { if (SAVE_STATE.ready) SESS_HOOK(false); }, 4000);
addEventListener('pagehide', flushNow);
addEventListener('beforeunload', flushNow);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushNow(); });
if (!HAD_SAVE) SESSION_READY.then(restored => restored ? null : loadTemplateFile().then(t => t && applyTemplate(t)));

/* every color swatch gets a copy and a paste button, so an exact color can be moved from one place to another */
let COLOR_CLIP = '';
const parseHex = t => {
  const m = /^\s*#?([0-9a-f]{3}|[0-9a-f]{6})\s*$/i.exec(t || ''); if (!m) return null;
  let h = m[1]; if (h.length === 3) h = h.replace(/./g, '$&$&'); return '#' + h.toUpperCase();
};
function addColorButtons(inp) {
  if (inp.dataset.cc) return; inp.dataset.cc = '1';
  const mk = (cls, svg, label) => { const b = el('button', { type: 'button', className: 'cc-btn ' + cls, innerHTML: svg, title: label }); b.setAttribute('aria-label', label); return b; };
  const cp = mk('cc-copy', COPY_SVG, 'Copy color code'), ps = mk('cc-paste', PASTE_SVG, 'Paste color code');
  const flash = (b, svg, ok, tip) => { b.innerHTML = svg; b.classList.toggle('bad', !ok); b.title = tip; clearTimeout(b._t); b._t = setTimeout(() => { b.innerHTML = b.classList.contains('cc-copy') ? COPY_SVG : PASTE_SVG; b.classList.remove('bad'); b.title = b.getAttribute('aria-label'); }, 1100); };
  cp.onclick = async () => {
    const hex = parseHex(inp.value); if (!hex) return; COLOR_CLIP = hex;
    try { await navigator.clipboard.writeText(hex); } catch (e) { /* the in-app copy still works */ }
    flash(cp, CHECK_SVG, true, 'Copied ' + hex);
  };
  ps.onclick = async () => {
    let hex = null; try { hex = parseHex(await navigator.clipboard.readText()); } catch (e) { }
    hex = hex || parseHex(COLOR_CLIP);
    if (!hex) { flash(ps, PASTE_SVG, false, 'No color code to paste yet'); return; }
    if (inp.disabled) return;
    inp.value = hex.toLowerCase(); inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true }));
    flash(ps, CHECK_SVG, true, 'Pasted ' + hex);
  };
  const box = el('span', { className: 'cc' }, cp, ps); inp.after(box);
}
/* copy an icon from one folder and paste it onto another (or onto every selected folder) */
let ICON_CLIP = null;
function iconCopyPaste(get, set) {
  const mk = (cls, svg, label) => { const b = el('button', { type: 'button', className: 'cc-btn ' + cls, innerHTML: svg, title: label }); b.setAttribute('aria-label', label); return b; };
  const cp = mk('cc-copy', COPY_SVG, 'Copy icon'), ps = mk('cc-paste', PASTE_SVG, 'Paste icon');
  const name = v => { const o = ICONS.find(x => x[0] === String(v)); return o ? o[1] : 'icon ' + v; };
  const flash = (b, ok, tip) => { b.innerHTML = ok ? CHECK_SVG : PASTE_SVG; b.classList.toggle('bad', !ok); b.title = tip; clearTimeout(b._t); b._t = setTimeout(() => { b.innerHTML = b.classList.contains('cc-copy') ? COPY_SVG : PASTE_SVG; b.classList.remove('bad'); b.title = b.getAttribute('aria-label'); }, 1100); };
  cp.onclick = () => { const v = get(); if (v == null || v === '') return; ICON_CLIP = String(v); flash(cp, true, 'Copied ' + name(v)); };
  ps.onclick = () => { if (ICON_CLIP == null) { flash(ps, false, 'Copy an icon first'); return; } set(ICON_CLIP); flash(ps, true, 'Pasted ' + name(ICON_CLIP)); };
  return el('span', { className: 'cc' }, cp, ps);
}
/* sliders show their filled portion; segmented controls get a thumb that glides between options */
function paintRange(r) {
  const min = +r.min || 0, max = r.max === '' ? 100 : +r.max, v = +r.value || 0;
  r.style.setProperty('--f', (max > min ? Math.max(0, Math.min(100, (v - min) / (max - min) * 100)) : 0) + '%');
}
function segSync(g) {
  const t = g.querySelector(':scope>.seg-thumb'); if (!t) return;
  const on = g.querySelector(':scope>[aria-pressed="true"]');
  if (!on || !on.offsetWidth) { t.style.opacity = '0'; return; }
  t.style.left = on.offsetLeft + 'px'; t.style.top = on.offsetTop + 'px';
  t.style.width = on.offsetWidth + 'px'; t.style.height = on.offsetHeight + 'px';
  t.style.opacity = '1';
}
function segInit(g) {
  if (g.querySelector(':scope>.seg-thumb')) return;
  const t = el('span', { className: 'seg-thumb' }); t.setAttribute('aria-hidden', 'true');
  g.prepend(t); requestAnimationFrame(() => segSync(g));
}
const syncAllSegs = () => document.querySelectorAll('.seg').forEach(segSync);
{
  const scan = root => {
    if (!root.querySelectorAll) return;
    root.querySelectorAll('input[type=color]').forEach(addColorButtons);
    root.querySelectorAll('input[type=range]').forEach(paintRange);
    root.querySelectorAll('.seg').forEach(segInit);
  };
  scan(document);
  new MutationObserver(ms => ms.forEach(m => {
    if (m.type === 'attributes') {
      if (m.attributeName === 'aria-pressed') { const g = m.target.closest && m.target.closest('.seg'); if (g) segSync(g); }
      else if (m.target.querySelectorAll) m.target.querySelectorAll('.seg').forEach(segSync);
      return;
    }
    m.addedNodes.forEach(n => {
      if (n.nodeType !== 1) return;
      if (n.matches('input[type=color]')) addColorButtons(n);
      if (n.matches('input[type=range]')) paintRange(n);
      if (n.matches('.seg')) segInit(n);
      scan(n);
    });
  })).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-pressed', 'hidden'] });
  document.addEventListener('input', e => { const t = e.target; if (t && t.type === 'range') paintRange(t); }, true);
  let segRaf = 0; addEventListener('resize', () => { if (!segRaf) segRaf = requestAnimationFrame(() => { segRaf = 0; syncAllSegs(); }); });
  document.addEventListener('toggle', e => { if (e.target && e.target.querySelectorAll) setTimeout(() => e.target.querySelectorAll('.seg').forEach(segSync), 260); }, true);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => setTimeout(syncAllSegs, 50));
}

/* ---------- type an exact number ----------
   Every slider's readout (20 px, 100%, Off) can be clicked to type the exact value instead. */
const valRange = sp => { for (let n = sp.previousElementSibling; n; n = n.previousElementSibling) if (n.matches && n.matches('input[type=range]')) return n; return null; };
const valLike = sp => /(?:px|%)\s*$|^\s*(?:Off|Mixed)\s*$/.test(sp.textContent || '');
document.addEventListener('mouseover', e => {
  const sp = e.target.closest && e.target.closest('span.note,output');
  if (!sp || sp.dataset.vc || !valLike(sp)) return;
  const r = valRange(sp); if (!r) return;
  sp.dataset.vc = '1'; sp.classList.add('val-click'); sp.title = 'Click to type an exact number';
});
document.addEventListener('click', e => {
  const sp = e.target.closest && e.target.closest('span.note,output');
  if (!sp || sp._editing || !valLike(sp)) return;
  const r = valRange(sp); if (!r || r.disabled) return;
  sp._editing = true;
  const unit = /%\s*$/.test(sp.textContent) ? '%' : 'px';
  const inp = el('input', { type: 'number', className: 'val-edit', min: r.min, max: r.max, step: r.step || 1 });
  inp.setAttribute('aria-label', 'Exact value, ' + r.min + ' to ' + r.max + ' ' + unit);
  if (!/Mixed/.test(sp.textContent)) inp.value = r.value;
  sp.style.display = 'none'; sp.after(inp); inp.focus(); inp.select();
  let done = false;
  const close = commit => {
    if (done) return; done = true;
    if (commit && inp.value.trim() !== '') {
      let v = parseFloat(inp.value);
      if (!isNaN(v)) {
        const mn = parseFloat(r.min) || 0, mx = r.max === '' ? Infinity : parseFloat(r.max), st = parseFloat(r.step) || 1;
        v = Math.min(mx, Math.max(mn, v)); v = +(Math.round(v / st) * st).toFixed(2);
        r.value = v;
        r.dispatchEvent(new Event('input', { bubbles: true }));
        r.dispatchEvent(new Event('change', { bubbles: true }));
        if (typeof paintRange === 'function') paintRange(r);
      }
    }
    inp.remove(); sp.style.display = ''; sp._editing = false;
  };
  inp.addEventListener('keydown', ev => {
    ev.stopPropagation();
    if (ev.key === 'Enter') { ev.preventDefault(); close(true); }
    else if (ev.key === 'Escape') { ev.preventDefault(); close(false); r.focus(); }
  });
  inp.addEventListener('blur', () => close(true));
});

/* film grain switch (next to the theme picker); remembered between visits */
{
  const b = $('grainBtn'), root = document.documentElement;
  const sync = () => { const on = !root.classList.contains('no-grain'); b.setAttribute('aria-pressed', on); b.querySelector('b').textContent = on ? 'On' : 'Off'; };
  b.onclick = () => { root.classList.toggle('no-grain'); try { localStorage.setItem('dkb-grain', root.classList.contains('no-grain') ? 'off' : 'on'); } catch (e) { } sync(); };
  sync();
}
/* themes: the program's own look. Hovering one previews it. */
{
  const THEMES = [['umber', 'Umber'], ['midnight', 'Midnight'], ['dark', 'Dark'], ['oxblood', 'Oxblood'], ['dusk', 'Dusk'], ['moss', 'Moss'], ['slate', 'Slate']];
  const root = document.documentElement, cur = () => root.dataset.theme || 'slate';
  let saved;
  const setFavicon = () => {
    if (window.DKD_FIXED_ICON) return; // the desktop app keeps its own icon
    try {
      const cs = getComputedStyle(root), a = cs.getPropertyValue('--accent').trim(), bg = cs.getPropertyValue('--bg').trim();
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='${bg}'/><ellipse cx='50' cy='40' rx='28' ry='11' fill='none' stroke='${a}' stroke-width='6'/><path d='M22 40v22c0 6 12.5 11 28 11s28-5 28-11V40' fill='none' stroke='${a}' stroke-width='6' stroke-linecap='round'/></svg>`;
      const l = document.querySelector('link[rel=icon]'); if (l) l.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
    } catch (e) { }
  };
  let sweepT, winBgT;
  // the desktop window's own background (what shows for an instant at a freshly widened edge while
  // resizing) matches the theme, so no off-color bars appear
  const setWinBg = () => { try { if (window.DKD_WINDOW) window.DKD_WINDOW.setBackground(getComputedStyle(root).getPropertyValue('--bg').trim()); } catch (e) { } };
  setWinBg();
  const apply = v => {
    if (root.dataset.theme !== v) { root.classList.add('theming'); clearTimeout(sweepT); sweepT = setTimeout(() => root.classList.remove('theming'), 420); }
    root.dataset.theme = v;
    requestAnimationFrame(setFavicon);
    clearTimeout(winBgT); winBgT = setTimeout(setWinBg, 450); // after the color glide
  };
  setFavicon();
  if (!THEMES.some(t => t[0] === root.dataset.theme)) apply('slate');
  const picker = optionPicker($('themeHost'), {
    options: THEMES, label: 'Theme', get: cur,
    commit: v => { saved = undefined; apply(v); try { localStorage.setItem('dkb-theme', v); } catch (e) { } },
    temp: v => { if (saved === undefined) saved = cur(); apply(v); },
    revert: () => { if (saved !== undefined) { apply(saved); saved = undefined; } }
  });
  picker.refresh();
}
