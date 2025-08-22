#!/bin/bash

echo "🛑 Stopping CV Analyzer Services"
echo "================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Kill processes on ports
kill_port() {
  local port=$1
  local pid=$(lsof -ti:$port 2>/dev/null)
  
  if [ ! -z "$pid" ]; then
    echo -e "${YELLOW}Stopping process on port $port (PID: $pid)${NC}"
    kill -9 $pid 2>/dev/null
    echo -e "${GREEN}✓ Port $port cleared${NC}"
  else
    echo "No process found on port $port"
  fi
}

# Stop frontend (port 5173)
kill_port 5173

# Stop backend (port 3000)
kill_port 3000

# Kill any remaining node processes related to the project
pkill -f "turbo run dev" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
pkill -f "tsx watch" 2>/dev/null || true

echo ""
echo -e "${GREEN}✅ All services stopped${NC}"
