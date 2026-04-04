// Electron IPC Communication
const { docker } = window.electron;

let currentFilter = 'all';
let services = [];
let refreshInterval;

// Elements
const servicesContainer = document.getElementById('servicesContainer');
const logsContainer = document.getElementById('logsContainer');
const serviceSelect = document.getElementById('serviceSelect');
const startAllBtn = document.getElementById('startAllBtn');
const stopAllBtn = document.getElementById('stopAllBtn');
const filterTabBtns = document.querySelectorAll('.tab-btn');

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
startAllBtn.addEventListener('click', async () => {
  startAllBtn.disabled = true;
  await docker.execute('start-all');
  startAllBtn.disabled = false;
  loadServices();
});

stopAllBtn.addEventListener('click', async () => {
  stopAllBtn.disabled = true;
  await docker.execute('stop-all');
  stopAllBtn.disabled = false;
  loadServices();
});

// Service Select
serviceSelect.addEventListener('change', () => {
  const service = serviceSelect.value;
  if (service) {
    fetchLogs(service);
  } else {
    logsContainer.innerHTML = '<div class="logs-empty"><p>Servis seçiniz kaydı görmek için</p></div>';
  }
});

// Functions
function parseServiceName(name) {
  if (!name) return 'Bilinmiyor';
  return name.replace('monkon-', '').replace('-1', '').toUpperCase();
}

function renderServices() {
  if (services.length === 0) {
    servicesContainer.innerHTML = `
      <div class="loading">
        <p>Servis bulunamadı. npm run start ile başlatın</p>
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
        <p>${currentFilter === 'running' ? 'Çalışan' : 'Durmuş'} servis yok</p>
      </div>
    `;
    return;
  }

  const html = filtered
    .map((service) => {
      const serviceName = service.Service || service.Names;
      return `
    <div class="service-card ${service.State}">
      <div class="service-header">
        <span class="service-name">${parseServiceName(serviceName)}</span>
        <span class="status-badge ${service.State}">
          ${service.State === 'running' ? '✓ Çalışıyor' : '○ Durdu'}
        </span>
      </div>

      <div class="service-info">
        <p><strong>ID:</strong> <span class="monospace">${(service.ID || '').substring(0, 12)}</span></p>
        ${service.Ports ? `<p><strong>Portlar:</strong> ${service.Ports}</p>` : ''}
        <p><strong>Durum:</strong> ${service.Status || '-'}</p>
      </div>

      <div class="service-actions">
        ${
          service.State === 'running'
            ? `<button class="btn btn-danger btn-sm" onclick="stopService('${serviceName}')">Durdur</button>`
            : `<button class="btn btn-success btn-sm" onclick="startService('${serviceName}')">Başlat</button>`
        }
        <button class="btn btn-primary btn-sm" onclick="restartService('${serviceName}')">Yeniden Başlat</button>
      </div>
    </div>
  `;
    })
    .join('');

  servicesContainer.innerHTML = html;
}

function updateServiceSelect() {
  const options = ['<option value="">Servis seçiniz...</option>'];

  services.forEach((service) => {
    const name = service.Service || service.Names;
    options.push(`<option value="${name}">${parseServiceName(name)}</option>`);
  });

  serviceSelect.innerHTML = options.join('');
}

async function startService(name) {
  await docker.execute('start', name);
  await loadServices();
}

async function stopService(name) {
  await docker.execute('stop', name);
  await loadServices();
}

async function restartService(name) {
  await docker.execute('restart', name);
  await loadServices();
}

async function fetchLogs(service) {
  logsContainer.innerHTML = '<div class="loading"><div class="spinner"></div><p>Kayıtlar yükleniyor...</p></div>';

  const logs = await docker.getLogs(service);
  if (logs) {
    logsContainer.innerHTML = `<pre>${escapeHtml(logs)}</pre>`;
    logsContainer.scrollTop = logsContainer.scrollHeight;
  } else {
    logsContainer.innerHTML = `<div class="logs-empty"><p>Kayıt bulunamadı</p></div>`;
  }
}

async function loadServices() {
  try {
    services = await docker.getServices();
    renderServices();
    updateServiceSelect();
  } catch (err) {
    console.error('Servisler yüklenirken hata:', err);
    servicesContainer.innerHTML = `<div class="loading"><p>Hata: ${err.message}</p></div>`;
  }
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
  loadServices();

  // Refresh every 5 seconds
  refreshInterval = setInterval(loadServices, 5000);
});

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  if (refreshInterval) clearInterval(refreshInterval);
});
