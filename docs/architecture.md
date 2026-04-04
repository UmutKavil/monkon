# Architecture Guide

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   User Interface                     │
├─────────────────────────────────────────────────────┤
│  Electron App (GUI) | CLI Commands | Web Browsers   │
└────────────┬────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────┐
│              Docker Compose Orchestration            │
├─────────────────────────────────────────────────────┤
│  docker-compose.yml - Service Management            │
└────────────┬────────────────────────────────────────┘
             │
    ┌────────┴────────┬───────────┬──────────────┐
    │                 │           │              │
┌───▼──────┐  ┌──────▼──┐  ┌────▼──────┐  ┌───▼──────┐
│ PHP-FPM  │  │ Apache  │  │  MySQL    │  │PhpMyAdmin│
│ Container│  │Container│  │ Container │  │Container │
└──────────┘  └────┬────┘  └───┬───────┘  └──────────┘
                   │           │
              Serves HTML    Stores Data
                   │           │
           ~/monkon/www/   MySQL Data Volume
```

## Component Breakdown

### 1. CLI Layer (`cli/`)

**Purpose**: Command-line interface for monkon management

**Components**:
- `monkon.js` - Main entry point
- `commands/` - Individual command implementations
  - `start.js` - Start services
  - `stop.js` - Stop services
  - `status.js` - Show status
  - `logs.js` - View logs
  - `config.js` - Configuration management

**Technology**: Node.js with Commander.js

**Flow**:
```
User Input → monkon.js → Command Router → Docker API → Services
```

### 2. Docker Backend (`docker/`)

**Purpose**: Container images and configuration

**Components**:
- `php/` - PHP-FPM + Apache
  - `Dockerfile` - Build configuration
  - `php.ini` - PHP settings
  - `apache-config.conf` - Apache VirtualHost
- `mysql/` - MySQL database
  - `my.cnf` - MySQL configuration
- `phpmyadmin/` - Database management UI

### 3. Electron GUI (`electron/`) - Coming Soon

**Purpose**: Desktop application for service management

**Components**:
- `main.js` - Electron main process
- `src/` - React/Vue components
  - `Dashboard.tsx` - Service status display
  - `Settings.tsx` - Configuration UI
  - `Logs.tsx` - Log viewer
- `public/` - Static assets

**Technology**: Electron + React/TypeScript

### 4. Configuration Management

**Locations**:
- Project root: `.env` - Environment variables
- User home: `~/.monkon/config` - User configuration
- Git: `.env.example` - Example configuration

**Hierarchy**:
```
CLI Arguments
    ↓
Environment Variables (.env)
    ↓
User Config (~/.monkon/config)
    ↓
Defaults (in code)
```

## Data Flow

### Starting Services

```
monkon start
    ↓
start.js (CLI command)
    ↓
docker-compose up -d
    ↓
Pull images (if needed)
    ↓
Create containers
    ↓
Start services
    ↓
Health checks
    ↓
Ready for requests
```

### Accessing Applications

```
User Browser → localhost/
    ↓
Apache/PHP Container
    ↓
Serves ~/monkon/www/
    ↓
PHP processes request
    ↓
Queries MySQL (if needed)
    ↓
Response sent to browser
```

## Service Dependencies

```
PhpMyAdmin
    ↓
    └── depends on MySQL

Apache + PHP
    ├── depends on MySQL (optional)
    └── serves from ~/monkon/www/

MySQL
    └── standalone
```

## Volume Management

### Persistent Volumes

1. **Web Root**: `~/monkon/www` → `/var/www/html`
   - User's PHP applications
   - Mounted from host filesystem

2. **MySQL Data**: `monkon-mysql-data` Docker volume
   - Databases persist across restarts
   - Automatic backup possible

3. **Configuration**: `~/.monkon/` directory
   - User settings
   - Logs
   - Cache

### Volume Flow

```
User creates app files
    ↓
~/monkon/www/
    ↓
Docker volume mount
    ↓
