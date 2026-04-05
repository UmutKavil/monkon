# Command Line Interface (CLI)

## Overview

monkon comes with a powerful command-line tool for managing your services without opening the desktop app.

```bash
monkon [command] [options]
```

---

## Available Commands

### `monkon start`

Start all Docker services (PHP, MySQL, Apache, PhpMyAdmin).

```bash
monkon start
```

Output:
```
⏳  Starting monkon services...

✅  monkon services started!

Services:
  • Apache:     http://localhost
  • PhpMyAdmin: http://localhost:8080
  • MySQL:      localhost:3306
```

---

### `monkon stop`

Stop all running services.

```bash
monkon stop
```

Output:
```
⏳  Stopping monkon services...

✅  monkon services stopped!
```

---

### `monkon status`

Check the status of all services.

```bash
monkon status
```

Output:
```
📊  monkon Services Status:

NAME            IMAGE              STATUS              PORTS
monkon-apache   httpd:2.4-alpine   Up 2 hours          0.0.0.0:80->80/tcp
monkon-mysql    mysql:8.0          Up 2 hours          0.0.0.0:3306->3306/tcp
monkon-php      monkonom-php       Up 2 hours          9000/tcp
monkon-phpmyadmin phpmyadmin:latest Up 2 hours          0.0.0.0:8080->80/tcp
```

---

### `monkon logs [service]`

View service logs.

```bash
# View all logs
monkon logs

# View specific service logs
monkon logs apache
monkon logs mysql
monkon logs php
monkon logs phpmyadmin
```

Last 50 lines are shown by default.

---

### `monkon restart [service]`

Restart services.

```bash
# Restart all services
monkon restart

# Restart specific service
monkon restart apache
monkon restart mysql
monkon restart php
```

---

### `monkon dashboard`

Start the web dashboard in Express (for terminal-based development without Electron).

```bash
monkon dashboard
```

Output:
```
🌐  Starting monkon dashboard...

✅  Dashboard is running!

📱 Open your browser: http://localhost:3000

Press Ctrl+C to stop
```

---

### `monkon config`

Display current configuration.

```bash
monkon config
```

Output:
```
⚙️   monkon Configuration:

Web Root:        ~/monkon/www
Config Dir:      ~/.monkon
Apache Port:     80
MySQL Port:      3306
PhpMyAdmin Port: 8080
```

---

### `monkon --version`

Show CLI version.

```bash
monkon --version
# Output: 0.1.0
```

---

### `monkon --help`

Show all available commands.

```bash
monkon --help
```

---

## 🆘 Common Usage Patterns

### Quick Start
```bash
# Start everything and open dashboard
monkon start
npm run dev
```

### Check Everything is Running
```bash
monkon status
```

### Troubleshoot a Service
```bash
# Check Apache
monkon logs apache

# Check MySQL
monkon logs mysql
```

### Restart a Stuck Service
```bash
monkon restart mysql
monkon status
```

### Terminal-based Development (No Desktop App)
```bash
monkon start
monkon dashboard
# Visit http://localhost:3000
```

---

## 🔧 Global Installation

The CLI is automatically installed globally when you run `npm install`:

```bash
# From anywhere:
monkon status
monkon start
monkon stop
```

To uninstall:
```bash
npm unlink
```

---

## 📊 Service Names

When using specific service commands, use these names:

- `apache` - Apache web server
- `mysql` - MySQL database
- `php` - PHP-FPM processor
- `phpmyadmin` - PhpMyAdmin interface

Example:
```bash
monkon logs mysql
monkon restart apache
```

---

## 💡 Tips

### Watch Logs Live
```bash
# Watch MySQL logs while starting
monkon start
monkon logs mysql
```

### Quick Restart Loop
```bash
# Restart and check status
monkon restart && monkon status
```

### All Commands at Once
```bash
# For script automation
monkon stop && monkon start && monkon status
```

---

## 🐛 Troubleshooting

### "monkon: command not found"
```bash
# Re-install CLI link
npm link
```

### Command Hangs
```bash
# Press Ctrl+C
# Then try again
monkon status
```

### Docker Error
```bash
# Check Docker is running
docker ps

# If not, start Docker Desktop
open -a Docker
```

---

## 📝 Next Steps

- [Installation](./installation.md)
- [Getting Started](./getting-started.md)
- [Dashboard Guide](./dashboard.md)

---

**Happy hacking! 🚀**
