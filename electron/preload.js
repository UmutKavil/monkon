import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  docker: {
    getServices: () => ipcRenderer.invoke('docker:services'),
    execute: (action, service) => ipcRenderer.invoke('docker:command', action, service),
    getLogs: (service) => ipcRenderer.invoke('docker:logs', service)
  }
});
