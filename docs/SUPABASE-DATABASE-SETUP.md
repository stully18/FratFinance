# Supabase Database Setup & Verification

This guide walks you through setting up the Supabase database schema and verifying it's correct.

## What You Need Before Starting

- Supabase account and project created
- Project URL and API keys from Supabase dashboard
- The SQL migration file: `/backend/migrations/001_create_schema.sql`

---

## Step 1: Access Supabase SQL Editor

1. Go to https://app.supabase.com
2. Sign in with your account
3. Select your **FratFinance** project from the list
4. On the left sidebar, click **SQL Editor**
5. You should see an empty editor with a blue **NEW QUERY** button

---

## Step 2: Create the Database Schema

You have two options:

### Option A: Copy-Paste the Migration (Recommended for testing)

1. In the SQL Editor, click the **+** button or **NEW QUERY**
2. Open this file in a text editor: `/backend/migrations/001_create_schema.sql`
3. Copy the entire contents
4. Paste into the SQL Editor
5. Click the blue **RUN** button in the top right
6. Wait 5-10 seconds for execution to complete

### Option B: Run SQL from CLI (If familiar with command line)

```bash
# First, get your Supabase connection string
# From dashboard: Settings → Database → Connection String → psql
# Copy the entire connection string

psql "postgresql://postgres:PASSWORD@host.supabase.co:5432/postgres" < /backend/migrations/001_create_schema.sql
```

---

## Step 3: Verify Tables Were Created

Run this query in the SQL Editor to check:

```sql
SELECT table_name, table_schema
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected result:** You should see these tables:
- `financial_data`
- `plaid_accounts`
- `users_public`

(Plus some internal Supabase tables starting with `_`)

If you don't see these three, something went wrong. Check:
- Did the SQL run without errors? (Look for red error messages)
- Did you click RUN?
- Is the entire migration file pasted?

---

## Step 4: Verify Table Structures

Check that each table has the right columns.

### Check users_public table

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users_public'
ORDER BY ordinal_position;
```

**Expected columns:**
- `id` (uuid) - PRIMARY KEY
- `email` (text) - NOT NULL, UNIQUE
- `full_name` (text) - nullable
- `avatar_url` (text) - nullable
- `created_at` (timestamp with timezone) - NOT NULL
- `updated_at` (timestamp with timezone) - NOT NULL

### Check financial_data table

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'financial_data'
ORDER BY ordinal_position;
```

**Expected columns:**
- `id` (uuid) - PRIMARY KEY
- `user_id` (uuid) - NOT NULL (references auth.users)
- `plan_name` (text) - NOT NULL
- `plan_type` (text) - NOT NULL
- `data` (jsonb) - NOT NULL
- `created_at` (timestamp with timezone) - NOT NULL
- `updated_at` (timestamp with timezone) - NOT NULL

### Check plaid_accounts table

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'plaid_accounts'
ORDER BY ordinal_position;
```

**Expected columns:**
- `id` (uuid) - PRIMARY KEY
- `user_id` (uuid) - NOT NULL (references auth.users)
- `plaid_item_id` (text) - NOT NULL
- `account_name` (text) - nullable
- `account_type` (text) - nullable
- `plaid_access_token` (text) - NOT NULL, encrypted
- `created_at` (timestamp with timezone) - NOT NULL

---

## Step 5: Verify Row Level Security (RLS)

Run this query to check RLS is enabled:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users_public', 'financial_data', 'plaid_accounts');
```

**Expected result:** All three tables should have `rowsecurity = true`

If any show `false`, RLS wasn't enabled. This is critical for security! You can enable it:

```sql
ALTER TABLE users_public ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaid_accounts ENABLE ROW LEVEL SECURITY;
```

---

## Step 6: Verify RLS Policies

Check that the security policies exist:

```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('users_public', 'financial_data', 'plaid_accounts')
ORDER BY tablename, policyname;
```

**Expected policies:**

For `users_public`:
- `Users can read own data`
- `Users can update own data`

For `financial_data`:
- `Users can create own financial data`
- `Users can delete own financial data`
- `Users can read own financial data`
- `Users can update own financial data`

For `plaid_accounts`:
- `Users can create own Plaid accounts`
- `Users can delete own Plaid accounts`
- `Users can read own Plaid accounts`

If you don't see all these policies, you might need to run the schema creation again.

---

## Step 7: Verify Indexes

Indexes speed up database queries. Check they exist:

```sql
SELECT indexname, tablename
FROM pg_indexes
WHERE tablename IN ('users_public', 'financial_data', 'plaid_accounts')
ORDER BY tablename;
```

**Expected indexes:**
- `users_public_email_idx` on `users_public` (email lookup optimization)
- `financial_data_user_id_idx` on `financial_data` (find user's plans quickly)
- `plaid_accounts_user_id_idx` on `plaid_accounts` (find user's connections quickly)

---

## Step 8: Check Foreign Key Constraints

Verify tables are linked correctly:

```sql
SELECT constraint_name, table_name, column_name
FROM information_schema.key_column_usage
WHERE table_name IN ('users_public', 'financial_data', 'plaid_accounts')
  AND referenced_table_name IS NOT NULL
