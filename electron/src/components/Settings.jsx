import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import '../styles/Settings.css';

function Settings() {
  const [phpVersion, setPhpVersion] = useState('8.3');
  const [mysqlVersion, setMysqlVersion] = useState('8.0');
  const [webRoot, setWebRoot] = useState('~/monkon/www');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // TODO: Save to actual config file
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      {saved && (
        <div className="alert alert-success">
          <p>✓ Settings saved successfully</p>
        </div>
      )}

      <div className="settings-grid">
        <div className="setting-group">
          <label>PHP Version</label>
          <select value={phpVersion} onChange={(e) => setPhpVersion(e.target.value)}>
            <option value="7.4">PHP 7.4</option>
            <option value="8.0">PHP 8.0</option>
            <option value="8.1">PHP 8.1</option>
            <option value="8.2">PHP 8.2</option>
            <option value="8.3">PHP 8.3</option>
          </select>
          <small>Restart services to apply changes</small>
        </div>

        <div className="setting-group">
          <label>MySQL Version</label>
          <select value={mysqlVersion} onChange={(e) => setMysqlVersion(e.target.value)}>
            <option value="5.7">MySQL 5.7</option>
            <option value="8.0">MySQL 8.0</option>
          </select>
          <small>Restart services to apply changes</small>
        </div>

        <div className="setting-group full-width">
          <label>Web Root Directory</label>
          <input
            type="text"
            value={webRoot}
            onChange={(e) => setWebRoot(e.target.value)}
            placeholder="~/monkon/www"
          />
          <small>Where your PHP applications are stored</small>
        </div>

        <div className="setting-group full-width">
          <label>Auto-start on Login</label>
          <input type="checkbox" defaultChecked={false} />
          <small>Automatically start monkon when your Mac boots</small>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={18} />
          Save Settings
        </button>
      </div>

      <div className="settings-info">
        <h3>Information</h3>
        <div className="info-box">
          <h4>Configuration File</h4>
          <p className="monospace">~/.monkon/config</p>
        </div>
        <div className="info-box">
          <h4>Docker Compose</h4>
          <p className="monospace">./docker-compose.yml</p>
        </div>
        <div className="info-box">
          <h4>Web Root</h4>
          <p className="monospace">{webRoot}</p>
        </div>
      </div>

      <div className="alert alert-info">
        <AlertCircle size={18} />
        <p>For advanced configuration, edit ~/.monkon/config file directly</p>
      </div>
    </div>
  );
}

export default Settings;
