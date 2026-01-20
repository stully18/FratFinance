# Supabase Setup Checklist - Start Here!

This is your quick checklist to get Supabase authentication working. Follow these steps in order.

## Phase 1: Create Supabase Project (5 minutes)

- [ ] **Go to https://supabase.com**
- [ ] **Click "Sign Up"** and use GitHub or Google to create your account
- [ ] **Create a New Project:**
  - Name: `FratFinance` (or any name you prefer)
  - Database Password: Create a strong password (example: `MySecurePass123!`) - SAVE THIS
  - Region: Pick your region
  - Pricing: Select **Free**
- [ ] **Wait** for your project to be created (2-3 minutes, don't close the page)

## Phase 2: Get Your Credentials (2 minutes)

Once your project is created:

- [ ] **Click on your project** in the Supabase dashboard
- [ ] **Go to Settings** (gear icon at bottom left)
- [ ] **Click on API** in the menu
- [ ] **Find and copy:**
  - [ ] **Project URL** - looks like: `https://fbgrtbkwdsjiwxyz.supabase.co`
  - [ ] **Anon Key** - a long string starting with `eyJhbGc...`
  - [ ] **Service Role Key** - a very long string starting with `eyJhbGc...`

> Pro tip: Open notepad/TextEdit and paste these temporarily so you don't lose them!

## Phase 3: Add to Backend Configuration (2 minutes)

- [ ] **Open this file:** `net-worth-optimizer/backend/.env`
- [ ] **Find the line:** `SUPABASE_URL=https://your-project-id.supabase.co`
- [ ] **Replace** `https://your-project-id.supabase.co` with YOUR **Project URL**
- [ ] **Find the line:** `SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here`
- [ ] **Replace** `your_service_role_key_here` with YOUR **Service Role Key**
- [ ] **Save the file** (CTRL+S or CMD+S)

Example result:
```env
SUPABASE_URL=https://fbgrtbkwdsjiwxyz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIs...
```

## Phase 4: Add to Frontend Configuration (2 minutes)

- [ ] **Open this file:** `net-worth-optimizer/frontend/.env.local`
- [ ] **Find the line:** `NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co`
- [ ] **Replace** `https://your-project-id.supabase.co` with YOUR **Project URL** (same as backend!)
- [ ] **Find the line:** `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here`
- [ ] **Replace** `your_anon_key_here` with YOUR **Anon Key**
- [ ] **Save the file** (CTRL+S or CMD+S)

Example result:
```env
NEXT_PUBLIC_SUPABASE_URL=https://fbgrtbkwdsjiwxyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIs...
```

## Phase 5: Test Your Setup (3 minutes)

**Stop all running servers first** (CTRL+C in any terminals)

- [ ] **Start Backend:**
  ```bash
  cd net-worth-optimizer/backend
  # Start your backend (command depends on your setup)
  ```
  - ✅ No Supabase-related errors = Good!
  - ❌ "undefined" errors = Double-check your .env file

- [ ] **Start Frontend:**
  ```bash
  cd net-worth-optimizer/frontend
  npm run dev
  ```
  - ✅ Opens at http://localhost:3000 = Good!
  - ❌ Console shows Supabase errors = Check .env.local file

- [ ] **Check Browser Console** (Press F12 or right-click → Inspect)
  - Look for any red errors about "SUPABASE"
  - You should see NO errors

## Phase 6: You're Done!

If you reached here without errors, congratulations! Your Supabase authentication is ready.

### What Just Happened?

- ✅ Created a Supabase account
- ✅ Created a database project
- ✅ Configured backend to connect to database
- ✅ Configured frontend to authenticate users

### Next Steps

Users can now:
- Sign up with email and password
- Log in
- Reset their password
- Have their data stored in the database

### If Something Goes Wrong

**Error: "SUPABASE_URL is undefined"**
- Fix: Restart your dev server after editing .env files

**Error: "Failed to connect to Supabase"**
- Check: Make sure URL has no typos and includes `https://`
- Check: Make sure Service Role Key is complete

**Error: "Anon Key missing"**
- Check: Make sure frontend .env.local has `NEXT_PUBLIC_` prefix
- Check: Make sure file is .env.local (not .env)

---

**For detailed information**, read: `docs/SUPABASE-SETUP.md`

**For quick reference**, read: `docs/SUPABASE-QUICK-REFERENCE.md`

**You've got this!** 🚀