ORDER BY table_name;
```

**Expected relationships:**
- `financial_data.user_id` → `auth.users.id`
- `plaid_accounts.user_id` → `auth.users.id`

---

## Step 9: Test the Schema Works

Try inserting test data (this will fail due to RLS, which is correct):

```sql
-- This will FAIL (correct behavior - RLS prevents it)
-- Only authenticated users can insert into these tables
INSERT INTO users_public (id, email, full_name)
VALUES ('00000000-0000-0000-0000-000000000000', 'test@example.com', 'Test User');
```

**Expected result:** Error about RLS policy (this is correct!)

This proves RLS is working - even through the SQL editor, you can't bypass security.

---

## Step 10: Verify Table Dependencies

Check that `users_public` references Supabase's `auth.users` table:

```sql
SELECT constraint_name, table_name, column_name, referenced_table_name
FROM information_schema.referential_constraints
WHERE table_name IN ('users_public', 'financial_data', 'plaid_accounts');
```

This shows the relationships between tables.

---

## Full Database Verification Checklist

Use this checklist after running the schema:

```
TABLES
☐ users_public exists
☐ financial_data exists
☐ plaid_accounts exists

COLUMNS
☐ users_public has: id, email, full_name, avatar_url, created_at, updated_at
☐ financial_data has: id, user_id, plan_name, plan_type, data, created_at, updated_at
☐ plaid_accounts has: id, user_id, plaid_item_id, account_name, account_type, plaid_access_token, created_at

ROW LEVEL SECURITY
☐ users_public has RLS enabled
☐ financial_data has RLS enabled
☐ plaid_accounts has RLS enabled

POLICIES
☐ users_public has 2 policies (read own, update own)
☐ financial_data has 4 policies (read, create, update, delete own)
☐ plaid_accounts has 3 policies (read, create, delete own)

INDEXES
☐ users_public_email_idx exists
☐ financial_data_user_id_idx exists
☐ plaid_accounts_user_id_idx exists

CONSTRAINTS
☐ financial_data.user_id references auth.users(id)
☐ plaid_accounts.user_id references auth.users(id)
```

---

## Troubleshooting

### Schema Creation Failed with Error

**Solution:**
1. Read the error message carefully - it tells you what went wrong
2. Common issues:
   - **Syntax error:** Check you copied the entire migration file
   - **Table already exists:** The schema was partially created. Drop the tables and try again:
     ```sql
     DROP TABLE IF EXISTS plaid_accounts CASCADE;
     DROP TABLE IF EXISTS financial_data CASCADE;
     DROP TABLE IF EXISTS users_public CASCADE;
     ```
   3. Then re-run the schema creation

### RLS is Disabled

**Solution:**
Run this to enable it:

```sql
ALTER TABLE users_public ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaid_accounts ENABLE ROW LEVEL SECURITY;
```

### Can't Find the Auth.users Table

**Solution:**
Supabase creates `auth.users` automatically. It's managed by Supabase and contains all authenticated users. You don't create it yourself. Your tables just reference it.

### Policy Syntax Errors

**Solution:**
Make sure the migration file matches the schema exactly. If you get policy errors:
1. Drop all policies on the table
2. Re-run the migration
3. Don't manually edit policies (let the migration create them)

---

## What This Schema Does

### users_public Table
- Extends Supabase's `auth.users` table with profile info
- Stores user's name and avatar
- RLS ensures users only see/edit their own data

### financial_data Table
- Stores user's financial plans
- Allows multiple plans per user (plan_name is unique per user, not globally)
- Stores plans as JSON (flexible structure)
- RLS ensures users only see their own plans

### plaid_accounts Table
- Stores Plaid bank account connections
- One row per connected bank account
- Securely stores encrypted Plaid access tokens
- RLS ensures users only see their own connections

---

## Next Steps

After verifying the database:

1. **Test the Auth System** - Follow `/docs/QUICK-START-TESTING.md`
2. **Connect Your Frontend** - Make sure `.env.local` has correct Supabase URL and key
3. **Connect Your Backend** - Make sure `.env` has correct service key
4. **Start Testing** - Run the quick start testing guide

---

## Need Help?

- **Supabase Docs:** https://supabase.com/docs
- **Database Reference:** https://supabase.com/docs/guides/database
- **RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security
