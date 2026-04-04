import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = !app.isPackaged;

let mainWindow;

// Create Express app and start server
function startExpressServer() {
  const expressApp = express();
  const port = 3000;

  const httpServer = createServer(expressApp);
  const io = new Server(httpServer, {
    cors: { origin: '*' }
  });

  // Serve static files from dashboard
  expressApp.use(express.static(path.join(__dirname, '../dashboard/public')));

  // API Routes
  expressApp.get('/api/services', (req, res) => {
    try {
      const output = execSync('docker-compose ps --format json', {
        cwd: path.join(__dirname, '..'),
        encoding: 'utf-8'
      });
      const containers = JSON.parse(output || '[]');
      res.json({ success: true, containers });
    } catch (error) {
      res.json({ success: false, error: error.message, containers: [] });
    }
  });

  expressApp.post('/api/service/:action/:name', (req, res) => {
    const { action, name } = req.params;
    try {
      if (action === 'start') {
        execSync(`docker-compose start ${name}`, { cwd: path.join(__dirname, '..') });
      } else if (action === 'stop') {
        execSync(`docker-compose stop ${name}`, { cwd: path.join(__dirname, '..') });
      } else if (action === 'restart') {
        execSync(`docker-compose restart ${name}`, { cwd: path.join(__dirname, '..') });
      }
      broadcastStatus();
      res.json({ success: true });
    } catch (error) {
      res.json({ success: false, error: error.message });
    }
  });

  expressApp.post('/api/all/:action', (req, res) => {
    const { action } = req.params;
    try {
      if (action === 'start') {
        execSync('docker-compose up -d', { cwd: path.join(__dirname, '..') });
      } else if (action === 'stop') {
        execSync('docker-compose stop', { cwd: path.join(__dirname, '..') });
      } else if (action === 'restart') {
        execSync('docker-compose restart', { cwd: path.join(__dirname, '..') });
      }
      broadcastStatus();
      res.json({ success: true });
    } catch (error) {
      res.json({ success: false, error: error.message });
    }
  });

  expressApp.get('/api/logs/:service', (req, res) => {
    const { service } = req.params;
    const lines = req.query.lines || 100;
    try {
      const output = execSync(`docker-compose logs --tail ${lines} ${service}`, {
        cwd: path.join(__dirname, '..'),
        encoding: 'utf-8'
      });
      res.json({ success: true, logs: output });
    } catch (error) {
      res.json({ success: false, error: error.message });
    }
  });

  io.on('connection', (socket) => {
    broadcastStatus();
  });

  function broadcastStatus() {
    try {
      const output = execSync('docker-compose ps --format json', {
        cwd: path.join(__dirname, '..'),
        encoding: 'utf-8'
      });
      const containers = JSON.parse(output || '[]');
      io.emit('status-update', { containers });
    } catch (error) {
      io.emit('status-error', { error: error.message });
    }
  }

  setInterval(broadcastStatus, 5000);
  httpServer.listen(port);
}

// Create BrowserWindow
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadURL('http://localhost:3000');
  
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App events
app.on('ready', () => {
  startExpressServer();
  setTimeout(createWindow, 1000);

  const menu = Menu.buildFromTemplate([
    {
      label: '⚡ monkon',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'quit', accelerator: 'Cmd+Q' }
      ]
    },
    {
      label: 'Edit',
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
      label: 'View',
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
