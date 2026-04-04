# Configuration Guide

## Config File Location

Configuration files are stored in `~/.monkon/` directory:

```
~/.monkon/
├── config              # Main configuration file
├── logs/               # Service logs
└── data/               # Data storage
```

## Environment Variables

Environment variables can be set in `.env` file at the project root:

```bash
# Example .env file
PHP_VERSION=8.3
MYSQL_VERSION=8.0
MONKON_WEB_ROOT=~/monkon/www
APACHE_PORT=80
MYSQL_PORT=3306
MYSQL_ROOT_PASSWORD=root
DEBUG=false
```

## Configuration Options

### PHP Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PHP_VERSION` | 8.3 | PHP version (7.4, 8.0, 8.1, 8.2, 8.3) |
| `PHP_MEMORY_LIMIT` | 512M | PHP memory limit |
| `MAX_UPLOAD_SIZE` | 100M | Max file upload size |
| `MAX_EXECUTION_TIME` | 120 | Script execution timeout (seconds) |

### MySQL Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `MYSQL_VERSION` | 8.0 | MySQL version (5.7, 8.0) |
| `MYSQL_ROOT_PASSWORD` | root | MySQL root password |
| `MYSQL_PORT` | 3306 | MySQL port |
| `MYSQL_MEMORY_LIMIT` | 256M | MySQL memory limit |

### Apache Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `APACHE_PORT` | 80 | HTTP port |
| `APACHE_SSL_PORT` | 443 | HTTPS port |
| `MONKON_WEB_ROOT` | ~/monkon/www | Web root directory |

### General Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `ENABLE_APACHE` | true | Enable Apache service |
| `ENABLE_MYSQL` | true | Enable MySQL service |
| `ENABLE_PHPMYADMIN` | true | Enable PhpMyAdmin |
| `AUTOSTART_ON_LOGIN` | false | Auto-start on login |
| `DEBUG` | false | Enable debug mode |

## Editing Configuration

### Method 1: Using Config Command

```bash
# Edit in default editor (nano, vim)
monkon config --edit
```

### Method 2: Direct File Editing

```bash
# Open with your favorite editor
nano ~/.monkon/config
vim ~/.monkon/config
code ~/.monkon/config
```

### Method 3: Environment Variables

Create `.env` in project root:

```bash
cd ~/monkon
cp .env.example .env
# Edit .env with your values
nano .env
```

## PHP Extensions

Default included PHP extensions:

- `gd` - Image processing
- `pdo` - PHP Data Objects
- `pdo_mysql` - MySQL PDO driver
- `mysqli` - MySQL improved extension
- `opcache` - PHP opcode caching
- `zip` - ZIP file compression
- `xml` - XML processing
- `mbstring` - Multibyte string functions
- `bcmath` - Arbitrary precision math

### Adding Custom Extensions

Edit `docker/php/Dockerfile`:

```dockerfile
RUN docker-php-ext-install -j$(nproc) \
    gd \
    pdo \
    pdo_mysql \
    <your-extension>
```

Then rebuild:

```bash
docker-compose up -d --build
```

## PHP Settings Customization

Edit `docker/php/php.ini`:

```ini
[PHP]
max_execution_time = 120
memory_limit = 512M
upload_max_filesize = 100M
post_max_size = 100M
display_errors = On
date.timezone = UTC
```

## MySQL Custom Configuration

Edit `docker/mysql/my.cnf`:

```ini
[mysqld]
max_connections = 100
innodb_buffer_pool_size = 256M
slow_query_log = 1
```

## Port Configuration

### Changing HTTP Port

Edit `.env`:

```bash
APACHE_PORT=8080
```

Or edit `docker-compose.yml`:

```yaml
php:
  ports:
    - "8080:80"
    - "443:443"
```

Then restart:

```bash
monkon stop
monkon start
```

### Changing MySQL Port

Edit `.env`:

```bash
MYSQL_PORT=3307
```

Connect via:

```bash
mysql -h127.0.0.1 -P3307 -uroot -proot
```

## Performance Tuning

### Increase MySQL Buffer Pool

Edit `.env`:

```bash
MYSQL_MEMORY_LIMIT=512M
```

Edit `docker/mysql/my.cnf`:

```ini
innodb_buffer_pool_size = 512M
```

### Increase PHP Memory

Edit `.env`:

```bash
PHP_MEMORY_LIMIT=1024M
```

### Enable OPCache

PHP OPCache is enabled by default in `docker/php/Dockerfile`.

To verify:

```bash
docker exec monkon-php php -i | grep opcache
```

## Resetting Configuration

### Reset to Defaults

```bash
# Remove configuration directory
rm -rf ~/.monkon/

# Stop and remove containers
monkon stop
docker-compose down

# Restart with fresh config
monkon start
```

### Keep Data During Reset

```bash
# Only remove config, keep data
rm ~/.monkon/config

# Recreate with defaults
monkon config --edit
```

## Troubleshooting Configuration

### Can't connect to MySQL

1. Check password in `.env`
2. Verify MySQL is running: `monkon status`
3. Check MySQL logs: `monkon logs --service mysql`

### PHP extensions not loading

1. Verify they're in Dockerfile: `docker exec monkon-php php -m`
2. Rebuild if you added extensions: `docker-compose up -d --build`

### Port conflicts

```bash
# Find what's using the port
lsof -i :80

# Either stop that service or change monkon port
```

## Advanced Configuration

### Use MariaDB instead of MySQL

Edit `docker-compose.yml`:

```yaml
mysql:
  image: mariadb:latest
  # Rest of configuration
```

### Add custom domains

Edit `/etc/hosts`:

```
127.0.0.1 myapp.local
127.0.0.1 api.local
```

### SSL/HTTPS Configuration

Certificates are located in the PHP container. Self-signed certificates are pre-configured.

For production, use proper SSL certificates.

## Configuration Priority

Settings are applied in this order (highest to lowest priority):

1. Command-line options: `monkon start --option value`
2. Environment variables: `export PHP_VERSION=8.3`
3. `.env` file in project root
4. `~/.monkon/config` file
5. Default values in code

## Next Steps

- [Usage Guide](./usage.md)
- [Architecture](./architecture.md)
