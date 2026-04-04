#!/bin/bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${RED}🗑️  monkon Uninstallation Script${NC}"
echo ""
echo -e "${YELLOW}⚠️  This will uninstall monkon from your system${NC}"
echo ""

# Confirm
read -p "Are you sure you want to uninstall monkon? (yes/no): " -n 3 -r
echo
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo -e "${BLUE}Cancelling uninstall${NC}"
    exit 0
fi

# Stop services
echo ""
echo -e "${YELLOW}🛑 Stopping services...${NC}"

if command -v docker-compose &> /dev/null; then
    docker-compose down 2>/dev/null || true
    echo -e "${GREEN}✓ Services stopped${NC}"
fi

# Remove CLI
echo ""
echo -e "${YELLOW}📦 Removing monkon CLI...${NC}"

npm uninstall -g monkon 2>/dev/null || true
echo -e "${GREEN}✓ CLI removed${NC}"

# Ask about removing data
echo ""
echo -e "${YELLOW}❓ Do you want to remove data?${NC}"
read -p "Remove ~/monkon directory with all data? (yes/no): " -n 3 -r
echo
if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    rm -rf ~/monkon
    echo -e "${GREEN}✓ Data removed${NC}"
else
    echo -e "${YELLOW}Keeping ~/monkon directory${NC}"
fi

# Ask about removing config
echo ""
read -p "Remove ~/.monkon configuration? (yes/no): " -n 3 -r
echo
if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    rm -rf ~/.monkon
    echo -e "${GREEN}✓ Configuration removed${NC}"
else
    echo -e "${YELLOW}Keeping ~/.monkon configuration${NC}"
fi

echo ""
echo -e "${GREEN}✅ Uninstallation complete${NC}"
