import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import path from 'path';
import { runDockerCompose } from '../lib/docker.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

const PROJECT_ROOT = path.join(__dirname, '..');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple in-memory rate limiter for the logs endpoint
const logRateLimit = new Map();
const LOG_RATE_LIMIT_MS = Number(process.env.LOG_RATE_LIMIT_MS) || 2000;

function isLogsRateLimited(key) {
  const now = Date.now();
  const last = logRateLimit.get(key) || 0;
  if (now - last < LOG_RATE_LIMIT_MS) {
    return true;
  }
  logRateLimit.set(key, now);
  return false;
}

// GET /api/status - get service status
app.get('/api/status', async (_req, res) => {
  try {
    const raw = await runDockerCompose(['ps', '--format', 'json'], PROJECT_ROOT);
    let containers = [];
    try {
      containers = JSON.parse(raw);
      if (!Array.isArray(containers)) containers = [containers];
    } catch {
      containers = [];
    }
    res.json({ success: true, containers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/start - start all or specific service
app.post('/api/start', async (req, res) => {
  const { service } = req.body || {};
  try {
    const args = service ? ['up', '-d', service] : ['up', '-d'];
    await runDockerCompose(args, PROJECT_ROOT);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/stop - stop all or specific service
app.post('/api/stop', async (req, res) => {
  const { service } = req.body || {};
  try {
    const args = service ? ['stop', service] : ['stop'];
    await runDockerCompose(args, PROJECT_ROOT);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/restart - restart all or specific service
app.post('/api/restart', async (req, res) => {
  const { service } = req.body || {};
  try {
    const args = service ? ['restart', service] : ['restart'];
    await runDockerCompose(args, PROJECT_ROOT);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/logs/:service - get logs for a service (rate-limited)
app.get('/api/logs/:service', async (req, res) => {
  const { service } = req.params;
  const lines = req.query.lines || '100';

  if (isLogsRateLimited(service)) {
    return res.status(429).json({ success: false, error: 'Too many requests. Please wait before fetching logs again.' });
  }

  try {
    const output = await runDockerCompose(['logs', '--tail', lines, service], PROJECT_ROOT);
    res.json({ success: true, logs: output });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`monkon Dashboard running at http://localhost:${PORT}`);
});
