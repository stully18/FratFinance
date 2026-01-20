# Quick Start: Testing Your Supabase Authentication Setup

This guide walks you through verifying your authentication system works end-to-end.

## Prerequisites

✅ Supabase project created and configured
✅ Frontend `.env.local` with your credentials
✅ Backend `.env` with your service key
✅ Database schema created in Supabase

## Step 1: Verify Supabase Database Schema

Before testing auth, make sure the database tables exist.

### Option A: Using Supabase Dashboard (Easiest)

1. Go to https://app.supabase.com and sign in
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Run this query to check if tables exist:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('users_public', 'financial_data', 'plaid_accounts');
```

**Expected result:** You should see three rows:
- `users_public`
- `financial_data`
- `plaid_accounts`

If you don't see these tables, you need to run the schema setup first.

### Option B: If Tables Don't Exist - Run Schema

1. Still in **SQL Editor**, create a new query
2. Copy the entire contents of: `/backend/migrations/001_create_schema.sql`
3. Paste it into the SQL Editor
4. Click **RUN**

Wait for it to complete (should take a few seconds). Then re-run the check query above to verify.

### Verify RLS (Row Level Security) is Enabled

Run this query in SQL Editor:

```sql
SELECT tablename, rowsecurity FROM pg_tables
WHERE tablename IN ('users_public', 'financial_data', 'plaid_accounts');
```

**Expected result:** All three tables should have `rowsecurity = true`

---

## Step 2: Test Backend Connection

Start the backend server and verify it can connect to Supabase.

### Start Backend

```bash
cd /home/shane/Development/FratFinance/FratFinance/net-worth-optimizer/backend

# Activate virtual environment
source venv/bin/activate

# Start the server
uvicorn app.main:app --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

### Test Backend Health Check

Open a new terminal and run:

```bash
curl http://localhost:8000/health
```

**Expected response:**
```json
{"status": "ok"}
```

If you get an error or timeout, the backend isn't connecting properly. Check:
- Is the server running? (check first terminal)
- Are your `.env` variables correct?
- Can you access Supabase dashboard?

---

## Step 3: Start Frontend Development Server

```bash
cd /home/shane/Development/FratFinance/FratFinance/net-worth-optimizer/frontend

# Install if not done
npm install

# Start development server
npm run dev
```

**Expected output:**
```
▲ Next.js 14.2.18
- Local:        http://localhost:3000
```

---

## Step 4: Test Sign Up Flow (Create New Account)

1. Open http://localhost:3000/auth/signup in your browser
2. Fill in the form:
   - **Full Name:** `Test User`
   - **Email:** `testuser+1@example.com` (use a unique email each time you test)
   - **Password:** `TestPassword123!` (strong password)
   - **Confirm Password:** Same as above
3. Click **Sign Up**

### What Should Happen:

✅ **Success:** Redirect to `/auth/login` page
✅ Form clears and you can log in

### What Could Go Wrong:

❌ **Error: "Email already exists"**
- You already created this account. Try a different email (add +2, +3, etc.)

❌ **Error: "Invalid email"**
- Email must be valid format (something@domain.com)

❌ **Error: "Password must be at least 8 characters"**
- Make sure password is 8+ characters

❌ **Stuck on loading state**
- Check browser console (F12 → Console tab) for errors
- Check backend logs (first terminal)
- Verify `.env` variables are correct

❌ **Network error connecting to Supabase**
- Check that `NEXT_PUBLIC_SUPABASE_URL` is correct in `.env.local`
- Make sure you can access Supabase dashboard

### Verify in Supabase Dashboard

1. Go to Supabase dashboard
2. Click **Authentication** → **Users** in left sidebar
3. You should see your new user with the email you used

---

## Step 5: Test Login Flow

1. Go to http://localhost:3000/auth/login
2. Enter the email and password you just signed up with
3. Click **Sign In**

### What Should Happen:

✅ Success message appears
✅ Redirected to `/dashboard`
✅ Navigation shows your email in dropdown menu

### What Could Go Wrong:

❌ **Error: "Invalid login credentials"**
- Email/password combo doesn't match
- Double-check spelling
- Make sure you signed up first

❌ **Error: "User not found"**
- Account doesn't exist in Supabase
- Go back and sign up first

❌ **Stuck on loading**
- Same troubleshooting as sign up

---

## Step 6: Test Protected Routes

Now that you're logged in:

