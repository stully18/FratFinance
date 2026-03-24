#!/bin/bash

# Master setup and run script for FratFinance
# Installs dependencies if needed, then launches backend and frontend

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}   FratFinance - Setup & Launch${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

# --- Preflight checks ---
if ! command -v python3 &>/dev/null; then
    echo -e "${RED}Error: python3 is not installed${NC}"
    exit 1
fi

if ! command -v npm &>/dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

# --- Backend setup ---
echo -e "${GREEN}Setting up backend...${NC}"
cd "$ROOT/backend"

if [ ! -d "venv" ]; then
    echo "  Creating virtual environment..."
    python3 -m venv venv || { echo -e "${RED}Failed to create venv${NC}"; exit 1; }
fi

source venv/bin/activate

echo "  Installing Python dependencies..."
pip install -r requirements.txt --quiet || { echo -e "${RED}pip install failed${NC}"; exit 1; }

# --- Frontend setup ---
echo -e "${GREEN}Setting up frontend...${NC}"
cd "$ROOT/frontend"

if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/next" ]; then
    echo "  Installing Node dependencies..."
    npm install || { echo -e "${RED}npm install failed${NC}"; exit 1; }
fi

# --- Cleanup handler ---
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down...${NC}"
    kill "$BACKEND_PID" 2>/dev/null
    kill "$FRONTEND_PID" 2>/dev/null
    wait 2>/dev/null
    echo -e "${BLUE}Done${NC}"
}
trap cleanup EXIT INT TERM

# --- Launch backend ---
echo ""
echo -e "${GREEN}Starting backend on http://localhost:8000${NC}"
cd "$ROOT/backend"
source venv/bin/activate
uvicorn app.main:app --reload &
BACKEND_PID=$!

# --- Launch frontend ---
echo -e "${GREEN}Starting frontend on http://localhost:3000${NC}"
cd "$ROOT/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "  Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "  Backend:  ${GREEN}http://localhost:8000${NC}"
echo -e "  API docs: ${GREEN}http://localhost:8000/docs${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

wait
