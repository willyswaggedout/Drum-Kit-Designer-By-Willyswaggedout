// The version label in the bottom-left corner.
//   up to date:  "Version 1.1.0 · Latest version"
//   behind:      "Version 1.1.0 · Download the latest version here"  (click to update)
// The desktop app passes its own version in (?v=...) and reports update progress through
// DKD_UPDATER; in a browser the label asks GitHub for the newest release itself.
// Keep DKD_VERSION the same as "version" in package.json when releasing.
window.DKD_VERSION = '1.3.0';
(function () {
  var RELEASES = 'https://github.com/willyswaggedout/Drum-Kit-Designer-By-Willyswaggedout/releases/latest';
  var API = 'https://api.github.com/repos/willyswaggedout/Drum-Kit-Designer-By-Willyswaggedout/releases/latest';
  var mine = new URLSearchParams(location.search).get('v') || window.DKD_VERSION;
  var box = document.getElementById('appVersion');
  if (!box || !mine) return;
  var D = window.DKD_UPDATER; // only in the desktop app

  function show(tail, onClick) {
    box.textContent = 'Version ' + mine;
    if (!tail) return;
    box.appendChild(document.createTextNode(' · '));
    var t;
    if (onClick) {
      t = document.createElement('button'); t.type = 'button'; t.className = 'app-version-link';
      t.onclick = onClick;
    } else t = document.createElement('span');
    t.textContent = tail;
    box.appendChild(t);
  }
  function newer(a, b) { // is a newer than b?
    a = String(a).replace(/^v/, '').split('.').map(Number); b = String(b).replace(/^v/, '').split('.').map(Number);
    for (var i = 0; i < 3; i++) { if ((a[i] || 0) !== (b[i] || 0)) return (a[i] || 0) > (b[i] || 0); }
    return false;
  }
  function render(s) {
    switch (s && s.state) {
      case 'latest': show('Latest version'); break;
      case 'available': show('Download the latest version here', function () { D.update(); }); break;
      case 'downloading': show('Downloading update… ' + (s.percent || 0) + '%'); break;
      case 'ready': show('Restart to finish updating', function () { D.update(); }); break;
      default: show('');
    }
  }
  show('');
  if (D) { D.onStatus(render); D.status().then(render).catch(function () { }); return; }
  // browser: compare with GitHub's newest release; offline or blocked: just the version
  fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) {
      if (!j || !j.tag_name) return;
      if (newer(j.tag_name, mine)) show('Download the latest version here', function () { window.open(RELEASES, '_blank', 'noopener'); });
      else show('Latest version');
    }).catch(function () { });
})();
