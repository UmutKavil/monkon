# 🎯 monkon

Modern, developer-friendly alternative to XAMPP for macOS.

> A fast, easy-to-use local development environment with PHP, MySQL, Apache, and PhpMyAdmin.

## 🌟 Features

- ✅ **Easy Installation** - One command via Homebrew or DMG installer
- ✅ **Docker-Based** - Secure containerization, works on Intel & Apple Silicon Macs
- ✅ **Multi-Version Support** - Switch between PHP 7.x, 8.x and MySQL versions
- ✅ **Web Dashboard** - Beautiful UI to manage services in real-time
- ✅ **CLI Tools** - Full command-line control with `monkon` commands
- ✅ **Electron GUI** - Desktop app for managing services
- ✅ **Production-Ready** - Properly configured Apache, PHP-FPM, MySQL
- ✅ **Open Source** - MIT Licensed

## 📋 Requirements

- macOS 10.15+
- Docker Desktop / Docker Command Line Tools
- 2GB Memory available
- 5GB Disk space

## 🚀 Quick Start

### 🖱️ **Easiest Way - One Click!**

**Double-click on Desktop:**
```
📁 monkon.command
```

This will automatically:
1. ✅ Check if Docker Desktop is running
2. ✅ Start Docker Desktop if needed
3. ✅ Launch all services (PHP, MySQL, Apache, PhpMyAdmin)
4. ✅ Open the desktop application

That's it! Everything is ready to use. 🎉

### 🖥️ Or from Terminal:

```bash
# Start everything with one command
./monkon.sh

# Or separately:
npm run start  # Start services
npm run dev    # Open application
```

### 📋 Available Commands

```bash
npm run start    # Start all Docker services
npm run stop     # Stop all services
npm run status   # Check service status
npm run logs     # View service logs
npm run dev      # Launch Electron desktop app
npm run build    # Build installer
```

## 📁 Project Structure

```
monkon/
├── cli/              - Command-line interface (start, stop, logs, config)
├── dashboard/        - Web dashboard with real-time updates (Express + Socket.io)
├── electron/         - Desktop GUI application (Electron + React)
├── docker/           - Docker configurations (PHP-FPM, Apache, MySQL)
├── scripts/          - Installation & setup scripts
├── docs/             - Documentation
└── README.md         - Project overview
```

## 🛠️ Roadmap

- [x] Project setup & planning
- [x] Docker configuration (PHP-FPM, MySQL, Apache, PhpMyAdmin)
- [x] CLI tool development (start, stop, logs, config)
- [x] Web Dashboard (Express + Socket.io with real-time updates)
- [ ] Electron GUI refinement
- [ ] Installer & Homebrew distribution
- [ ] v1.0 release & testing

## 📚 Documentation

- [Installation Guide](./docs/installation.md)
- [Usage Guide](./docs/usage.md)
- [Configuration](./docs/configuration.md)
- [Architecture](./docs/architecture.md)

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

## 📄 License

MIT License - see [LICENSE](./LICENSE) file

## 🙋 Support

- 📖 [Documentation](./docs)
- 💬 [GitHub Discussions](./discussions)
- 🐛 [Report Issues](./issues)

---

**Made with ❤️ for developers**
