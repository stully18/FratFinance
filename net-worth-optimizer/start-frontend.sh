#!/bin/bash

echo "🎨 Starting Net Worth Optimizer Frontend..."
echo ""

cd "$(dirname "$0")/frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies (this may take a few minutes)..."
    npm install
fi

# Start the development server
echo ""
echo "✅ Frontend is starting at http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
