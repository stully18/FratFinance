#!/bin/bash

# Simple run script (assumes dependencies are already installed)

echo "Starting Net Worth Optimizer..."
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

# Start backend
cd "$(dirname "$0")/backend"
source venv/bin/activate
echo "Starting backend on http://localhost:8000..."
uvicorn app.main:app --reload &
BACKEND_PID=$!

# Start frontend
cd ../frontend
echo "Starting frontend on http://localhost:3000..."
npm run dev &
FRONTEND_PID=$!

# Wait a bit
sleep 3

echo ""
echo "🎉 Application is running!"
echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user to stop
wait
