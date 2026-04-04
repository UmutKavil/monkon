# Installation Guide

## System Requirements

- **OS**: macOS 10.15 or later
- **Processor**: Intel or Apple Silicon (ARM64)
- **Memory**: 4GB RAM minimum (8GB recommended)
- **Disk Space**: 5GB free space
- **Docker Desktop**: Latest version

## Prerequisites

1. **Install Docker Desktop**
   ```bash
   # Via Homebrew
   brew install --cask docker

   # Or download from https://www.docker.com/products/docker-desktop
   ```

2. **Ensure Docker is running**
   ```bash
   docker --version
   docker ps
   ```

## Installation Methods

### Method 1: From Source (Development)

```bash
# Clone repository
git clone https://github.com/yourusername/monkon.git
cd monkon

# Install dependencies
npm install

# Make monkon command available globally
npm link
```

### Method 2: Homebrew (Coming Soon)

```bash
brew tap yourusername/monkon
brew install monkon
```

### Method 3: DMG Installer (Coming Soon)

1. Download latest DMG from [GitHub Releases](https://github.com/yourusername/monkon/releases)
2. Double-click to mount
3. Run the installer
4. Follow on-screen instructions

## Post-Installation Setup

### 1. Create Web Root Directory

```bash
mkdir -p ~/monkon/www
```

### 2. Add a Test PHP File

```bash
cat > ~/monkon/www/index.php << 'EOF'
<?php
phpinfo();
?>
EOF
```

### 3. Start Services

```bash
monkon start
```

### 4. Verify Installation

- Open http://localhost in your browser
- You should see the PHP info page
- PhpMyAdmin: http://localhost/phpmyadmin

## Troubleshooting

### Docker not running
```bash
open /Applications/Docker.app
```

### Port 80 already in use
```bash
# Check what's using port 80
lsof -i :80

# Alternative: Use different port
# Edit docker-compose.yml and change port
```

### Permission denied when running monkon
```bash
# Make CLI executable
chmod +x /path/to/monkon/cli/monkon.js

# Or install globally
npm link
```

### MySQL connection issues
```bash
# Check MySQL container status
monkon status

# View MySQL logs
monkon logs --service mysql
```

## Next Steps

- [Usage Guide](./usage.md)
- [Configuration](./configuration.md)
- [Architecture](./architecture.md)
