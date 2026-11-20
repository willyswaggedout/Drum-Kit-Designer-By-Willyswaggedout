/* Band-free moving background.
   The same drifting color pools and preview glow as the CSS version, but each pixel is computed on
   the graphics card in full floating-point precision and only rounded to the screen's 256 levels
   at the very end, with a tiny random (triangular) offset. That's proper dithering: no step in the
   chain ever stores the gradient at 8 bits, so it can't form visible rings.
   If WebGL isn't available, the CSS gradients stay in place. */
(function () {
  const root = document.documentElement;
  let cv, gl, prog, U = {}, raf = 0, last = 0, t0 = performance.now();

  // --- colors from the theme (resolved to plain rgb by the browser) ---
  const probe = document.createElement('span');
  function rgbOf(cssVar, fallbackVar) {
    let v = getComputedStyle(root).getPropertyValue(cssVar).trim();
    if (!v && fallbackVar) v = getComputedStyle(root).getPropertyValue(fallbackVar).trim();
    probe.style.color = ''; probe.style.color = v || '#000';
    if (!probe.isConnected) { probe.style.display = 'none'; document.body.appendChild(probe); }
    const m = getComputedStyle(probe).color.match(/[\d.]+/g) || [0, 0, 0];
    return [m[0] / 255, m[1] / 255, m[2] / 255];
  }
  const readColors = () => ({ bg: rgbOf('--bg'), accent: rgbOf('--accent'), s2: rgbOf('--surface2'), t3: rgbOf('--text3', '--text2') });
  const mix = (a, b, k) => a.map((x, i) => x + (b[i] - x) * k);

  // --- the CSS keyframes, reproduced: ease-in-out per segment, alternating ---
  function bez(t) { // cubic-bezier(.42,0,.58,1)
    let x = t; for (let i = 0; i < 6; i++) { const bx = 3 * (1 - x) * (1 - x) * x * .42 + 3 * (1 - x) * x * x * .58 + x * x * x - t, d = 3 * (1 - x) * (1 - x) * .42 + 6 * (1 - x) * x * (.58 - .42) + 3 * x * x * (1 - .58); if (Math.abs(d) < 1e-6) break; x -= bx / d; }
    return 3 * (1 - x) * x * x + x * x * x;
  }
  function track(kf, dur, now) { // kf: [[tx,ty,deg,scale] at 0%,50%,100%]
    let p = (now / 1000 / dur) % 2; if (p > 1) p = 2 - p; // alternate
    const seg = p < .5 ? 0 : 1, local = bez(seg ? (p - .5) / .5 : p / .5);
    return kf[seg].map((v, i) => v + (kf[seg + 1][i] - v) * local);
  }
  const KF1 = [[-4, -3, 0, 1], [5, 4, 8, 1.08], [-2, 6, -6, 1.02]], KF2 = [[4, 3, 0, 1.05], [-6, -2, -10, 1], [3, -5, 6, 1.1]];

  const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const FS = `precision highp float;
uniform vec2 res; uniform vec3 bg, acc, accS, s2, t3; uniform vec4 L1, L2; uniform vec4 glow; uniform float seed;
// layer transform: xy = translate (fraction of box), z = angle (rad), w = scale. Box = viewport grown 25% each side.
vec2 toBox(vec2 q, vec4 L){
  vec2 box = res*1.5, O = res*.5;              // box centre = viewport centre
  vec2 d = q - O - L.xy*box;
  float c = cos(-L.z), s = sin(-L.z);
  d = vec2(c*d.x - s*d.y, s*d.x + c*d.y) / L.w;
  return (d + box*.5) / box;                   // 0..1 across the box
}
float blob(vec2 u, vec2 r, vec2 c, float end){  // eased cosine fall-off, as in the CSS stops
  vec2 d = (u - c) / r; float t = clamp(length(d) / end, 0., 1.);
  return .5 + .5*cos(3.14159265*t);
}
vec4 over(vec4 top, vec4 base){ float a = top.a + base.a*(1.-top.a); return vec4((top.rgb*top.a + base.rgb*base.a*(1.-top.a))/max(a,1e-6), a); }
float rnd(vec2 v){ return fract(sin(dot(v, vec2(12.9898,78.233)) + seed) * 43758.5453); }
void main(){
  vec2 q = vec2(gl_FragCoord.x, res.y - gl_FragCoord.y);
  vec3 col = bg;
  // layer 1 (accent pools, saturated as in the CSS version)
  vec2 u = toBox(q, L1);
  vec4 l1 = over(vec4(accS, .27*blob(u, vec2(.38,.42), vec2(.22,.30), .78)), vec4(accS, .18*blob(u, vec2(.34,.40), vec2(.78,.72), .78)));
  col = mix(col, l1.rgb, l1.a);
  // glow behind the preview
  if (glow.z > 0.) { vec2 gd = (q - glow.xy) / glow.zw; float gt = clamp(length(gd), 0., 1.); col = mix(col, acc, .42*(.5+.5*cos(3.14159265*gt))); }
  // layer 2 (deep tone + soft light)
  u = toBox(q, L2);
  vec4 l2 = over(vec4(s2, .75*blob(u, vec2(.40,.46), vec2(.70,.24), .80)), vec4(t3, .12*blob(u, vec2(.36,.40), vec2(.30,.80), .78)));
  col = mix(col, l2.rgb, l2.a);
  // triangular dither of +-1 step, added before the one and only rounding to 8 bits
  vec3 n = vec3(rnd(q)+rnd(q+17.3)-1., rnd(q+3.7)+rnd(q+29.1)-1., rnd(q+7.1)+rnd(q+41.9)-1.);
  gl_FragColor = vec4(col + n/255., 1.);
}`;

  function saturate(c, s) { // the CSS saturate() matrix
    const [r, g, b] = c;
    return [
      (.213 + .787 * s) * r + (.715 - .715 * s) * g + (.072 - .072 * s) * b,
      (.213 - .213 * s) * r + (.715 + .285 * s) * g + (.072 - .072 * s) * b,
      (.213 - .213 * s) * r + (.715 - .715 * s) * g + (.072 + .928 * s) * b
    ].map(v => Math.min(1, Math.max(0, v)));
  }

  function init() {
    cv = document.createElement('canvas'); cv.className = 'bg-gl'; cv.setAttribute('aria-hidden', 'true');
    gl = cv.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: 'low-power' });
    if (!gl) return false;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
    gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    ['res', 'bg', 'acc', 'accS', 's2', 't3', 'L1', 'L2', 'glow', 'seed'].forEach(n => U[n] = gl.getUniformLocation(prog, n));
    const base = document.querySelector('.bg-base'); (base ? base.after(cv) : document.body.prepend(cv));
    cv.addEventListener('webglcontextlost', e => { e.preventDefault(); cancelAnimationFrame(raf); root.classList.remove('gl-bg'); });
    return true;
  }

  function size() {
    const Z = window.DKD_ZOOM || 1, dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.round(innerWidth * Z * dpr)), h = Math.max(1, Math.round(innerHeight * Z * dpr));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    return [w, h, Z * dpr];
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (document.hidden || window.DKD_BG_HOLD) return; // held briefly while the preview picture is made
    const theming = root.classList.contains('theming');
    if (!theming && now - last < 32) return; last = now; // ~30 fps is plenty for a slow drift
    const [w, h, k] = size();
    gl.viewport(0, 0, w, h);
    // colors (with a short cross-fade when the theme changes)
    // during a theme change the CSS color tokens are mid-glide: read them live every frame so the
    // background moves in step with the rest of the interface
    if (theming) cache = null;
    const c = readColorsCached();
    gl.uniform2f(U.res, w, h); gl.uniform3fv(U.bg, c.bg); gl.uniform3fv(U.acc, c.accent); gl.uniform3fv(U.accS, saturate(c.accent, 1.35));
    gl.uniform3fv(U.s2, c.s2); gl.uniform3fv(U.t3, c.t3);
    const tt = (window.DKD_BG_TIME != null ? window.DKD_BG_TIME : (matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : now - t0));
    const a = track(KF1, 28, tt), b = track(KF2, 38, tt), rad = Math.PI / 180;
    gl.uniform4f(U.L1, a[0] / 100, a[1] / 100, a[2] * rad, a[3]);
    gl.uniform4f(U.L2, b[0] / 100, b[1] / 100, b[2] * rad, b[3]);
    const side = document.querySelector('.side');
    if (side && side.offsetParent !== null) {
      const r = side.getBoundingClientRect(); // page units
      gl.uniform4f(U.glow, (r.left + r.width / 2) * k, (r.top + r.height * .45) * k, 1.15 * r.width * k, .675 * r.height * k);
    } else gl.uniform4f(U.glow, 0, 0, 0, 0);
    gl.uniform1f(U.seed, (now % 1000) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  let cache = null;
  const readColorsCached = () => cache || (cache = readColors());
  new MutationObserver(() => { cache = null; last = 0; }).observe(root, { attributes: true, attributeFilter: ['data-theme', 'class'] });

  function start() {
    try { if (!init()) return; } catch (e) { if (cv) cv.remove(); return; }
    root.classList.add('gl-bg');
    raf = requestAnimationFrame(frame);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.DKD_BG = { redraw: () => { last = 0; } };
})();
