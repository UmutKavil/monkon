const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  docker: {
    start: (service) => ipcRenderer.invoke('docker:start', service),
    stop: (service) => ipcRenderer.invoke('docker:stop', service),
    status: () => ipcRenderer.invoke('docker:status'),
    logs: (service) => ipcRenderer.invoke('docker:logs', service),
  },
});
