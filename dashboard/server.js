import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import path from 'path';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

const PROJECT_ROOT = path.join(__dirname, '..');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper: run a docker-compose command and return stdout
function runDockerCompose(args) {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    const proc = spawn('docker-compose', args, { cwd: PROJECT_ROOT });

    proc.stdout.on('data', (d) => { stdout += d.toString(); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); });
    proc.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(stderr.trim() || `docker-compose exited with code ${code}`));
      }
    });
  });
}

// GET /api/status - get service status
app.get('/api/status', async (_req, res) => {
  try {
    const raw = await runDockerCompose(['ps', '--format', 'json']);
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
    await runDockerCompose(args);
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
    await runDockerCompose(args);
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
    await runDockerCompose(args);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/logs/:service - get logs for a service
app.get('/api/logs/:service', async (req, res) => {
  const { service } = req.params;
  const lines = req.query.lines || '100';
  try {
    const output = await runDockerCompose(['logs', '--tail', lines, service]);
    res.json({ success: true, logs: output });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback: serve index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`monkon Dashboard running at http://localhost:${PORT}`);
});
