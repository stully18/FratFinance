# Quick Start Guide for Linux Mint

## Prerequisites Check ✅

You already have:
- Python 3.12.3 ✅
- Node.js 18.19.1 ✅

## Running the Application

You need **TWO terminal windows** (one for backend, one for frontend).

### Option 1: Using the Startup Scripts (Easiest)

#### Terminal 1 - Start Backend

```bash
cd ~/Development/FinanceFolder/net-worth-optimizer
./start-backend.sh
```

Wait until you see:
```
✅ Backend is starting at http://localhost:8000
INFO:     Uvicorn running on http://127.0.0.1:8000
```

#### Terminal 2 - Start Frontend

Open a **NEW** terminal window and run:

```bash
cd ~/Development/FinanceFolder/net-worth-optimizer
./start-frontend.sh
```

Wait until you see:
```
✅ Ready at http://localhost:3000
```

### Option 2: Manual Setup (Step-by-Step)

If the scripts don't work, here's the manual approach:

#### Terminal 1 - Backend

```bash
# Navigate to backend
cd ~/Development/FinanceFolder/net-worth-optimizer/backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn app.main:app --reload
```

#### Terminal 2 - Frontend

```bash
# Navigate to frontend
cd ~/Development/FinanceFolder/net-worth-optimizer/frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

## Accessing the Application

1. **Open your web browser** (Firefox, Chrome, etc.)
2. Go to: **http://localhost:3000**
3. You should see the Net Worth Optimizer dashboard

## Testing the Application

Try these example values:

- **Loan Name**: Student Loan
- **Principal Amount**: 25000
- **Interest Rate**: 9.0
- **Minimum Monthly Payment**: 200
- **Monthly Spare Cash**: 100
- **Months Until Graduation**: 48

Click "Optimize My Money" and you should see a recommendation!

## Troubleshooting

### Backend Issues

**Error: "uvicorn: command not found"**
```bash
cd backend
source venv/bin/activate
pip install uvicorn
```

**Error: Port 8000 already in use**
```bash
# Kill the process using port 8000
sudo lsof -ti:8000 | xargs kill -9
```

### Frontend Issues

**Error: "npm: command not found"**
```bash
# Install Node.js
sudo apt update
sudo apt install nodejs npm
```

**Error: Port 3000 already in use**
```bash
# Kill the process using port 3000
sudo lsof -ti:3000 | xargs kill -9
```

**Error: "Cannot find module 'next'"**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Stopping the Application

In each terminal window, press: **Ctrl + C**

## Visual Guide

```
┌─────────────────────────────────────┐
│  Terminal 1                         │
│  Running: Backend (Port 8000)       │
│  $ ./start-backend.sh               │
│                                     │
│  Keep this running ✅               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Terminal 2                         │
│  Running: Frontend (Port 3000)      │
│  $ ./start-frontend.sh              │
│                                     │
│  Keep this running ✅               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Web Browser                        │
│  http://localhost:3000              │
│                                     │
│  Your app interface 🎉             │
└─────────────────────────────────────┘
```

## Next Steps

Once the app is running:
1. Try different loan scenarios
2. See how interest rates affect the recommendation
3. Experiment with different spare cash amounts
4. Check out the interactive chart

Enjoy your Net Worth Optimizer! 🚀