1. Click on any nav item: **Dashboard**, **Plan**, **Investments**, **Calculator**
2. Pages should load normally (these routes are now accessible because you're authenticated)

### Test Route Protection (Without Logging In)

1. Click the dropdown menu (shows your email)
2. Click **Logout**
3. You're redirected to login page
4. Try to access http://localhost:3000/dashboard directly
5. You should be redirected to `/auth/login`

✅ This means protected routes are working!

---

## Step 7: Test Settings Page

1. Make sure you're logged in (you should see your email in nav)
2. Click the dropdown menu → **Settings**
3. You're on the settings page

### Update Profile

1. Change the "Full Name" field to something different
2. Click **Update Profile**
3. Success message appears: "Profile updated successfully"

### Verify in Supabase

1. Go to Supabase dashboard
2. Click **SQL Editor**
3. Run this query:

```sql
SELECT id, email, full_name FROM users_public
ORDER BY created_at DESC LIMIT 1;
```

You should see your user with the updated name.

### Change Password

1. Still on settings page, go to "Change Password" section
2. Enter a new password (8+ characters): `NewPassword123!`
3. Confirm it
4. Click **Change Password**
5. Success message appears

Now try logging out and logging back in with the new password. It should work.

---

## Step 8: Test Logout

1. Click dropdown menu (your email)
2. Click **Logout**
3. You're redirected to login page
4. Navigation shows "Sign In" and "Sign Up" buttons (not logged in anymore)

---

## Full Test Checklist

Copy this and mark off as you go:

```
SUPABASE DATABASE
☐ Tables exist (users_public, financial_data, plaid_accounts)
☐ RLS is enabled on all tables
☐ Can run SQL queries in dashboard

BACKEND
☐ Backend starts without errors
☐ Health check returns 200 OK
☐ No errors in backend console

FRONTEND
☐ Frontend starts without errors (http://localhost:3000)
☐ Home page loads

SIGN UP
☐ Can navigate to /auth/signup
☐ Form has all 4 fields (name, email, password, confirm)
☐ Password strength indicator shows
☐ Can submit form
☐ Redirected to login page on success
☐ User appears in Supabase > Authentication > Users

LOGIN
☐ Can navigate to /auth/login
☐ Form has email and password
☐ Can submit with correct credentials
☐ Redirected to dashboard on success
☐ Navigation shows user email and dropdown
☐ Login with wrong password shows error

PROTECTED ROUTES
☐ Logged in users can access /dashboard
☐ Logged in users can access /plan, /investments, /calculator
☐ Logged out users redirected to login when accessing protected routes
☐ Logged out users cannot see nav items (except login/signup buttons)

SETTINGS
☐ Can navigate to /settings (logged in)
☐ Can see email (read-only) and full name
☐ Can update full name
☐ Change shows in Supabase dashboard
☐ Can change password
☐ Can log out and log in with new password

SESSION
☐ After login, refresh page - still logged in
☐ After logout, refresh page - still logged out
☐ Session persists across pages
```

---

## Troubleshooting

### Common Issues & Solutions

#### Issue: "NEXT_PUBLIC_SUPABASE_URL is not defined"

**Solution:**
1. Check that `.env.local` exists in `frontend/` directory
2. Make sure the file has your Supabase URL
3. Restart the dev server: `Ctrl+C` and `npm run dev` again
4. Next.js caches environment variables on startup

#### Issue: "Invalid Authorization header" error on backend

**Solution:**
1. Make sure `SUPABASE_SERVICE_KEY` is in `backend/.env`
2. Restart backend server
3. Check that the key hasn't changed in Supabase dashboard

#### Issue: "User not found" or "Invalid login credentials"

**Solution:**
1. Make sure user was created (check Supabase > Users)
2. Triple-check email/password spelling
3. Try signing up again with a different email

#### Issue: Protected routes don't redirect to login

**Solution:**
1. Check that `middleware.ts` exists in frontend root
2. Restart frontend dev server
3. Clear browser cookies: F12 → Application → Cookies → Clear all

#### Issue: Network timeout connecting to Supabase

**Solution:**
1. Check internet connection
2. Verify Supabase project is online (dashboard doesn't show errors)
3. Try a different browser
4. Check firewall/VPN isn't blocking Supabase URLs

#### Issue: "Row Level Security violation"

**Solution:**
1. This means RLS policies are working correctly!
2. Make sure you're accessing your own data
3. Check that authenticated user ID matches the data's user_id

---

## What's Working Now?

After passing all these tests, you have:

✅ Secure user authentication via Supabase
✅ Encrypted password storage (Supabase handles this)
✅ Session management with JWT tokens
✅ Protected routes that enforce login
✅ User data isolation (RLS)
✅ Professional login/signup/settings pages
✅ Navigation that shows auth status

**Your app is now a real financial platform with user accounts!**

---

## Next Steps

1. **Connect Plaid** (optional) - Add real bank account data
2. **Save Financial Plans** - Use the new `/api/plans/*` endpoints to persist user's optimization results
3. **Deploy to Production** - When you're ready:
   - Deploy frontend to Vercel (auto-deploys from git)
   - Deploy backend to Railway/Render/Heroku
   - Update frontend `.env` to production Supabase URL and backend API URL

4. **Add More Features:**
   - Email verification before account activation
   - "Forgot Password" flow
   - OAuth sign-in (Google, GitHub, etc.)
   - Two-factor authentication

For deployment instructions, see: `docs/DEPLOYMENT-GUIDE.md` (coming soon)
