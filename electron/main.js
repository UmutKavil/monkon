import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow;

function createWindow() {
  console.log('🖥️  Creating window...');

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 950,
    minWidth: 1000,
    minHeight: 600,
    icon: path.join(__dirname, 'assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'public/index.html'));

  mainWindow.webContents.on('ready-to-show', () => {
    mainWindow.show();
    console.log('✅ Window ready');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Debug mode only when explicitly set
  if (process.env.DEBUG === 'true') {
    mainWindow.webContents.openDevTools();
    console.log('🐛 DevTools opened (DEBUG mode)');
  }
}

// IPC Handlers for Docker commands
ipcMain.handle('docker:services', async () => {
  return new Promise((resolve, reject) => {
    spawn('docker-compose', ['ps', '--format', 'json'], {
      cwd: path.join(__dirname, '..'),
      encoding: 'utf-8'
    }).stdout.on('data', (data) => {
      try {
        resolve(JSON.parse(data.toString() || '[]'));
      } catch (e) {
        resolve([]);
      }
    });
  });
});

ipcMain.handle('docker:command', async (event, action, service = null) => {
  return new Promise((resolve) => {
    let cmd = '';

    if (action === 'start-all') {
      cmd = 'docker-compose up -d';
    } else if (action === 'stop-all') {
      cmd = 'docker-compose stop';
    } else if (action === 'start' && service) {
      cmd = `docker-compose start ${service}`;
    } else if (action === 'stop' && service) {
      cmd = `docker-compose stop ${service}`;
    } else if (action === 'restart' && service) {
      cmd = `docker-compose restart ${service}`;
    }

    if (cmd) {
      spawn(cmd, { shell: true, cwd: path.join(__dirname, '..') })
        .on('close', () => resolve({ success: true }));
    } else {
      resolve({ success: false });
    }
  });
});

ipcMain.handle('docker:logs', async (event, service) => {
  return new Promise((resolve) => {
    let output = '';
    const process = spawn('docker-compose', ['logs', '--tail', '100', service], {
      cwd: path.join(__dirname, '..')
    });

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.on('close', () => {
      resolve(output);
    });
  });
});

app.on('ready', () => {
  console.log('\n⚡ monkon Masaüstü Uygulaması Başlıyor...\n');

  // Auto-start Docker services if not running
  console.log('🐳 Checking Docker services...');
  spawn('docker-compose', ['ps'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe'
  }).on('close', (code) => {
    if (code !== 0) {
      console.log('📦 Starting Docker services...');
      spawn('docker-compose', ['up', '-d'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'ignore'
      });
    }
  });

  createWindow();

  const menu = Menu.buildFromTemplate([
    {
      label: '⚡ monkon',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'quit', accelerator: 'CmdOrCtrl+Q' }
      ]
    },
    {
      label: 'Düzen',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'Görünüm',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' }
      ]
    }
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
