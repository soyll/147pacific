#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "\n${GREEN}🚀 Starting 147 Pacific - Automotive Accessories Store${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from example...${NC}"
    cp env.example .env
    echo -e "${YELLOW}📝 Please edit .env file with your configuration${NC}"
    echo ""
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose.${NC}"
    exit 1
fi

echo -e "${GREEN}🐳 Building and starting services...${NC}"
echo ""

# Build and start services
docker-compose up --build -d

echo ""
echo -e "${GREEN}✅ Services started successfully!${NC}"
echo ""
echo -e "${YELLOW}📋 Available services:${NC}"
echo -e "  🌐 Storefront:     http://localhost:3000"
echo -e "  🔧 Dashboard:      http://localhost:9000"
echo -e "  🚀 API:           http://localhost:8000/graphql/"
echo -e "  ⚙️  Configurator:   http://localhost:3001"
echo -e "  💳 Payment App:    http://localhost:3002"
echo -e "  📧 Mailpit:        http://localhost:8025"
echo -e "  📊 Jaeger:         http://localhost:16686"
echo ""
echo -e "${YELLOW}📝 To stop services: docker-compose down${NC}"
echo -e "${YELLOW}📝 To view logs: docker-compose logs -f [service-name]${NC}"
echo -e "${YELLOW}📝 To restart: docker-compose restart [service-name]${NC}"
