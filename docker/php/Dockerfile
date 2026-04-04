FROM php:${PHP_VERSION:-8.3}-fpm-alpine

# Install required dependencies
RUN apk add --no-cache \
    git \
    curl \
    wget \
    zip \
    unzip \
    vim \
    nano \
    build-base \
    autoconf \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    libzip-dev \
    libxml2-dev \
    oniguruma-dev \
    sqlite-dev

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
    bcmath \
    sockets

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy PHP configuration
COPY php.ini /usr/local/etc/php/conf.d/custom.ini

# Set working directory
WORKDIR /var/www/html

# Create health check script
RUN echo '<?php exit(0);' > /var/www/html/health.php

# Expose port for FPM
EXPOSE 9000

# Health check
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
    CMD php -v >/dev/null 2>&1 || exit 1

# Start PHP-FPM
CMD ["php-fpm"]

