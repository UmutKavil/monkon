# 🎯 monkon

Modern, developer-friendly alternative to XAMPP for macOS.

> A fast, easy-to-use local development environment with PHP, MySQL, Apache, and PhpMyAdmin.

## 🌟 Features

- ✅ **Easy Installation** - One command via Homebrew or DMG installer
- ✅ **Docker-Based** - Secure containerization, works on Intel & Apple Silicon Macs
- ✅ **Multi-Version Support** - Switch between PHP 7.x, 8.x and MySQL versions
- ✅ **GUI Dashboard** - Desktop app for managing services (coming soon)
- ✅ **CLI Tools** - Full command-line control with `monkon` commands
- ✅ **Production-Ready** - Properly configured Apache, PHP-FPM, MySQL
- ✅ **Open Source** - MIT Licensed

## 📋 Requirements

- macOS 10.15+
- Docker Desktop / Docker Command Line Tools
- 2GB Memory available
- 5GB Disk space

## 🚀 Quick Start

### Installation (Coming Soon)

```bash
# Via Homebrew
brew install monkon

# Or download DMG from GitHub
# https://github.com/yourusername/monkon/releases
```

### Usage

```bash
# Start all services
monkon start

# Check status
monkon status

# View logs
monkon logs

# Stop services
monkon stop

# Configure settings
monkon config
```

## 📁 Project Structure

```
monkon/
├── cli/              - Command-line interface
├── electron/         - Desktop GUI application
├── docker/           - Docker configurations
├── scripts/          - Installation & setup scripts
└── docs/             - Documentation
```

## 🛠️ Roadmap

- [x] Project setup & planning
- [ ] Phase 2: Docker configuration
- [ ] Phase 3: CLI tool development
- [ ] Phase 4: Electron GUI
- [ ] Phase 5: Installer & Homebrew
- [ ] Phase 6: Testing & v1.0 release

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
