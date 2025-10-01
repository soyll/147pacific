#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🛑 Stopping 147 Pacific DO services...${NC}"

# Stop and remove containers
docker-compose down

echo -e "${GREEN}✅ Services stopped successfully!${NC}"
echo ""
echo -e "${YELLOW}💡 To remove volumes (WARNING: This will delete all data):${NC}"
echo -e "   docker-compose down -v"
echo ""
echo -e "${YELLOW}💡 To remove images:${NC}"
echo -e "   docker-compose down --rmi all"

