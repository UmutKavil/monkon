ARG PHP_VERSION=8.3

FROM php:${PHP_VERSION}-fpm-alpine

# Install required PHP extensions
RUN apk add --no-cache \
    icu-dev \
    libpng-dev \
    jpeg-dev \
    freetype-dev \
    zip \
    git \
    curl

# Compile PHP extensions
RUN docker-php-ext-configure \
    gd --with-freetype --with-jpeg

RUN docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    mysqli \
    gd \
    intl \
    opcache \
    zip

# Create app user
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser

WORKDIR /var/www/html

EXPOSE 9000

CMD ["php-fpm"]
