import React from 'react';
import { Play, Square, AlertCircle } from 'lucide-react';
import '../styles/Dashboard.css';

function Dashboard({ services, loading, onStart, onStop }) {
  const getServiceColor = (state) => {
    if (state === 'running') return 'running';
    return 'stopped';
  };

  const parseServiceName = (name) => {
    if (!name) return 'Unknown';
    return name.replace('monkon-', '').replace('-1', '').toUpperCase();
  };

  return (
    <div className="dashboard">
      <h2>Services Status</h2>

      {loading && services.length === 0 ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="empty-state">
          <AlertCircle size={48} />
          <p>No services found</p>
          <small>Make sure Docker is running</small>
        </div>
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <div
              key={service.ID}
              className={`service-card ${getServiceColor(service.State)}`}
            >
              <div className="service-header">
                <h3>{parseServiceName(service.Service || service.Names)}</h3>
                <span
                  className={`status-badge ${
                    service.State === 'running' ? 'running' : 'stopped'
                  }`}
                >
                  {service.State === 'running' ? '✓ Running' : '○ Stopped'}
                </span>
              </div>

              <div className="service-details">
                <p className="container-id">
                  ID: {(service.ID || '').substring(0, 12)}
                </p>
                {service.Ports && (
                  <p className="ports">Ports: {service.Ports}</p>
                )}
              </div>

              <div className="service-actions">
                {service.State === 'running' ? (
                  <button
                    className="btn btn-danger"
                    onClick={() => onStop(service.Service || service.Names)}
                  >
                    <Square size={16} />
                    Stop
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={() => onStart(service.Service || service.Names)}
                  >
                    <Play size={16} />
                    Start
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="quick-links">
        <h3>Quick Links</h3>
        <div className="links-grid">
          <a href="http://localhost" target="_blank" rel="noopener noreferrer">
            Apache (http://localhost)
          </a>
          <a href="http://localhost:8080" target="_blank" rel="noopener noreferrer">
            PhpMyAdmin (http://localhost:8080)
          </a>
          <a href="http://localhost:3306" target="_blank" rel="noopener noreferrer">
            MySQL (localhost:3306)
          </a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
