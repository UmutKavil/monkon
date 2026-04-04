#!/bin/bash

set -e

echo "🔨 Building monkon GUI application..."

cd electron

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build Electron app
echo "🔨 Building Electron application..."
npm run build

# Create DMG (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "📦 Creating DMG installer..."
    npm run electron-build
    echo ""
    echo "✅ Build complete!"
    echo "📦 Check ./electron/dist/ for the DMG file"
else
    echo "⚠️  Note: DMG creation is only available on macOS"
    echo "Electron app built to ./electron/dist/"
fi

echo ""
echo "🎉 Build process completed!"
