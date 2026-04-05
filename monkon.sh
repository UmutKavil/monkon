#!/bin/bash

# ==================== MONKON LAUNCHER ====================
# One-click launcher - Docker servisleri başlatıp Electron uygulamasını açar

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo ""
echo "⚡ monkon Launcher Starting..."
echo ""

# Docker kurulu mu kontrol et
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo "Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Docker daemon çalışıyor mu kontrol et
if ! docker ps &> /dev/null; then
    echo "⏳ Docker Desktop is not running..."
    echo "🔄 Opening Docker Desktop..."

    # macOS için Docker Desktop'ı aç
    open -a Docker

    # Docker'ın başlamasını bekle
    echo "⏳ Waiting for Docker to start (this may take a moment)..."
    for i in {1..30}; do
        if docker ps &> /dev/null; then
            echo "✅ Docker is ready!"
            break
        fi
        sleep 1
    done
fi

# Docker hala çalışmıyor mu?
if ! docker ps &> /dev/null; then
    echo "❌ Docker is not responding. Please start Docker Desktop manually."
    exit 1
fi

echo ""
echo "🐳 Docker is running!"
echo "🚀 Starting monkon services..."
echo ""

# Services başlat
npm run start 2>/dev/null || echo "Note: Services starting..."

echo ""
echo "✨ Opening monkon Dashboard..."
echo ""

# Electron uygulamasını başlat
npm run dev
