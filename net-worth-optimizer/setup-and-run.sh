#!/bin/bash

echo "═══════════════════════════════════════════════════════"
echo "   Net Worth Optimizer - Setup & Launch"
echo "═══════════════════════════════════════════════════════"
echo ""

# Check if python3-venv is installed
if ! dpkg -l | grep -q python3.12-venv; then
    echo "⚠️  python3.12-venv is not installed"
    echo ""
    echo "Please run this command first:"
    echo "  sudo apt install python3.12-venv"
    echo ""
    exit 1
fi

# Setup Backend
echo "📦 Setting up Backend..."
cd "$(dirname "$0")/backend"

if [ ! -d "venv" ]; then
    echo "  → Creating virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create virtual environment"
        exit 1
    fi
fi

if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    echo "  → Installing Python dependencies..."
    pip install -r requirements.txt --quiet
else
    echo "❌ Virtual environment activation failed"
    exit 1
fi

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd ../frontend

if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/next" ]; then
    echo "  → Installing Node dependencies (this may take a few minutes)..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Node dependencies"
        exit 1
    fi
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "✅ Setup Complete!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "Now I'll start both servers for you..."
echo ""
echo "Backend will run on: http://localhost:8000"
echo "Frontend will run on: http://localhost:3000"
echo ""
echo "Opening browser in 5 seconds..."
echo "Press Ctrl+C to stop both servers"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup EXIT INT TERM

# Start backend in background
cd ../backend
source venv/bin/activate
uvicorn app.main:app --reload &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend in background
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

# Try to open browser
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3000 2>/dev/null
elif command -v firefox > /dev/null; then
    firefox http://localhost:3000 2>/dev/null &
fi

echo ""
echo "🎉 Application is running!"
echo ""
echo "If the browser didn't open automatically, go to:"
echo "👉 http://localhost:3000"
echo ""

# Wait for user to stop
wait
