// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Add API methods here if needed in the future
    // example: setTitle: (title) => ipcRenderer.send('set-title', title)
});
