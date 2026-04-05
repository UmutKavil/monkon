import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

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

  // Load the Vite-built output
  mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.env.DEBUG === 'true') {
    mainWindow.webContents.openDevTools();
  }
}

// Helper: run docker-compose and return stdout
function runDockerCompose(args) {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    const proc = spawn('docker-compose', args, { cwd: PROJECT_ROOT });
    proc.stdout.on('data', (d) => { stdout += d.toString(); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); });
    proc.on('close', (code) => {
      if (code === 0) resolve(stdout.trim());
      else reject(new Error(stderr.trim() || `exit code ${code}`));
    });
  });
}

// IPC: get service status
ipcMain.handle('docker:status', async () => {
  try {
    const raw = await runDockerCompose(['ps', '--format', 'json']);
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
    await runDockerCompose(args);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// IPC: stop a service (or all)
ipcMain.handle('docker:stop', async (_event, service) => {
  try {
    const args = service ? ['stop', service] : ['stop'];
    await runDockerCompose(args);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// IPC: restart a service (or all)
ipcMain.handle('docker:restart', async (_event, service) => {
  try {
    const args = service ? ['restart', service] : ['restart'];
    await runDockerCompose(args);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// IPC: get logs for a service
ipcMain.handle('docker:logs', async (_event, service) => {
  try {
    const output = await runDockerCompose(['logs', '--tail', '100', service]);
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
