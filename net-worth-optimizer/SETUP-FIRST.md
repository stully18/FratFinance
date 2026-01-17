# First Time Setup for Linux Mint

## Install Required System Packages

Before running the application, you need to install one package:

```bash
sudo apt install python3.12-venv
```

Enter your password when prompted.

This package is needed to create Python virtual environments.

## That's It!

After installing, you can proceed to run the application using the [QUICKSTART.md](QUICKSTART.md) guide.

### Quick Command Summary

```bash
# 1. Install the required package
sudo apt install python3.12-venv

# 2. Start the backend (Terminal 1)
cd ~/Development/FinanceFolder/net-worth-optimizer
./start-backend.sh

# 3. Start the frontend (Terminal 2 - new window)
cd ~/Development/FinanceFolder/net-worth-optimizer
./start-frontend.sh

# 4. Open browser to http://localhost:3000
```
