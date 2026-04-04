FROM php:${PHP_VERSION:-8.3}-apache

# Install required dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    zip \
    unzip \
    vim \
    nano \
    build-essential \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libzip-dev \
    libxml2-dev \
    libonig-dev \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# Configure PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    gd \
    pdo \
    pdo_mysql \
    mysqli \
    opcache \
    zip \
    xml \
    mbstring \
    bcmath

# Enable Apache modules
RUN a2enmod rewrite
RUN a2enmod ssl
RUN a2enmod proxy
RUN a2enmod proxy_fcgi

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www/html

# Expose ports
EXPOSE 80 443

# Create health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health.php || exit 1

# Start Apache
CMD ["apache2-foreground"]
