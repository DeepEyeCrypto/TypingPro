// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Add API methods here
    checkForUpdates: () => ipcRenderer.invoke('check-for-updates')
});
