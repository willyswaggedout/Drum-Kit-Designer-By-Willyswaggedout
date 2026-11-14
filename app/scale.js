/* Scale the whole program to fit the window.
   The layout is designed at 1320 x 1240; everything is zoomed so the whole page fits
   the window, looking identical, only bigger or smaller.
   CSS zoom makes the browser report mouse positions, element boxes, window size and
   scroll position in on-screen (zoomed) pixels, while the program positions things in
   its own (unzoomed) pixels. The getters below convert, so every drag, crop, resize and
   popup keeps lining up exactly with the pointer at any size. */
(function () {
  var BASE = 1320, BASE_H = 1240, MIN = 0.7, MAX = 2; // the default kit is 1320 x 1240 at normal size
  var root = document.documentElement, Z = 1;
  function own(o, p) { while (o && !Object.getOwnPropertyDescriptor(o, p)) o = Object.getPrototypeOf(o); return o && Object.getOwnPropertyDescriptor(o, p); }
  var iw = own(window, 'innerWidth'), ih = own(window, 'innerHeight'), sy = own(window, 'scrollY'), sx = own(window, 'scrollX'), py = own(window, 'pageYOffset'), px = own(window, 'pageXOffset');
  var rawW = function () { return iw.get.call(window); }, rawH = function () { return ih.get.call(window); };
  function def(o, p, d, f) { if (d && d.get) Object.defineProperty(o, p, { configurable: true, get: function () { return f(d.get.call(this)); } }); }
  var div = function (v) { return v / Z; };
  def(window, 'innerWidth', iw, div); def(window, 'innerHeight', ih, div);
  def(window, 'scrollY', sy, div); def(window, 'scrollX', sx, div);
  def(window, 'pageYOffset', py, div); def(window, 'pageXOffset', px, div);
  ['clientX', 'clientY', 'pageX', 'pageY'].forEach(function (p) { def(MouseEvent.prototype, p, own(MouseEvent.prototype, p), div); });
  var gbcr = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function () {
    var r = gbcr.call(this); if (Z === 1) return r;
    return new DOMRect(r.x / Z, r.y / Z, r.width / Z, r.height / Z);
  };
  ['scrollTo', 'scrollBy'].forEach(function (m) {
    var f = window[m];
    window[m] = function (a, b) {
      if (a && typeof a === 'object') { var o = Object.assign({}, a); if (o.top != null) o.top *= Z; if (o.left != null) o.left *= Z; return f.call(window, o); }
      return f.call(window, (a || 0) * Z, (b || 0) * Z);
    };
  });
  function apply() {
    var z = Math.min(MAX, Math.max(MIN, Math.min(rawW() / BASE, rawH() / BASE_H))); // fit width and height
    z = Math.round(z * 1000) / 1000;
    if (z === Z && root.style.zoom) return;
    var y = sy.get.call(window) / Z; // keep the same spot in view
    Z = z; root.style.zoom = z; window.DKD_ZOOM = z;
    window.scrollTo(0, y);
  }
  apply();
  window.addEventListener('resize', apply);
})();
