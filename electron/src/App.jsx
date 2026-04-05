import React, { useEffect, useState } from 'react';
import { RefreshCw, Terminal, Settings as SettingsIcon, Zap } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Logs from './components/Logs';
import SettingsPanel from './components/Settings';
import './index.css';

const STATUS_POLL_INTERVAL_MS = 5000;

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, STATUS_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const result = await window.electron.docker.status();
      if (result.success) {
        setServices(result.containers);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (service) => {
    setLoading(true);
    try {
      await window.electron.docker.start(service);
      await fetchStatus();
    } catch (error) {
      console.error('Error starting service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async (service) => {
    setLoading(true);
    try {
      await window.electron.docker.stop(service);
      await fetchStatus();
    } catch (error) {
      console.error('Error stopping service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await fetchStatus();
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <Zap size={24} className="logo-icon" />
          <h1>⚡ monkon</h1>
          <span className="version">v0.1.0</span>
        </div>
        <button className="refresh-btn" onClick={handleRefresh} disabled={loading}>
          <RefreshCw size={18} className={loading ? 'spinning' : ''} />
        </button>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Zap size={18} />
          Dashboard
        </button>
        <button
          className={`nav-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <Terminal size={18} />
          Logs
        </button>
        <button
          className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <SettingsIcon size={18} />
          Settings
        </button>
      </nav>

      <main className="app-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            services={services}
            loading={loading}
            onStart={handleStart}
            onStop={handleStop}
          />
        )}
        {activeTab === 'logs' && <Logs />}
        {activeTab === 'settings' && <SettingsPanel />}
      </main>
    </div>
  );
}

export default App;
