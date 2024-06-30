const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, content) =>
    ipcRenderer.invoke('write-file', filePath, content),
  getSabis: (un, pw) => ipcRenderer.invoke('sabis-api', un, pw),
  quitApp: () => ipcRenderer.invoke('quit-app'),
});
