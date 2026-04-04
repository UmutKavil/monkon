const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { execSync } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, 'public/icon.png'),
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

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

// Application Menu
const createMenu = () => {
  const template = [
    {
      label: 'monkon',
      submenu: [
        { label: 'About monkon', click: () => {
            // TODO: Show about dialog
          }
        },
        { type: 'separator' },
        { label: 'Preferences', accelerator: 'Cmd+,', click: () => {
            // TODO: Open preferences
          }
        },
        { type: 'separator' },
        { label: 'Quit monkon', accelerator: 'Cmd+Q', click: () => app.quit() },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Cmd+Z' },
        { label: 'Redo', accelerator: 'Shift+Cmd+Z' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Cmd+X' },
        { label: 'Copy', accelerator: 'Cmd+C' },
        { label: 'Paste', accelerator: 'Cmd+V' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'Cmd+R', click: () => mainWindow.reload() },
        { label: 'Toggle Developer Tools', accelerator: 'Alt+Cmd+I',
          click: () => mainWindow.webContents.toggleDevTools() },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

app.on('ready', createMenu);

// IPC Handlers for CLI commands
ipcMain.handle('docker:start', async (event, service) => {
  try {
    const cmd = service
      ? `docker-compose up -d ${service}`
      : 'docker-compose up -d';
    execSync(cmd, { cwd: path.join(__dirname, '..') });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('docker:stop', async (event, service) => {
  try {
    const cmd = service
      ? `docker-compose stop ${service}`
      : 'docker-compose stop';
    execSync(cmd, { cwd: path.join(__dirname, '..') });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('docker:status', async () => {
  try {
    const output = execSync('docker-compose ps --format json', {
      cwd: path.join(__dirname, '..'),
      encoding: 'utf-8'
    });
    const containers = JSON.parse(output || '[]');
    return { success: true, containers };
  } catch (error) {
    return { success: false, error: error.message, containers: [] };
  }
});

ipcMain.handle('docker:logs', async (event, service) => {
  try {
    const cmd = service
      ? `docker-compose logs --tail 100 ${service}`
      : `docker-compose logs --tail 100`;
    const output = execSync(cmd, {
      cwd: path.join(__dirname, '..'),
      encoding: 'utf-8'
    });
    return { success: true, logs: output };
  } catch (error) {
    return { success: false, error: error.message, logs: '' };
  }
});
