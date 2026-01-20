# 🚀 START HERE: Setting Up Supabase Database

You're trying to set up the database in Supabase. This guide is for you!

## What You Need to Do

You have a SQL file with database commands. You need to put it into Supabase so the database gets set up.

**That's it!** Just 3 steps.

---

## The 3 Steps (5 minutes total)

### Step 1: Open Supabase Dashboard

Go to: https://app.supabase.com

Sign in with your account.

Click your **FratFinance** project from the list.

### Step 2: Open SQL Editor & Paste Your SQL

**In Supabase:**
1. Look at the left sidebar
2. Click **"SQL Editor"**
3. Click the big blue **"+ New Query"** button
4. A text editor appears

**On your computer:**
1. Open this file in any text editor:
   ```
   /backend/migrations/001_create_schema.sql
   ```
2. Select all text (Ctrl+A or Cmd+A)
3. Copy it (Ctrl+C or Cmd+C)

**Back in Supabase:**
1. Click in the big empty editor
2. Paste (Ctrl+V or Cmd+V)

You should see the SQL code appear.

### Step 3: Click RUN

In the top-right corner of the editor, find the blue **"RUN"** button and click it.

Wait 5-10 seconds.

You should see a message saying:
```
✅ Query executed successfully
```

**That's it! You're done! 🎉**

---

## How to Know If It Worked

**You should see one of these:**

### ✅ Success (Correct)
```
✅ Query executed successfully
Execution time: 456 ms
```

### ❌ Error 1: Tables Already Exist (Also OK)
```
ERROR: relation "users_public" already exists
```

This means the tables are already there - that's fine! You don't need to run it again.

### ❌ Error 2: Syntax Error (Try Again)
```
ERROR: syntax error at or near "CREATE"
```

This usually means:
- You didn't copy all the SQL
- There's extra spaces at the beginning
- Try copying and pasting again

---

## Verify It Worked

After the SQL runs, let's check that the tables exist:

**In Supabase SQL Editor, create a new query and run this:**

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('users_public', 'financial_data', 'plaid_accounts');
```

**You should see 3 rows with these table names:**
- users_public
- financial_data
- plaid_accounts

If you see these 3 tables, you're all set! ✅

---

## What If I Can't Find the SQL File?

No problem! Here's the SQL code. Just copy this entire block:

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

Copy that ↑, paste into Supabase SQL Editor, and click RUN.

---

## Troubleshooting

### "I don't see a RUN button"

**Look more carefully.** It's in the **top-right corner** of the SQL editor area. It's blue and says "RUN".

If you still can't find it:
1. Refresh the page (F5)
2. Go back to SQL Editor
3. Create a new query again

### "Nothing happens when I click RUN"

Try these:
1. Click RUN again
2. Make sure you copied some SQL (editor shouldn't be empty)
3. Wait 10 seconds (might be processing)
4. Check if there's a loading spinner

### "The RUN button is greyed out / disabled"

1. Click in the SQL editor area first
2. Make sure there's SQL in the editor (not empty)
3. Then try RUN again

### "I got an error - what do I do?"

Read the error message carefully. Most common:

1. **"relation already exists"** - Tables are already there, that's OK!
2. **"syntax error"** - You probably didn't copy ALL the SQL. Try again with the full code.
3. **"permission denied"** - Make sure you're logged into the right Supabase project
4. **Something else?** - Read `docs/SUPABASE-SQL-EDITOR-GUIDE.md` for more help

---

## Next Steps

After the SQL runs successfully:

1. ✅ **Database is set up!** Your tables are created.

2. **Start testing your authentication:**
   - Follow: `TESTING-START-HERE.md` (in project root)
   - You'll start the backend and frontend servers
   - Test sign up, login, and other features

3. **Celebrate!** You've set up a production-grade database! 🎉

---

## Still Stuck?

Read the detailed guide: `docs/SUPABASE-SQL-EDITOR-GUIDE.md`

It has step-by-step instructions with lots of troubleshooting tips.

---

## Quick Checklist

```
✓ Opened https://app.supabase.com
✓ Clicked my FratFinance project
✓ Clicked SQL Editor
✓ Clicked + New Query
✓ Found the SQL file (or copied from above)
✓ Pasted SQL into the editor
✓ Clicked RUN
✓ Waited for success ✅
✓ Verified tables exist
```

**All done?** Read `TESTING-START-HERE.md` next!

---

## That's All!

You just set up a professional PostgreSQL database with security features.

Not bad! 💪

Next: Start testing your authentication system.

See: `TESTING-START-HERE.md`
