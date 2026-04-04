// Socket.IO Connection
const socket = io();
let currentFilter = 'all';
let services = [];

// Elements
const servicesContainer = document.getElementById('servicesContainer');
const logsContainer = document.getElementById('logsContainer');
const serviceSelect = document.getElementById('serviceSelect');
const startAllBtn = document.getElementById('startAllBtn');
const stopAllBtn = document.getElementById('stopAllBtn');
const connectionStatus = document.getElementById('connectionStatus');
const filterTabBtns = document.querySelectorAll('.tab-btn');

// Socket Events
socket.on('connect', () => {
  console.log('Connected to socket');
  connectionStatus.classList.add('connected');
  connectionStatus.innerHTML = '<span class="dot"></span> Connected';
});

socket.on('disconnect', () => {
  console.log('Disconnected from socket');
  connectionStatus.classList.remove('connected');
  connectionStatus.innerHTML = '<span class="dot"></span> Disconnected';
});

socket.on('status-update', (data) => {
  services = data.containers || [];
  renderServices();
  updateServiceSelect();
});

socket.on('status-error', (data) => {
  console.error('Status error:', data.error);
});

// Filter Tabs
filterTabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterTabBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderServices();
  });
});

// Buttons
startAllBtn.addEventListener('click', () => {
  startAllBtn.disabled = true;
  fetch('/api/all/start', { method: 'POST' })
    .then((res) => res.json())
    .then((data) => {
      startAllBtn.disabled = false;
      if (!data.success) alert('Error: ' + data.error);
    })
    .catch((err) => {
      startAllBtn.disabled = false;
      alert('Error: ' + err.message);
    });
});

stopAllBtn.addEventListener('click', () => {
  stopAllBtn.disabled = true;
  fetch('/api/all/stop', { method: 'POST' })
    .then((res) => res.json())
    .then((data) => {
      stopAllBtn.disabled = false;
      if (!data.success) alert('Error: ' + data.error);
    })
    .catch((err) => {
      stopAllBtn.disabled = false;
      alert('Error: ' + err.message);
    });
});

// Service Select
serviceSelect.addEventListener('change', () => {
  const service = serviceSelect.value;
  if (service) {
    fetchLogs(service);
  } else {
    logsContainer.innerHTML = '<div class="logs-empty"><p>Select a service to view logs</p></div>';
  }
});

// Functions
function parseServiceName(name) {
  if (!name) return 'Unknown';
  return name.replace('monkon-', '').replace('-1', '').toUpperCase();
}

function renderServices() {
  if (services.length === 0) {
    servicesContainer.innerHTML = `
      <div class="loading">
        <p>No services found. Start with "npm run start"</p>
      </div>
    `;
    return;
  }

  let filtered = services;
  if (currentFilter === 'running') {
    filtered = services.filter((s) => s.State === 'running');
  } else if (currentFilter === 'stopped') {
    filtered = services.filter((s) => s.State !== 'running');
  }

  if (filtered.length === 0) {
    servicesContainer.innerHTML = `
      <div class="loading">
        <p>No ${currentFilter} services found</p>
      </div>
    `;
    return;
  }

  const html = filtered
    .map(
      (service) => `
    <div class="service-card ${service.State}">
      <div class="service-header">
        <span class="service-name">${parseServiceName(service.Service || service.Names)}</span>
        <span class="status-badge ${service.State}">
          ${service.State === 'running' ? '✓ Running' : '○ Stopped'}
        </span>
      </div>

      <div class="service-info">
        <p><strong>ID:</strong> <span class="monospace">${(service.ID || '').substring(0, 12)}</span></p>
        ${service.Ports ? `<p><strong>Ports:</strong> ${service.Ports}</p>` : ''}
        <p><strong>Status:</strong> ${service.Status || '-'}</p>
      </div>

      <div class="service-actions">
        ${
          service.State === 'running'
            ? `<button class="btn btn-danger btn-sm" onclick="stopService('${service.Service || service.Names}')">Stop</button>`
            : `<button class="btn btn-success btn-sm" onclick="startService('${service.Service || service.Names}')">Start</button>`
        }
        <button class="btn btn-primary btn-sm" onclick="restartService('${service.Service || service.Names}')">Restart</button>
      </div>
    </div>
  `
    )
    .join('');

  servicesContainer.innerHTML = html;
}

function updateServiceSelect() {
  const options = ['<option value="">Select service...</option>'];

  services.forEach((service) => {
    const name = service.Service || service.Names;
    options.push(`<option value="${name}">${parseServiceName(name)}</option>`);
  });

  serviceSelect.innerHTML = options.join('');
}

function startService(name) {
  fetch(`/api/service/start/${name}`, { method: 'POST' })
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) alert('Error: ' + data.error);
    })
    .catch((err) => alert('Error: ' + err.message));
}

function stopService(name) {
  fetch(`/api/service/stop/${name}`, { method: 'POST' })
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) alert('Error: ' + data.error);
    })
    .catch((err) => alert('Error: ' + err.message));
}

function restartService(name) {
  fetch(`/api/service/restart/${name}`, { method: 'POST' })
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) alert('Error: ' + data.error);
    })
    .catch((err) => alert('Error: ' + err.message));
}

function fetchLogs(service) {
  logsContainer.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading logs...</p></div>';

  fetch(`/api/logs/${service}?lines=100`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        logsContainer.innerHTML = `<pre>${escapeHtml(data.logs)}</pre>`;
        logsContainer.scrollTop = logsContainer.scrollHeight;
      } else {
        logsContainer.innerHTML = `<div class="logs-empty"><p>Error: ${data.error}</p></div>`;
      }
    })
    .catch((err) => {
      logsContainer.innerHTML = `<div class="logs-empty"><p>Error: ${err.message}</p></div>`;
    });
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/services')
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        services = data.containers || [];
        renderServices();
        updateServiceSelect();
      }
    })
    .catch((err) => console.error('Failed to load services:', err));
});
