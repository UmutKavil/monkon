#!/bin/bash

# monkon Masaüstü Uygulamasını Başlat
# Önce servisleri kontrol et, sonra Electron'u aç

cd "$(dirname "$0")" || exit

echo "⚡ monkon başlatılıyor..."
echo ""

# Servislerin çalışıp çalışmadığını kontrol et
if ! docker ps &> /dev/null; then
    echo "❌ Docker çalışmıyor. Lütfen Docker Desktop'ı açın."
    exit 1
fi

# Docker Compose'u kontrol et
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose bulunamadı. Lütfen Docker Desktop'ı kontrol edin."
    exit 1
fi

# Servisleri kontrol et ve gerekirse başlat
echo "🐳 Docker servisleri kontrol ediliyor..."
docker-compose ps &> /dev/null || {
    echo "📦 Docker services başlatılıyor..."
    docker-compose up -d
}

# Bekle
sleep 2

# Electron'u başlat
echo "🖥️  monkon UI açılıyor..."
cd electron && npm run dev
