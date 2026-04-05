import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { runDockerCompose } from '../lib/docker.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROJECT_ROOT = path.join(__dirname, '..');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    icon: path.join(__dirname, 'assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the Vite dev server in development, built output in production
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.env.DEBUG === 'true') {
    mainWindow.webContents.openDevTools();
  }
}

// IPC: get service status
ipcMain.handle('docker:status', async () => {
  try {
    const raw = await runDockerCompose(['ps', '--format', 'json'], PROJECT_ROOT);
    let containers = [];
    try {
      containers = JSON.parse(raw);
      if (!Array.isArray(containers)) containers = [containers];
    } catch { containers = []; }
    return { success: true, containers };
  } catch (err) {
    return { success: false, error: err.message, containers: [] };
  }
});

// IPC: start a service (or all)
ipcMain.handle('docker:start', async (_event, service) => {
  try {
    const args = service ? ['up', '-d', service] : ['up', '-d'];
    await runDockerCompose(args, PROJECT_ROOT);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// IPC: stop a service (or all)
ipcMain.handle('docker:stop', async (_event, service) => {
  try {
    const args = service ? ['stop', service] : ['stop'];
    await runDockerCompose(args, PROJECT_ROOT);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// IPC: restart a service (or all)
ipcMain.handle('docker:restart', async (_event, service) => {
  try {
    const args = service ? ['restart', service] : ['restart'];
    await runDockerCompose(args, PROJECT_ROOT);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// IPC: get logs for a service
ipcMain.handle('docker:logs', async (_event, service) => {
  try {
    const output = await runDockerCompose(['logs', '--tail', '100', service], PROJECT_ROOT);
    return { success: true, logs: output };
  } catch (err) {
    return { success: false, error: err.message, logs: '' };
  }
});

app.on('ready', () => {
  createWindow();

  const menu = Menu.buildFromTemplate([
    {
      label: '⚡ monkon',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'quit', accelerator: 'CmdOrCtrl+Q' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
