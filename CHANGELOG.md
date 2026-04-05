# Changelog

All notable changes to monkon will be documented in this file.

## [0.1.0] - 2026-04-05

### ✨ Features

**Desktop Application**
- Native Electron app with dark theme
- Sidebar navigation (Dashboard, Servers, Config, Tools, Projects)
- Real-time service management via IPC
- Start/Stop individual services
- Start/Stop all services at once
- Activity log with timestamps
- Service status indicators
- Performance monitoring dashboard
- Responsive layout (macOS optimized)

**CLI Tool**
- `monkon start` - Start all Docker services
- `monkon stop` - Stop all services
- `monkon status` - Check service status
- `monkon logs [service]` - View service logs
- `monkon restart [service]` - Restart services
- `monkon dashboard` - Launch web dashboard
- `monkon config` - Show configuration
- Global installation support
- Colored output with feedback
- Error handling and recovery

**Docker Services**
- PHP 8.3 (FPM) with common extensions
- MySQL 8.0 with data persistence
- Apache 2.4 with PHP proxy configuration
- PhpMyAdmin for database management
- Health checks for all services
- Volume mounting for persistent data

**Installation & Distribution**
- One-click launcher script (`monkon.sh`)
- Desktop launcher (`monkon.command`)
- Automatic Docker Desktop detection and startup
- Auto-start Docker services on app launch
- Installation script with validation
- Uninstall script with data preservation
- Homebrew formula ready

**Documentation**
- Installation guide (step-by-step)
- Getting started guide (quick reference)
- CLI command reference
- Dashboard user guide
- Configuration documentation
- Architecture overview
- Distribution & release guide
- Troubleshooting section

### 🐛 Bug Fixes
- Fixed ES modules support in Electron
- Fixed Docker Desktop auto-detection
- Fixed IPC handler initialization
- Fixed CLI spawn import

### 🔧 Technical Details

**Stack**
- Electron 30.x for desktop app
- Express.js for web dashboard
- Docker Compose for service orchestration
- Commander.js for CLI
- Chalk for colored terminal output

**Architecture**
- Main electron process handles Docker communication
- IPC for service control
- Docker Compose for service management
- Node.js CLI for terminal access
- Responsive web UI with dark theme

**Performance**
- ~50MB disk space for Electron app
- ~5GB for Docker images
- Low memory footprint (~150MB idle)
- Real-time updates via IPC

---

## [Unreleased]

### Planned Features

**v0.2.0**
- [ ] Custom PHP/MySQL version selection
- [ ] Service configuration UI
- [ ] Database backup/restore
- [ ] Performance metrics graphs
- [ ] Custom domain support
- [ ] SSL/HTTPS configuration
- [ ] Multiple project workspace management

**v0.3.0**
- [ ] Windows support
- [ ] Linux support
- [ ] Cloud synchronization
- [ ] Remote access capabilities
- [ ] Team collaboration features

**v1.0.0**
- [ ] Code signing for security
- [ ] Auto-update mechanism
- [ ] Native installer for all platforms
- [ ] Production stability
- [ ] Extended documentation

### Known Limitations

- macOS only (Windows/Linux coming soon)
- Requires Docker Desktop
- Local development only (not for production)
- Single machine deployment

---

## [0.0.1] - 2026-04-01

### Initial Setup

- Project initialization
- Docker Compose configuration
- Basic CLI scaff

olding
- Planning and architecture design

---

## How to Contribute

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/):
- MAJOR version for incompatible API changes
- MINOR version for new functionality in a backwards-compatible manner
- PATCH version for backwards-compatible bug fixes

---

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

**Last Updated:** April 5, 2026

**Maintained by:** [Your Name/Organization]

**Issues:** https://github.com/UmutKavil/monkon/issues

**Discussions:** https://github.com/UmutKavil/monkon/discussions
