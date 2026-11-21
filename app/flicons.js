/* FL Studio's own browser icons.
   FL Studio draws its browser icons from an icon font it installs (ILGlyphsEx). This program doesn't
   ship that artwork. The desktop app quietly uses the font from the FL Studio installed on the same
   computer (no prompt); everywhere else the program's own drawings (icons-drawn.js) are shown.
   IconIndex n shows the font's character 0xF100 + n, apart from a few numbers FL shows differently. */
(function () {
  var FAMILY = 'FL Studio Icons', KEY = 'dkb-fl-icons';
  var OVR = { 9: 0xF014, 22: 0xF41B, 33: 0xF09E, 34: 0xF014, 37: 0xF10B, 39: 0xF031, 41: 0xF014, 42: 0xF123, 768: 0xF05D, 792: 0xF12C, 794: 0xF123, 795: 0xF116, 809: 0xF062, 842: 0xF06F, 843: 0xF127, 861: 0xF013, 863: 0xF02B, 864: 0xF00A, 865: 0xF00B, 866: 0xF00D, 867: 0xF011, 869: 0xF025, 870: 0xF024, 871: 0xF073, 872: 0xF102, 908: 0xF51A, 999: 0xF4EE };
  // IconIndex numbers that have a picture in FL Studio 2026's icon font
  var HAS = [[0,55],[768,1033],[1035,1037],[1040,1065],[1072,1113],[1120,1120]];
  var OFF = 'dkb-fl-icons-off';
  var off = false; try { off = localStorage.getItem(OFF) === '1'; } catch (e) { }
  // found: FL Studio's icons are available on this computer; ok: they're found and switched on
  var api = { family: FAMILY, ok: false, found: false, listeners: [] };
  api.enabled = function () { return !off; };
  api.setEnabled = function (on) {
    off = !on; try { off ? localStorage.setItem(OFF, '1') : localStorage.removeItem(OFF); } catch (e) { }
    api.ok = api.found && !off;
    api.listeners.forEach(function (l) { try { l(); } catch (e) { } });
  };
  api.code = function (idx) { var n = parseInt(idx, 10); if (!(n >= 0) || n > 1200) return 0; return OVR[n] || (0xF100 + n); };
  api.has = function (idx) { var n = parseInt(idx, 10); for (var i = 0; i < HAS.length; i++) if (n >= HAS[i][0] && n <= HAS[i][1]) return true; return false; };
  api.char = function (idx) { var c = api.code(idx); return c ? String.fromCharCode(c) : ''; };
  api.onChange = function (f) { api.listeners.push(f); };
  function b64(buf) { var s = '', a = new Uint8Array(buf); for (var i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000)); return btoa(s); }
  function unb64(s) { var b = atob(s), a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a.buffer; }
  function use(buf, remember) {
    var f = new FontFace(FAMILY, buf);
    return f.load().then(function () {
      // sanity check: the font must contain FL's star (IconIndex 52)
      document.fonts.add(f);
      if (!document.fonts.check('16px "' + FAMILY + '"', api.char(52))) throw new Error('not FL icons');
      api.found = true; api.ok = !off;
      if (remember) { try { localStorage.setItem(KEY, b64(buf)); } catch (e) { } }
      api.listeners.forEach(function (l) { try { l(); } catch (e) { } });
      return true;
    });
  }
  // the person picks ILGlyphsEx from their FL Studio folder (browser version, or if not found)
  api.load = function (file) { return file.arrayBuffer().then(function (b) { return use(b, true); }); };
  api.where = 'FL Studio\\Shared\\Artwork\\Fonts\\ILGlyphsEx.ilfont';
  api.ready = (function () {
    var D = window.DKD_FL;
    var fromDesktop = D && D.iconFont ? D.iconFont().then(function (b) { if (b) return use(b instanceof ArrayBuffer ? b : b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength), false); throw 0; }) : Promise.reject();
    return fromDesktop.catch(function () {
      var s = null; try { s = localStorage.getItem(KEY); } catch (e) { }
      return s ? use(unb64(s), false) : false;
    }).catch(function () { return false; });
  })();
  window.FLI = api;
})();
