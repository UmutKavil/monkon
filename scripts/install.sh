#!/bin/bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 monkon Installation Script${NC}"
echo ""

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}❌ Error: monkon only supports macOS at the moment${NC}"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Error: Docker is not installed${NC}"
    echo "Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed${NC}"

# Check if Docker is running
if ! docker ps &> /dev/null; then
    echo -e "${RED}❌ Error: Docker is not running${NC}"
    echo "Please start Docker Desktop and try again"
    exit 1
fi

echo -e "${GREEN}✓ Docker is running${NC}"

# Create directories
echo ""
echo -e "${YELLOW}📁 Creating directories...${NC}"

mkdir -p ~/.monkon
mkdir -p ~/monkon/www
mkdir -p ~/monkon/data

echo -e "${GREEN}✓ Directories created${NC}"

# Copy environment file
echo ""
echo -e "${YELLOW}⚙️  Setting up configuration...${NC}"

if [ ! -f ~/.monkon/config ]; then
    cp .env.example ~/.monkon/config
    echo -e "${GREEN}✓ Configuration file created at ~/.monkon/config${NC}"
else
    echo -e "${YELLOW}⚠️  Configuration file already exists at ~/.monkon/config${NC}"
fi

# Install monkon CLI globally
echo ""
echo -e "${YELLOW}📦 Installing monkon CLI...${NC}"

npm link 2>/dev/null || {
    echo -e "${YELLOW}Installing npm dependencies first...${NC}"
    npm install
    npm link
}

echo -e "${GREEN}✓ monkon CLI installed globally${NC}"

# Create desktop launcher
echo ""
echo -e "${YELLOW}🖱️  Creating desktop launcher...${NC}"

cat > ~/Desktop/monkon.command << 'LAUNCHER'
#!/bin/bash
cd "$(dirname "$0")/../Desktop/monkonom"
./monkon.sh
LAUNCHER

chmod +x ~/Desktop/monkon.command
echo -e "${GREEN}✓ Desktop launcher created${NC}"

# Create sample PHP file
echo ""
echo -e "${YELLOW}📝 Creating sample files...${NC}"

if [ ! -f ~/monkon/www/index.php ]; then
    cat > ~/monkon/www/index.php << 'EOF'
<?php
phpinfo();
EOF
    echo -e "${GREEN}✓ Sample index.php created${NC}"
fi

# Finish
echo ""
echo -e "${GREEN}✅ Installation complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Run: ${YELLOW}monkon start${NC}"
echo "2. Open: ${YELLOW}http://localhost${NC}"
echo "3. View logs: ${YELLOW}monkon logs${NC}"
echo ""
echo -e "${BLUE}Quick Links:${NC}"
echo "📂 Web Root: ~/monkon/www"
echo "🌐 Apache: http://localhost"
echo "📊 PhpMyAdmin: http://localhost:8080"
echo "⚙️  Config: ~/.monkon/config"
echo ""
echo -e "${BLUE}Commands:${NC}"
echo "  monkon start     - Start all services"
echo "  monkon stop      - Stop all services"
echo "  monkon status    - Check service status"
echo "  monkon logs      - View service logs"
echo "  monkon config    - Edit configuration"
echo ""
