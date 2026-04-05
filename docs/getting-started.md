# monkon NextGen - Developer Guide

## Quick Start - 3 Steps

### 🖱️ Step 1: Launch monkon (Easiest)
Double-click `monkon.command` on your desktop. Done!

### 🖥️ Step 2: Manual Launch
```bash
cd ~/Desktop/monkonom
./monkon.sh
```

### 💻 Step 3: Manual Control
```bash
# In the project directory:
npm run start  # Start services
npm run dev    # Open dashboard
npm run stop   # Stop services
```

---

## 📋 Commands Reference

| Command | What it does |
|---------|------------|
| `npm run start` | Start all Docker services (PHP, MySQL, Apache, PhpMyAdmin) |
| `npm run stop` | Stop all Docker services |
| `npm run status` | Show services status |
| `npm run logs` | View service logs |
| `npm run dev` | Launch Electron dashboard |
| `npm run build` | Build app installer |
| `./monkon.sh` | One-command launcher (start + dashboard) |

---

## 🎯 Features

### Dashboard Features
- **Service Management**: Start/Stop individual services or all at once
- **Activity Log**: Real-time logs of all actions
- **Status Monitoring**: CPU, Memory, Active connections
- **Performance Charts**: Visual monitoring
- **Dark Theme**: Easy on the eyes, professional look

### Available Services
- **Apache** - Web Server (Port 80, 443)
- **PHP-FPM** - PHP Processor (v8.3)
- **MySQL** - Database Server (Port 3306)
- **PhpMyAdmin** - Database Management UI (Port 8080)

### Project Structure
```
Web Root: ~/monkon/www
Config:   ~/.monkon/
Logs:     Docker containers
```

---

## 🔧 Configuration

### Edit PHP/MySQL Versions
Edit `.env` file:
```bash
PHP_VERSION=8.3
MYSQL_VERSION=8.0
```

Then restart services:
```bash
npm run stop
npm run start
```

### Change Web Root
Edit `.env`:
```bash
MONKON_WEB_ROOT=~/monkon/www
```

---

## 🐛 Troubleshooting

### Docker Desktop Not Opening
```bash
# Open manually from Applications
open -a Docker

# Wait 30 seconds, then run again
./monkon.sh
```

### Port Already in Use
```bash
# Find what's using port 80
lsof -i :80

# Kill the process
kill -9 <PID>
```

### Services Won't Start
```bash
# Check Docker
docker ps

# Rebuild containers
docker-compose down
docker-compose up -d
```

### Can't connect to MySQL
```bash
# Check MySQL logs
docker-compose logs mysql

# MySQL credentials:
User: monkon
Password: monkon_password
Host: localhost:3306
```

---

## File Locations

| Item | Location |
|------|----------|
| Web Files | `~/monkon/www/` |
| Config | `~/.monkon/` |
| Docker Configs | `./docker/` |
| Database Data | Docker volume `monkon-mysql-data` |

---

## 🚀 Next Steps

1. **Create a PHP project** in `~/monkon/www/`
2. **Access from browser**: http://localhost
3. **Database Management**: http://localhost:8080 (PhpMyAdmin)
4. **View logs** in the dashboard

---

## 📞 Support

- 📖 [GitHub Issues](https://github.com/UmutKavil/monkon/issues)
- 💬 [Discussions](https://github.com/UmutKavil/monkon/discussions)
- 🐛 [Report Bug](https://github.com/UmutKavil/monkon/issues/new)

---

## 🔐 Security Notes

- Default MySQL password: `monkon_password` (change in .env)
- Services only available on localhost
- Not recommended for production use
- For development only

---

**Made with ❤️ for developers**
