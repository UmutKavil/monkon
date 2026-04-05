import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  docker: {
    status: () => ipcRenderer.invoke('docker:status'),
    start: (service) => ipcRenderer.invoke('docker:start', service),
    stop: (service) => ipcRenderer.invoke('docker:stop', service),
    restart: (service) => ipcRenderer.invoke('docker:restart', service),
    logs: (service) => ipcRenderer.invoke('docker:logs', service),
  },
});
