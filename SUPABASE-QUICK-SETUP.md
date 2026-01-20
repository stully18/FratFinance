# Supabase SQL Setup - 3 Minute Quick Guide

## The 3 Steps

### Step 1: Open SQL Editor

1. Go to https://app.supabase.com
2. Click your **FratFinance** project
3. Click **SQL Editor** (left sidebar)
4. Click **+ New Query** (blue button)

### Step 2: Copy & Paste the SQL

**Option A: Copy from your file** (easiest)

Open this file in any editor:
```
/home/shane/Development/FratFinance/FratFinance/net-worth-optimizer/backend/migrations/001_create_schema.sql
```

Select all (Ctrl+A) → Copy (Ctrl+C)

**Option B: Copy from below**

Copy this entire block (scroll down to see it all):

```sql
-- Create users_public table
CREATE TABLE users_public (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users_public ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data" ON users_public
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users_public
  FOR UPDATE USING (auth.uid() = id);

CREATE INDEX users_public_email_idx ON users_public(email);

-- Create financial_data table
CREATE TABLE financial_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_name TEXT NOT NULL,
  plan_type TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT financial_data_user_id_plan_name UNIQUE(user_id, plan_name)
);

ALTER TABLE financial_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own financial data" ON financial_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own financial data" ON financial_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own financial data" ON financial_data
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own financial data" ON financial_data
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX financial_data_user_id_idx ON financial_data(user_id);

-- Create plaid_accounts table
CREATE TABLE plaid_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plaid_item_id TEXT NOT NULL,
  account_name TEXT,
  account_type TEXT,
  plaid_access_token TEXT NOT NULL ENCRYPTED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT plaid_accounts_user_id_item_id UNIQUE(user_id, plaid_item_id)
);

ALTER TABLE plaid_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own Plaid accounts" ON plaid_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own Plaid accounts" ON plaid_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own Plaid accounts" ON plaid_accounts
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX plaid_accounts_user_id_idx ON plaid_accounts(user_id);
```

Now go back to the Supabase SQL editor and paste it there (Ctrl+V)

### Step 3: Click RUN

In the top right of the SQL editor, click the blue **RUN** button.

Wait 5-10 seconds...

You should see: ✅ **"Query executed successfully"**

---

## Done!

Your database is now set up! The tables are created and ready.

Next: Follow [TESTING-START-HERE.md](TESTING-START-HERE.md) to start testing your auth system.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Nothing happens | Try clicking RUN again |
| Error: "relation already exists" | Tables are already there - that's good! |
| Error: "syntax error" | Make sure you copied ALL the SQL, not just part |
| Can't find RUN button | Look top-right corner of editor area |
| Editor is blank | Refresh page (F5) and start over |

---

## Visual Quick Reference

```
┌─ Supabase Dashboard ─────────────┐
│                                  │
│ Left Sidebar:                    │
│  SQL Editor  ← Click Here        │
│                                  │
├─ SQL Editor ─────────────────────┤
│                                  │
│ + New Query  ← Click Here        │
│                                  │
│ [Empty editor area]              │
│ Paste SQL here ↓                 │
│                                  │
│ CREATE TABLE users_public (      │
│   ...your SQL...                 │
│ )                                │
│                                  │
│                        [RUN] ← Click
│                                  │
└──────────────────────────────────┘
```

That's it! You're done with database setup.

See [docs/SUPABASE-SQL-EDITOR-GUIDE.md](docs/SUPABASE-SQL-EDITOR-GUIDE.md) for detailed step-by-step with screenshots.
