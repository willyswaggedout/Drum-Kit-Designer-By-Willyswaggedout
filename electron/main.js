// Desktop wrapper: opens the web app in its own window on Windows and macOS.
// The app itself lives in ../app and needs no changes to run here.
const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');

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
      sandbox: true
    }
  });
  win.loadFile(path.join(__dirname, '..', 'app', 'index.html'));

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
   copy, it asks first; only on "Update" does it download, then it restarts into the new version.
   No internet, no release yet, or GitHub unreachable: it says nothing and the app just opens. */
function checkForUpdates() {
  if (!app.isPackaged) return; // `npm start` while developing: nothing to update
  let autoUpdater;
  try { ({ autoUpdater } = require('electron-updater')); } catch (e) { return; }
  autoUpdater.autoDownload = false;          // never download without asking
  autoUpdater.autoInstallOnAppQuit = false;
  let asked = false, downloading = false;

  autoUpdater.on('update-available', async info => {
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
    if (response !== 0) return;
    downloading = true;
    if (mainWin) mainWin.setTitle('Drum Kit Designer — downloading update…');
    autoUpdater.downloadUpdate().catch(() => { });
  });

  autoUpdater.on('download-progress', p => {
    if (!mainWin) return;
    mainWin.setProgressBar(p.percent / 100); // fills the taskbar button
    mainWin.setTitle(`Drum Kit Designer — downloading update… ${Math.round(p.percent)}%`);
  });

  autoUpdater.on('update-downloaded', async info => {
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
    if (response === 0) setImmediate(() => autoUpdater.quitAndInstall(true, true));
    else autoUpdater.autoInstallOnAppQuit = true; // "Later": installs next time the app is closed
  });

  autoUpdater.on('error', err => {
    if (mainWin) { mainWin.setProgressBar(-1); mainWin.setTitle('Drum Kit Designer'); }
    if (!downloading) return; // a failed check on launch stays silent
    downloading = false;
    dialog.showMessageBox(mainWin, {
      type: 'warning',
      title: 'Update failed',
      message: "The update couldn't be downloaded.",
      detail: 'Check your internet connection. The app will offer the update again the next time you open it.',
      buttons: ['OK'],
      noLink: true
    });
  });

  autoUpdater.checkForUpdates().catch(() => { });
}
