// Gives the page a small, safe window onto the updater: read the state, hear changes, start an update.
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('DKD_UPDATER', {
  status: () => ipcRenderer.invoke('dkd-update-status'),
  onStatus: cb => ipcRenderer.on('dkd-update', (_e, s) => cb(s)),
  update: () => ipcRenderer.invoke('dkd-update-start')
});
contextBridge.exposeInMainWorld('DKD_WINDOW', {
  setBackground: color => ipcRenderer.send('dkd-window-bg', String(color))
});
