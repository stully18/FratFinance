# Testing Quick Reference Card

## The 3-Minute Setup

### 1. Check Database Schema Exists (1 minute)

Go to https://app.supabase.com → Your Project → **SQL Editor**

Paste and run:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('users_public', 'financial_data', 'plaid_accounts');
```

**Should see 3 rows:** users_public, financial_data, plaid_accounts

**If not, copy from** `/backend/migrations/001_create_schema.sql`, paste into SQL Editor, click RUN

### 2. Start Backend (1 minute)

```bash
cd /home/shane/Development/FratFinance/FratFinance/net-worth-optimizer/backend
source venv/bin/activate
uvicorn app.main:app --reload
```

**Look for:** `Application startup complete`

### 3. Start Frontend (1 minute)

**In new terminal:**
```bash
cd /home/shane/Development/FratFinance/FratFinance/net-worth-optimizer/frontend
npm run dev
```

**Look for:** `http://localhost:3000`

---

## The 5-Minute Full Test

### Test 1: Sign Up (1 min)

1. Go to http://localhost:3000/auth/signup
2. Fill form (use new email each time: testuser+1@example.com, password: Test123!)
3. Click Sign Up
4. Should redirect to login page

### Test 2: Login (1 min)

1. Use the email/password you just created
2. Click Sign In
3. Should see dashboard, nav shows your email

### Test 3: Settings (1 min)

1. Click email dropdown → Settings
2. Update name → click "Update Profile"
3. Check success message

### Test 4: Logout (1 min)

1. Click email dropdown → Logout
2. Redirected to login page
3. Nav shows Sign In / Sign Up buttons

### Test 5: Protected Route (1 min)

1. Try accessing http://localhost:3000/dashboard without logging in
2. Should redirect to http://localhost:3000/auth/login

---

## Verify in Supabase Dashboard

**After Sign Up:** Go to **Authentication** → **Users** → Should see your test user

**After Update Profile:** Go to **SQL Editor** and run:
```sql
SELECT id, email, full_name FROM users_public
ORDER BY created_at DESC LIMIT 1;
```

Should show your updated name.

---

## If Something Breaks

| Error | Fix |
|-------|-----|
| "NEXT_PUBLIC_SUPABASE_URL undefined" | Restart frontend: `Ctrl+C` + `npm run dev` |
| "Can't connect to Supabase" | Check `.env.local` has correct URL and key |
| "Invalid login credentials" | Make sure you signed up first, check spelling |
| "User not found" | Sign up first, then try login |
| "Middleware redirect infinite loop" | Clear cookies: F12 → Application → Cookies → Delete all |
| Backend won't start | Check `.env` has service key, maybe try `pip install -r requirements.txt` |

---

## Complete Testing Checklist

```
[ ] Database tables exist
[ ] Backend starts without errors
[ ] Frontend starts without errors
[ ] Can sign up with new email
[ ] Can login with that email
[ ] Nav shows email when logged in
[ ] Can access /dashboard while logged in
[ ] Can't access /dashboard while logged out
[ ] Can update profile name
[ ] Can change password
[ ] Can logout
[ ] Session persists after page refresh
```

---

## What's Next

✅ All tests passing? Your auth system works!

Now you can:
1. **Save Plans** - Use `/api/plans` endpoints to persist user calculations
2. **Deploy** - Push to Vercel (frontend) and Railway (backend)
3. **Connect Plaid** - Add real bank data (optional)

See `/docs/QUICK-START-TESTING.md` for detailed testing guide
See `/docs/SUPABASE-DATABASE-SETUP.md` for database verification

---

## Production Checklist (When Ready to Deploy)

```
BEFORE DEPLOYING:
[ ] All 5-minute tests pass locally
[ ] No errors in browser console (F12)
[ ] No errors in backend terminal
[ ] Created new Supabase project for production
[ ] Environment variables set correctly on hosting platform
[ ] Database schema ran on production Supabase
[ ] Backend API URL updated in frontend .env
[ ] CORS configured for production domain
[ ] Secrets (API keys) never committed to git
[ ] Tested one full flow on production

AFTER DEPLOYING:
[ ] Can signup on production
[ ] Can login on production
[ ] Can access dashboard
[ ] Settings page works
[ ] Can logout
```

---

**Still stuck?** Read `/docs/QUICK-START-TESTING.md` for full walkthrough with troubleshooting.
