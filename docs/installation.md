# Installation Guide

## ⚡ Quick Start (Recommended)

1. Download and extract monkon
2. Double-click `monkon.command` on desktop
3. Done! Everything starts automatically

---

## System Requirements

- **OS**: macOS 10.15 or later (Intel or Apple Silicon)
- **Memory**: 2GB RAM minimum (4GB recommended)
- **Disk Space**: 5GB free space
- **Docker Desktop**: Latest version

---

## 📥 Installation Steps

### Step 1: Get monkon

**Option A: Clone from GitHub**
```bash
git clone https://github.com/UmutKavil/monkon.git
cd monkon
npm install
cd electron
npm install
cd ..
```

**Option B: Download ZIP**
- Go to https://github.com/UmutKavil/monkon/releases
- Download the latest release
- Extract and open terminal in that folder:
  ```bash
  npm install
  cd electron
  npm install
  cd ..
  ```

### Step 2: Install Docker

1. Download [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
2. Install and launch
3. Wait for Docker to fully start (check menu bar icon)

### Step 3: Create Web Root Directory

```bash
mkdir -p ~/monkon/www
```

This is where your PHP projects go.

### Step 4: Run monkon

**Easiest - Use Launcher:**
```bash
./monkon.sh
```

**Or manually:**
```bash
npm run start
npm run dev
```

---

## ✅ Verify Installation

Open your browser:
- **Web Server**: http://localhost - Should show directory listing
- **PhpMyAdmin**: http://localhost:8080 - Database admin
- **Database**: localhost:3306 - MySQL connection

Dashboard should show all services as "Running" ✓

---

## 🎯 Create Your First Project

```bash
# Create a folder
mkdir ~/monkon/www/myapp

# Create a PHP file
cat > ~/monkon/www/myapp/index.php << 'EOF'
<?php
echo "Hello from monkon! ";
echo "PHP " . phpversion();
?>
EOF

# Visit in browser
open http://localhost/myapp
```

---

## ⚙️ Configuration

Edit `.env` file to customize:

```env
PHP_VERSION=8.3
MYSQL_VERSION=8.0
APACHE_PORT=80
MYSQL_PORT=3306
MYSQL_ROOT_PASSWORD=root
```

Then restart:
```bash
npm run stop
npm run start
```

---

## 🐛 Troubleshooting

### Docker not running
```bash
# Open Docker Desktop
open -a Docker

# Wait 30 seconds, then try again
./monkon.sh
```

### Port 80 already in use
```bash
# Find what's using it
lsof -i :80

# Change in .env
APACHE_PORT=8000

# Restart
npm run stop
npm run start
```

### Cannot connect to MySQL
```bash
# Check if MySQL is running
npm run status

# Credentials:
Host: localhost:3306
User: monkon
Password: monkon_password
Database: monkon_dev
```

### Electron app won't open
```bash
# Try this directly
npm run dev

# If still broken, check Node.js version
node --version  # Should be 16+
```

---

## 📝 Useful Commands

```bash
./monkon.sh          # One-click launcher
npm run start        # Start Docker services
npm run stop         # Stop Docker services
npm run status       # Check service status
npm run logs         # View service logs
npm run dev          # Launch Electron dashboard
npm run build        # Build installer
```

---

## 📚 Next Steps

1. [Getting Started Guide](./getting-started.md) - Learn the basics
2. [Dashboard Docs](./dashboard.md) - Understand the UI
3. [Configuration](./configuration.md) - Customize settings
4. [Architecture](./architecture.md) - How it works

---

## 🆘 Need Help?

- 📖 [GitHub Issues](https://github.com/UmutKavil/monkon/issues)
- 💬 [Discussions](https://github.com/UmutKavil/monkon/discussions)
- 🐛 [Report a Bug](https://github.com/UmutKavil/monkon/issues/new?template=bug.md)

---

**You're ready! Start coding! 🚀**

