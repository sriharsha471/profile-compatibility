#!/bin/bash

set -e

echo "🚀 CV Analyzer Setup Script"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
check_node() {
  if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
    if [ "$NODE_VERSION" -ge 20 ]; then
      echo -e "${GREEN}✓ Node.js version $NODE_VERSION detected${NC}"
      return 0
    else
      echo -e "${YELLOW}⚠ Node.js version $NODE_VERSION detected, but version 20+ is required${NC}"
      return 1
    fi
  else
    echo -e "${YELLOW}⚠ Node.js not found${NC}"
    return 1
  fi
}

# Install Node.js using nvm
install_node() {
  echo "Installing Node.js 20..."
  
  # Check if nvm is installed
  if ! command -v nvm &> /dev/null; then
    if [ -s "$HOME/.nvm/nvm.sh" ]; then
      . "$HOME/.nvm/nvm.sh"
    else
      echo "Installing nvm..."
      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
      export NVM_DIR="$HOME/.nvm"
      [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    fi
  fi
  
  echo "Using nvm to install Node.js 20..."
  nvm install 20
  nvm use 20
  nvm alias default 20
  
  echo -e "${GREEN}✓ Node.js 20 installed successfully${NC}"
}

# Check and install pnpm
check_pnpm() {
  if command -v pnpm &> /dev/null; then
    echo -e "${GREEN}✓ pnpm is already installed${NC}"
  else
    echo -e "${YELLOW}Installing pnpm...${NC}"
    npm install -g pnpm
    echo -e "${GREEN}✓ pnpm installed successfully${NC}"
  fi
}

# Main setup process
main() {
  echo ""
  
  # Check Node.js
  if ! check_node; then
    read -p "Would you like to install Node.js 20? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      install_node
    else
      echo -e "${RED}Node.js 20+ is required. Please install it manually.${NC}"
      exit 1
    fi
  fi
  
  # Check pnpm
  check_pnpm
  
  # Install dependencies
  echo ""
  echo "📦 Installing dependencies..."
  pnpm install
  
  # Setup environment file
  if [ ! -f .env ]; then
    echo ""
    echo "🔧 Setting up environment..."
    cp .env.example .env
    
    read -p "Enter your Gemini API authorization token: " token
    if [ ! -z "$token" ]; then
      # Use sed that works on both macOS and Linux
      if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/your_authorization_token_here/$token/" .env
      else
        sed -i "s/your_authorization_token_here/$token/" .env
      fi
      echo -e "${GREEN}✓ Environment configured${NC}"
    else
      echo -e "${YELLOW}⚠ No token provided. Please update .env manually${NC}"
    fi
  else
    echo -e "${GREEN}✓ .env file already exists${NC}"
  fi
  
  echo ""
  echo -e "${GREEN}✅ Setup complete!${NC}"
  echo ""
  echo "To start the development servers, run:"
  echo -e "${YELLOW}  pnpm dev${NC}"
}

main
