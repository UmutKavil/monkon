import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import '../styles/Logs.css';

function Logs() {
  const [selectedService, setSelectedService] = useState('');
  const [logs, setLogs] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (selectedService) {
      fetchLogs();
    }
  }, [selectedService]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const result = await window.electron.docker.logs(selectedService);
      if (result.success) {
        setLogs(result.logs);
      } else {
        setLogs(`Error: ${result.error}`);
      }
    } catch (error) {
      setLogs(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = filter
    ? logs
        .split('\n')
        .filter((line) => line.toLowerCase().includes(filter.toLowerCase()))
        .join('\n')
    : logs;

  return (
    <div className="logs-container">
      <h2>Service Logs</h2>

      <div className="logs-controls">
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="service-select"
        >
          <option value="">Select a service...</option>
          <option value="php">PHP-FPM</option>
          <option value="apache">Apache</option>
          <option value="mysql">MySQL</option>
          <option value="phpmyadmin">PhpMyAdmin</option>
        </select>

        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Filter logs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        {selectedService && (
          <button className="btn btn-secondary" onClick={fetchLogs} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        )}
      </div>

      <div className="logs-viewer">
        {selectedService ? (
          <pre className="logs-content">{filteredLogs || 'No logs available'}</pre>
        ) : (
          <p className="logs-empty">Select a service to view logs</p>
        )}
      </div>
    </div>
  );
}

export default Logs;
