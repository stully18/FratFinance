# Plaid Integration Setup Guide

## Step-by-Step Instructions

### 1. Get Your Plaid API Keys

1. Go to https://dashboard.plaid.com/signup and create an account
2. Once logged in, navigate to **Team Settings** → **Keys**
3. Copy your credentials:
   - `client_id`
   - `secret` (sandbox)

### 2. Configure Environment Variables

1. Create a `.env` file in the backend directory:
   ```bash
   cd ~/Development/FinanceFolder/net-worth-optimizer/backend
   cp .env.example .env
   ```

2. Edit the `.env` file with your actual keys:
   ```bash
   nano .env
   ```

3. Replace the placeholder values:
   ```
   PLAID_CLIENT_ID=your_actual_client_id
   PLAID_SECRET=your_actual_sandbox_secret
   PLAID_ENV=sandbox
   ```

4. Save and exit (Ctrl+X, then Y, then Enter)

### 3. Install Dependencies

**Backend:**
```bash
cd ~/Development/FinanceFolder/net-worth-optimizer/backend
source venv/bin/activate
pip install -r requirements.txt
```

**Frontend:**
```bash
cd ~/Development/FinanceFolder/net-worth-optimizer/frontend
npm install
```

### 4. Test the Integration

Once you've completed the setup, restart your application:
```bash
cd ~/Development/FinanceFolder/net-worth-optimizer
./setup-and-run.sh
```

You should see a new **"Connect Bank Account"** button in the app!

### 5. Testing in Sandbox Mode

Plaid provides test credentials for sandbox mode:

**Test Bank Login:**
- **Username:** `user_good`
- **Password:** `pass_good`
- **MFA Code:** `1234` (if prompted)

**Test Accounts:**
- Plaid will show fake accounts with realistic balances
- Transactions will be randomly generated
- Perfect for development and testing

### 6. Enable Products (If Not Already Done)

1. In Plaid Dashboard, go to **Team Settings** → **Products**
2. Enable:
   - ✅ Auth
   - ✅ Transactions
3. Click **Save**

---

## What's Been Added to Your App

### Backend Changes:
- ✅ Plaid Python SDK installed
- ✅ New endpoints:
  - `/api/plaid/create-link-token` - Initializes Plaid Link
  - `/api/plaid/exchange-token` - Exchanges public token for access token
  - `/api/plaid/transactions` - Fetches transaction history
  - `/api/plaid/balance` - Gets account balances

### Frontend Changes:
- ✅ `react-plaid-link` package installed
- ✅ "Connect Bank Account" button added to input form
- ✅ PlaidLink component handles OAuth flow

---

## Security Notes

⚠️ **IMPORTANT:**
- Never commit your `.env` file to git (it's already in `.gitignore`)
- Keep your `PLAID_SECRET` private
- Use sandbox mode for development
- Only switch to production when you're ready to launch

---

## Troubleshooting

### Error: "Invalid client_id"
- Double-check your `PLAID_CLIENT_ID` in `.env`
- Make sure there are no extra spaces or quotes

### Error: "Invalid secret"
- Verify you're using the **sandbox secret**, not production
- Copy/paste directly from Plaid dashboard

### "Connect Bank" button doesn't appear
- Check browser console for errors
- Verify npm install completed successfully
- Restart the development server

---

## Next Steps

Once Plaid is working, you can:
1. Fetch user's account balance → auto-fill "Spare Cash/Month"
2. Analyze transaction history → predict cash flow
3. Categorize spending → show insights
4. Build ML model → semester spending predictor

Ready to go live? Check out the production deployment guide!
