# Usage Guide

## Basic Commands

### Starting Services

```bash
# Start all services
monkon start

# Start specific service
monkon start --service php
monkon start --service mysql
monkon start --service phpmyadmin
```

After starting, services will be available at:
- **Apache/PHP**: http://localhost
- **MySQL**: localhost:3306 (user: root, password: root)
- **PhpMyAdmin**: http://localhost/phpmyadmin

### Stopping Services

```bash
# Stop all services
monkon stop

# Stop specific service
monkon stop --service php
monkon stop --service mysql
```

### Checking Status

```bash
# Show status of all services
monkon status
```

Output example:
```
Service         Status      Ports               Container ID
monkon-php      ✅ Running  0.0.0.0:80->80/tcp  abc123def456
monkon-mysql    ✅ Running  0.0.0.0:3306->3306  def789ghi012
monkon-phpmyadmin ✅ Running                     jkl345mno678
```

### Viewing Logs

```bash
# View all service logs (last 50 lines)
monkon logs

# View specific service logs
monkon logs --service php
monkon logs --service mysql

# Follow logs in real-time
monkon logs --follow

# View specific number of lines
monkon logs --lines 100
monkon logs --service apache --lines 20
```

### Configuration

```bash
# List all configuration
monkon config --list

# Get specific configuration value
monkon config --get PHP_VERSION

# Edit configuration in your default editor
monkon config --edit
```

## Working with PHP

### Create a Simple PHP Application

```bash
# Create test directory
mkdir -p ~/monkon/www/myapp

# Create application file
cat > ~/monkon/www/myapp/index.php << 'EOF'
<?php
echo "Hello from monkon!";
?>
EOF
```

Visit: http://localhost/myapp

### Using Composer

```bash
# Enter the container
docker exec -it monkon-php bash

# Install dependencies
cd /var/www/html/myproject
composer install

# Exit container
exit
```

### Access Container Shell

```bash
# PHP container
docker exec -it monkon-php bash

# MySQL container
docker exec -it monkon-mysql mysql -uroot -proot

# PhpMyAdmin container
docker exec -it monkon-phpmyadmin bash
```

## Working with MySQL

### Connect via Command Line

```bash
# Connect to MySQL
mysql -h127.0.0.1 -P3306 -uroot -proot

# Or via Docker
docker exec -it monkon-mysql mysql -uroot -proot
```

### Create Database

```bash
# Via PhpMyAdmin
# 1. Go to http://localhost/phpmyadmin
# 2. Click "New"
# 3. Enter database name

# Or via CLI
docker exec -it monkon-mysql mysql -uroot -proot -e "CREATE DATABASE myapp;"
```

### Backup Database

```bash
# Backup all databases
docker exec monkon-mysql mysqldump -uroot -proot --all-databases > backup.sql

# Backup specific database
docker exec monkon-mysql mysqldump -uroot -proot myapp > backup-myapp.sql
```

### Restore Database

```bash
# Restore from backup
docker exec -i monkon-mysql mysql -uroot -proot < backup.sql
```

## Common Tasks

### Change MySQL Password

```bash
# Edit .env.example and change MYSQL_ROOT_PASSWORD
# Then restart services
monkon stop
monkon start
```

### Switch PHP Version

```bash
# Edit .env.example
# Change PHP_VERSION to desired version (7.4, 8.0, 8.1, 8.2, 8.3)

# Rebuild and restart
docker-compose up -d --build
```

### Add Custom Domain

```bash
# Edit /etc/hosts
sudo nano /etc/hosts

# Add entry
127.0.0.1 myapp.local

# Access via http://myapp.local
```

### Use for WordPress

```bash
# Create WordPress directory
mkdir -p ~/monkon/www/wordpress
cd ~/monkon/www/wordpress

# Download WordPress
curl -O https://wordpress.org/latest.tar.gz
tar -xzf latest.tar.gz --strip-components=1
rm latest.tar.gz

# Create database
docker exec monkon-mysql mysql -uroot -proot -e "CREATE DATABASE wordpress;"

# Visit http://localhost/wordpress for setup
```

## Troubleshooting

### Can't access http://localhost

1. Check if services are running: `monkon status`
2. Check Docker: `docker ps`
3. View PHP logs: `monkon logs --service php`

### MySQL connection refused

1. Check MySQL is running: `monkon status`
2. Default credentials: user=root, password=root
3. View MySQL logs: `monkon logs --service mysql`

### Port 80 already in use

1. Find what's using the port: `lsof -i :80`
2. Either stop that service or configure monkon to use different port

### High memory usage

- Reduce MySQL memory limit in config
- Close unused services: `monkon stop --service phpmyadmin`

## Getting Help

- Check [Configuration Guide](./configuration.md)
- Check [Architecture](./architecture.md)
- Report issues on GitHub