/var/www/html in container
    ↓
Apache serves files
```

## Networking

### Container Communication

```
monkon-network (Docker bridge)
    ├── monkon-php (Apache + PHP)
    ├── monkon-mysql (MySQL)
    └── monkon-phpmyadmin (PhpMyAdmin)

Internal Communication:
- PHP → MySQL: mysql:3306 (via service name)
- PhpMyAdmin → MySQL: mysql:3306
```

### Port Mapping

```
Host Machine          Container
127.0.0.1:80    →    Apache:80
127.0.0.1:443   →    Apache:443
127.0.0.1:3306  →    MySQL:3306
```

## Configuration Flow

```
User edits .env or ~/.monkon/config
    ↓
CLI reads configuration
    ↓
docker-compose.yml templating
    ↓
Docker receives values
    ↓
Container customization
```

## Security Considerations

### Current (Development)

- ✅ Default user/password: root/root
- ✅ MySQL accessible externally
- ✅ No SSL by default
- ✅ Suitable for local development only

### Production (Future)

- [ ] Strong password requirements
- [ ] MySQL bind to localhost only
- [ ] SSL/TLS certificates
- [ ] Encrypted volumes
- [ ] Authentication layer

## Scaling & Performance

### Current Setup

- Single machine deployment
- All services on one host
- Shared network namespace
- Suitable for: Individual developers, small teams

### Future Optimizations

- Multi-container orchestration
- Service replicas
- Load balancing
- Horizontal scaling

## File Organization

```
monkonom/
├── cli/                    # Node.js CLI commands
│   ├── monkon.js          # Entry point
│   ├── commands/          # Command implementations
│   └── utils/             # Utilities
├── electron/               # Electron GUI (future)
│   ├── main.js
│   ├── src/
│   └── package.json
├── docker/                 # Container definitions
│   ├── php/               # PHP-Apache image
│   ├── mysql/             # MySQL image
│   └── phpmyadmin/        # PhpMyAdmin image
├── scripts/               # Installation scripts
├── docs/                  # Documentation
├── docker-compose.yml     # Service orchestration
├── package.json           # Node.js dependencies
└── README.md              # Project overview
```

## Future Architecture

### Phase 2: GUI (Electron)

```
┌─────────────────────────────────────┐
│   Web Server                        │
│  (Electron/React)                  │
└────────────┬────────────────────────┘
             │ HTTP/WebSocket
             ↓
┌─────────────────────────────────────┐
│   Backend API Service (Node.js)     │
│  - Service management               │
│  - Configuration                    │
│  - Log streaming                    │
└────────────┬────────────────────────┘
             │
    ┌────────┴─────────┐
    ↓                  ↓
Docker Services    File System
```

### Phase 3: Multi-Version Support

```
PHP Stack:
  ├── PHP 7.4
  ├── PHP 8.0
  ├── PHP 8.1
  ├── PHP 8.2
  └── PHP 8.3

MySQL Stack:
  ├── MySQL 5.7
  └── MySQL 8.0

User selects version → CLI manages containers → Service runs

```

### Phase 4: Windows Support

- Native components for Windows
- PowerShell CLI replacement
- Windows installer
- Network sharing adjustments

## Technology Stack

| Layer | Technology |
|-------|-----------|
| CLI | Node.js, Commander.js |
| GUI | Electron, React, TypeScript |
| Container | Docker, Docker Compose |
| PHP | PHP-FPM, Apache |
| Database | MySQL 8.0 |
| Management | PhpMyAdmin |

## Development Workflow

```
Developer edits code
    ↓
Run: npm install
    ↓
Run: npm test
    ↓
Run: monkon start
    ↓
Test in browser
    ↓
monkon logs for debugging
    ↓
Iterate...
```

## Deployment Workflow

```
1. Test on macOS (Intel + Apple Silicon)
2. Package artifacts
3. Create GitHub release
4. Publish to Homebrew
5. Create DMG installer
6. Release notes & announcement
```
