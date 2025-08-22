#!/bin/bash

set -e

echo "🚀 Starting CV Analyzer Services"
echo "================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
  echo -e "${YELLOW}pnpm not found. Running setup...${NC}"
  ./scripts/setup.sh
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Dependencies not installed. Installing...${NC}"
  pnpm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
  echo -e "${YELLOW}Environment file not found. Creating from template...${NC}"
  cp .env.example .env
  echo -e "${YELLOW}Please update .env with your Gemini API token${NC}"
fi

# Start services
echo -e "${GREEN}Starting development servers...${NC}"
echo ""
echo "📍 Frontend: http://localhost:5173"
echo "📍 Backend:  http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

pnpm dev
