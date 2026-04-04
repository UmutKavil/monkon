# Dashboard Guide

## Overview

monkon Dashboard is a modern web-based interface for managing Docker services in real-time. Built with Express.js and Socket.io, it provides instant updates without page refreshes.

## Starting the Dashboard

```bash
npm run dashboard
```

Then open your browser to: **http://localhost:3000**

## Features

### 📊 Service Management
- **View Status** - See running/stopped status for all services in real-time
- **Start/Stop Services** - Control individual containers with one click
- **Batch Actions** - Start/stop all services at once
- **Live Updates** - Automatic updates using WebSocket connection

### 📝 Live Logs
- Select a service from the dropdown
- View last 100 lines of logs
- Real-time log streaming capability
- Dark theme optimized for reading logs

### 🔍 Quick Info
- Web root directory path
- Quick links to services
- MySQL connection info
- PhpMyAdmin access

### 🎨 UI Features
- **Filter Tabs** - Show all, running, or stopped services
- **Responsive Design** - Works on mobile and desktop
- **Connection Status** - Shows real-time connection status
- **Service Cards** - Detailed info for each container

## Services

| Service | Port | Description |
|---------|------|-------------|
| **Apache** | 80 | Web server |
| **PHP-FPM** | 9000 | PHP application processor |
| **MySQL** | 3306 | Database server |
| **PhpMyAdmin** | 8080 | Database management UI |

## API Endpoints

### Services
- `GET /api/services` - Get all services status
- `POST /api/service/start/:name` - Start a service
- `POST /api/service/stop/:name` - Stop a service
- `POST /api/service/restart/:name` - Restart a service

### Batch Operations
- `POST /api/all/start` - Start all services
- `POST /api/all/stop` - Stop all services
- `POST /api/all/restart` - Restart all services

### Logs
- `GET /api/logs/:service?lines=100` - Get service logs

## Socket.io Events

The dashboard uses Socket.io for real-time updates:

- `status-update` - Emitted when any service status changes
- `status-error` - Emitted when an error occurs

## Configuration

The dashboard runs on port 3000 by default. To change:

```bash
PORT=8000 npm run dashboard
```

## Troubleshooting

### Dashboard not connecting to services
```bash
# Make sure Docker services are running
npm run start

# Check Docker is accessible
docker ps
```

### Logs not showing
```bash
# Verify the service exists
docker-compose ps

# Check logs directly
docker-compose logs <service-name>
```

### Port 3000 already in use
```bash
PORT=3001 npm run dashboard
```

## Development

### Run in development mode
```bash
npm run dev:dashboard
```

### Project Structure
```
dashboard/
├── server.js       - Express server and Socket.io
├── public/
│   ├── index.html  - HTML structure
│   ├── style.css   - Styling
│   └── script.js   - Client-side logic
└── package.json    - Dependencies
```

## Next Features

- [ ] Custom styling themes
- [ ] Service configuration UI
- [ ] Database backup/restore
- [ ] Performance metrics dashboard
- [ ] Automated backups scheduler

## Support

For issues or suggestions, please open an issue on GitHub:
https://github.com/UmutKavil/monkon/issues
