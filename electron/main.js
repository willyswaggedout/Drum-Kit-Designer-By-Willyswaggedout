// Desktop wrapper: opens the web app in its own window on Windows and macOS.
// The app itself lives in ../app and needs no changes to run here.
const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWin = null;

function createWindow() {
  const win = mainWin = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 420,
    minHeight: 500,
    backgroundColor: '#161618',
    title: 'Drum Kit Designer',
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js') // lets the page show update status and start an update
    }
  });
  win.loadFile(path.join(__dirname, '..', 'app', 'index.html'), { query: { v: app.getVersion() } }); // shown bottom-left

  // Open outside links in the system browser, not inside the app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Standard menus (Edit gives copy/paste shortcuts; macOS needs the app menu).
const template = [
  ...(process.platform === 'darwin' ? [{ role: 'appMenu' }] : []),
  { role: 'fileMenu' },
  { role: 'editMenu' },
  { role: 'viewMenu' },
  { role: 'windowMenu' }
];

app.whenReady().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  createWindow();
  checkForUpdates();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

/* ---------- updates ----------
   On every launch the installed app looks at the newest release on GitHub. If it's newer than this
   copy, it asks first (and the bottom-left label offers it too); only on "Update" does it download,
   then it restarts into the new version. No internet or GitHub unreachable: it stays quiet.
   The page is told the state so the label can read "Latest version" or offer the download. */
const RELEASES = 'https://github.com/willyswaggedout/Drum-Kit-Designer-By-Willyswaggedout/releases/latest';
let upd = { state: 'checking' };                      // checking | latest | available | downloading | ready | unknown
let updater = null, asked = false, startDownload = () => shell.openExternal(RELEASES), install = () => { };
const tell = patch => { upd = Object.assign({}, upd, patch); if (mainWin && !mainWin.isDestroyed()) mainWin.webContents.send('dkd-update', upd); };
ipcMain.handle('dkd-update-status', () => upd);
// FL Studio's browser icons come from its own icon font; the app borrows it from the FL Studio
// installed on this computer (it isn't shipped with the app)
function findFlIconFont() {
  const files = ['Shared\\Artwork\\Fonts\\ILGlyphsEx.ilfont', 'Help\\fonts\\ILGlyphsEx.ttf'];
  for (const d of 'CDEFGHIJKLMNOPQRSTUVWXYZ') {
    for (const pf of ['Program Files', 'Program Files (x86)']) {
      const base = `${d}:\\${pf}\\Image-Line`;
      let dirs = [];
      try { dirs = fs.readdirSync(base).filter(n => /^FL Studio/i.test(n)).sort().reverse(); } catch (e) { continue; }
      for (const dir of [...dirs.map(n => path.join(base, n)), base])
        for (const f of files) { const p = path.join(dir, f); try { if (fs.statSync(p).size > 10000) return p; } catch (e) { } }
    }
  }
  return null;
}
ipcMain.handle('dkd-fl-icon-font', () => { try { const p = findFlIconFont(); return p ? fs.readFileSync(p) : null; } catch (e) { return null; } });
// the window's own background follows the app's theme, so a freshly widened edge isn't an off-color bar
ipcMain.on('dkd-window-bg', (_e, c) => { try { if (mainWin && /^(#[0-9a-f]{3,8}|rgba?\([\d.,\s%]+\))$/i.test(c)) mainWin.setBackgroundColor(c); } catch (e) { } });
ipcMain.handle('dkd-update-start', () => { if (upd.state === 'ready') install(); else if (upd.state === 'available' || upd.state === 'unknown') startDownload(); });

function checkForUpdates() {
  if (!app.isPackaged) { tell({ state: 'unknown' }); return; } // `npm start` while developing
  try { ({ autoUpdater: updater } = require('electron-updater')); } catch (e) { tell({ state: 'unknown' }); return; }
  const autoUpdater = updater;
  autoUpdater.autoDownload = false;          // never download without asking
  autoUpdater.autoInstallOnAppQuit = false;
  startDownload = () => {
    if (upd.state === 'downloading' || upd.state === 'ready') return;
    tell({ state: 'downloading', percent: 0 });
    if (mainWin) mainWin.setTitle('Drum Kit Designer — downloading update…');
    autoUpdater.downloadUpdate().catch(() => { });
  };
  install = () => setImmediate(() => autoUpdater.quitAndInstall(true, true));

  autoUpdater.on('update-not-available', () => tell({ state: 'latest' }));

  autoUpdater.on('update-available', async info => {
    tell({ state: 'available', latest: info.version });
    if (asked) return; asked = true;
    const { response } = await dialog.showMessageBox(mainWin, {
      type: 'info',
      title: 'Update available',
      message: 'A new version of Drum Kit Designer is available.',
      detail: `Version ${info.version} is ready to download. You have version ${app.getVersion()}.\n\nWould you like to update? Your kits, templates and settings stay as they are.`,
      buttons: ['Update', 'Not Now'],
      defaultId: 0,
      cancelId: 1,
      noLink: true
    });
    if (response === 0) startDownload();
  });

  autoUpdater.on('download-progress', p => {
    tell({ state: 'downloading', percent: Math.round(p.percent) });
    if (!mainWin) return;
    mainWin.setProgressBar(p.percent / 100); // fills the taskbar button
    mainWin.setTitle(`Drum Kit Designer — downloading update… ${Math.round(p.percent)}%`);
  });

  autoUpdater.on('update-downloaded', async info => {
    tell({ state: 'ready', latest: info.version });
    if (mainWin) { mainWin.setProgressBar(-1); mainWin.setTitle('Drum Kit Designer'); }
    const { response } = await dialog.showMessageBox(mainWin, {
      type: 'info',
      title: 'Update ready',
      message: `Version ${info.version} is ready to install.`,
      detail: 'Drum Kit Designer will close, install the update and open again. Save anything you are working on first.',
      buttons: ['Restart and Update', 'Later'],
      defaultId: 0,
      cancelId: 1,
      noLink: true
    });
    if (response === 0) install();
    else autoUpdater.autoInstallOnAppQuit = true; // "Later": installs next time the app is closed
  });

  autoUpdater.on('error', () => {
    if (mainWin) { mainWin.setProgressBar(-1); mainWin.setTitle('Drum Kit Designer'); }
    const wasDownloading = upd.state === 'downloading';
    // a failed launch check stays quiet; a failed download goes back to offering the update
    tell({ state: wasDownloading ? 'available' : (upd.state === 'checking' ? 'unknown' : upd.state) });
    if (!wasDownloading) return;
    dialog.showMessageBox(mainWin, {
      type: 'warning',
      title: 'Update failed',
      message: "The update couldn't be downloaded.",
      detail: 'Check your internet connection and try again from the link in the bottom-left corner.',
      buttons: ['OK'],
      noLink: true
    });
  });

  autoUpdater.checkForUpdates().catch(() => { });
}
