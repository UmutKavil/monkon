// Electron IPC Communication
const { docker } = window.electron;

let services = [];
let refreshInterval;

// ==================== DOM ELEMENTS ====================
const navItems = document.querySelectorAll('.nav-item[data-section]');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('pageTitle');
const serversList = document.getElementById('serversList');
const serversDetailed = document.getElementById('serversDetailed');
const activityLog = document.getElementById('activityLog');

// ==================== NAVIGATION ====================
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Remove active from all nav items
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    
    // Hide all pages
    pages.forEach(p => p.classList.remove('active'));
    
    // Show selected page
    const section = item.dataset.section;
    const page = document.getElementById(section);
    if (page) {
      page.classList.add('active');
      
      // Update title
      const titleMap = {
        dashboard: 'Server Status',
        servers: 'All Services',
        config: 'Configuration',
        tools: 'Tools',
        projects: 'Projects',
        support: 'Support'
      };
      pageTitle.textContent = titleMap[section] || 'Dashboard';
    }
  });
});

// ==================== SERVER RENDERING ====================
function renderDashboard() {
  if (services.length === 0) {
    serversList.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <p>Sunucular yükleniyor...</p>
      </div>
    `;
    return;
  }

  const html = services.map(service => {
    const isRunning = service.State === 'running';
    const portInfo = service.Ports || '-';
    const serviceName = service.Service || service.Names || 'Unknown';
    
    // Service icons
    const icons = {
      'apache': '🪶',
      'php': '🐘',
      'mysql': '🐬',
      'phpmyadmin': '🗄️'
    };
    
    const icon = Object.entries(icons).find(([key]) => serviceName.toLowerCase().includes(key))?.[1] || '📦';
    
    return `
      <div class="server-item ${isRunning ? 'running' : ''}">
        <div class="server-icon">${icon}</div>
        <div class="server-info">
          <div class="server-name">${serviceName.toUpperCase()}</div>
          <div class="server-status">
            <span class="status-dot"></span>
            ${isRunning ? 'Running' : 'Stopped'}
          </div>
        </div>
        <div class="server-stat">
          <span class="stat-value">${Math.floor(Math.random() * 5000) + 100}</span>
          <span class="stat-label">reqs</span>
        </div>
        <div class="server-stat">
          <span class="stat-value">Port</span>
          <span class="stat-label">${portInfo.split(':')[0] || '-'}</span>
        </div>
        <button class="btn-sm">Config</button>
        <button class="btn-sm">Logs</button>
        <button class="btn-sm ${isRunning ? '' : 'success'}" onclick="handleService('${serviceName}', '${isRunning ? 'stop' : 'start'}')">
          ${isRunning ? 'Stop' : 'Start'}
        </button>
        <button class="btn-sm" onclick="handleService('${serviceName}', 'restart')">Restart</button>
      </div>
    `;
  }).join('');
  
  serversList.innerHTML = html;
}

function renderServersDetailed() {
  if (services.length === 0) {
    serversDetailed.innerHTML = '<p style="color: #888;">No services found</p>';
    return;
  }

  const html = services.map(service => {
    const isRunning = service.State === 'running';
    const serviceName = service.Service || service.Names || 'Unknown';
    
    return `
      <div style="margin-bottom: 16px; padding: 16px; background: var(--bg-dark); border-radius: 8px;">
        <h3>${serviceName}</h3>
        <p style="margin: 8px 0; font-size: 12px; color: #888;">
          Status: ${isRunning ? '✓ Running' : '✗ Stopped'}<br>
          ID: ${service.ID}<br>
          Ports: ${service.Ports || '-'}
        </p>
      </div>
    `;
  }).join('');
  
  serversDetailed.innerHTML = html;
}

async function handleService(name, action) {
  await docker.execute(action, name);
  await loadServices();
}

// ==================== SERVICE MANAGEMENT ====================
async function loadServices() {
  try {
    services = await docker.getServices();
    renderDashboard();
    renderServersDetailed();
    updateStatusBar();
    addActivityLog(`Services refreshed`);
  } catch (err) {
    console.error('Error loading services:', err);
  }
}

function updateStatusBar() {
  const runningCount = services.filter(s => s.State === 'running').length;
  const statusText = `Ready | ${runningCount}/${services.length} services active | PHP 8.3 | Port 80, 3306 | monkon v1.2`;
  document.getElementById('statusText').textContent = statusText;
}

function addActivityLog(message) {
  const time = new Date().toLocaleTimeString('tr-TR');
  const item = document.createElement('div');
  item.className = 'activity-item';
  item.innerHTML = `<span class="time">[${time}]</span><span>${message}</span>`;
  
  activityLog.insertBefore(item, activityLog.firstChild);
  
  // Keep only last 10 items
  while (activityLog.children.length > 10) {
    activityLog.removeChild(activityLog.lastChild);
  }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  console.log('Dashboard loaded');
  loadServices();
  
  // Refresh every 5 seconds
  refreshInterval = setInterval(loadServices, 5000);
});

// Cleanup
window.addEventListener('beforeunload', () => {
  if (refreshInterval) clearInterval(refreshInterval);
});
