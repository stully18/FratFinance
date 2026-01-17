# 🧪 Testing Your Plaid Integration

## ✅ What Was Just Added

A clean "Connect Bank" button has been added next to the "Spare Cash/Month" field.

### How It Works:
1. User clicks **"Connect Bank"** button
2. Plaid Link modal opens
3. User selects a bank and logs in
4. Plaid fetches account balance
5. App calculates suggested spare cash (25% of balance)
6. **Auto-fills the Spare Cash field**

---

## 🚀 How to Test It

### Step 1: Start Your App

```bash
cd ~/Development/FinanceFolder/net-worth-optimizer
./setup-and-run.sh
```

Wait for both servers to start, then open http://localhost:3000

### Step 2: Look for the Button

In the input form, you'll see:
```
Spare Cash/Month ($)
[___100___] [Connect Bank]
```

The green "Connect Bank" button is next to the spare cash input field.

### Step 3: Click "Connect Bank"

The button will show "Connecting..." briefly, then open the Plaid Link modal.

### Step 4: Select a Test Bank

In the Plaid Link modal:
1. Search for any bank (try "Chase" or "Bank of America")
2. Click on it
3. **Use these test credentials:**
   - Username: `user_good`
   - Password: `pass_good`
   - MFA Code (if asked): `1234`

### Step 5: Watch the Magic

After successful login:
- Plaid will show you 2-3 test accounts
- Click "Continue"
- The modal closes
- **The Spare Cash field auto-updates!**

---

## 💰 What You'll See

### Test Account Balances:
Plaid's sandbox typically shows:
- Checking Account: $100 - $2,000
- Savings Account: $10,000 - $25,000
- Credit Card: various balances

### Auto-Fill Calculation:
```
Total Balance: $15,000 (example)
Suggested Spare Cash: $3,750 (25% of total)
```

The field will update to show the suggested amount. You can still edit it manually if you want!

---

## 🎯 What to Look For

### ✅ Success Indicators:
- "Connect Bank" button appears
- Clicking it opens Plaid modal
- Test login works
- Modal closes after connection
- Spare Cash field updates automatically

### ❌ Troubleshooting:

**Button doesn't appear:**
```bash
# Make sure you installed the frontend dependency
cd frontend
npm install
```

**Modal doesn't open:**
- Check browser console for errors
- Verify backend is running (http://localhost:8000)
- Test the API: `curl http://localhost:8000/api/plaid/create-link-token -X POST -H "Content-Type: application/json" -d '{"user_id":"test"}'`

**"Connecting..." never stops:**
- Backend might not be running
- Check `.env` file has correct Plaid credentials
- Look at terminal for backend errors

**Field doesn't auto-fill:**
- Check browser console for errors
- This means the balance fetch failed (not critical - user can still enter manually)

---

## 🎨 Visual Flow

```
┌─────────────────────────────────────┐
│  Spare Cash/Month ($)               │
│  [  100  ] [ Connect Bank ]         │  ← User clicks green button
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  Plaid Link Modal Opens             │
│  "Select your bank..."              │
│  [Chase] [BofA] [Wells Fargo]       │  ← User selects test bank
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  Login Screen                       │
│  Username: user_good                │  ← User enters test credentials
│  Password: pass_good                │
│  [Continue]                         │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  Accounts Shown                     │
│  ✓ Checking: $1,250                 │  ← Plaid shows test accounts
│  ✓ Savings: $10,500                 │
│  [Continue]                         │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  Spare Cash/Month ($)               │
│  [  2938  ] [ Connect Bank ]        │  ← Field auto-updates!
└─────────────────────────────────────┘
      ↑
    25% of $11,750 total balance
```

---

## 🔒 Privacy Note

**In Sandbox Mode:**
- All data is fake (Plaid test accounts)
- No real bank connections
- Safe to test unlimited times

**When Approved for Production:**
- Real bank connections
- Must handle data securely
- Need proper user authentication
- Store access tokens encrypted

---

## 📊 Next Steps

Once you verify it works:

1. **Test Different Balances**
   - Try other test users: `user_custom` (lets you set custom balances)
   - See how it calculates different suggestions

2. **Add Visual Feedback**
   - Show a success message: "Connected! Found $X in your accounts"
   - Display which accounts were connected

3. **Enhance Calculation**
   - Instead of 25%, analyze spending patterns
   - Suggest safer amount based on transaction history

---

## 🎉 You're Done!

You now have a working Plaid integration that:
- ✅ Connects real bank accounts (in sandbox)
- ✅ Fetches account balances
- ✅ Auto-suggests spare cash amount
- ✅ Provides seamless user experience

Test it out and let me know how it works!
