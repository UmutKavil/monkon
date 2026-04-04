import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/services', (req, res) => {
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

app.post('/api/service/:action/:name', (req, res) => {
  const { action, name } = req.params;

  try {
    if (action === 'start') {
      execSync(`docker-compose start ${name}`, {
        cwd: path.join(__dirname, '..')
      });
    } else if (action === 'stop') {
      execSync(`docker-compose stop ${name}`, {
        cwd: path.join(__dirname, '..')
      });
    } else if (action === 'restart') {
      execSync(`docker-compose restart ${name}`, {
        cwd: path.join(__dirname, '..')
      });
    }

    // Send update to all connected clients
    broadcastStatus();
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.post('/api/all/:action', (req, res) => {
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

app.get('/api/logs/:service', (req, res) => {
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

// Socket.IO Events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial status
  broadcastStatus();

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Broadcast status to all connected clients
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

// Periodic status updates
setInterval(broadcastStatus, 5000);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

httpServer.listen(PORT, () => {
  console.log(`\n🌐 monkon Dashboard is running!`);
  console.log(`📱 Open: http://localhost:${PORT}`);
  console.log(`\n`);
});
