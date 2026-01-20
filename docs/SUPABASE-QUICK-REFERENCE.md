# Supabase Credentials Quick Reference

## Checklist: What You Need to Do

- [ ] Create account at https://supabase.com
- [ ] Create a new project
- [ ] Get 3 credentials from Supabase dashboard
- [ ] Add credentials to backend/.env
- [ ] Add credentials to frontend/.env.local
- [ ] Restart your development servers
- [ ] Done! Authentication is ready

## Where to Find Credentials

**In Supabase Dashboard:**
1. Click on your project name
2. Click **Settings** (gear icon, bottom left)
3. Click **API** in the menu
4. Copy these three things:

```
Project URL:           https://xxxxxxxxxxxxx.supabase.co
Anon Key:              eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (starts with eyJhbGc)
Service Role Key:      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (starts with eyJhbGc, very long)
```

## Where to Put Each Credential

### Backend File: `net-worth-optimizer/backend/.env`

```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Frontend File: `net-worth-optimizer/frontend/.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Critical Details

| Item | Backend | Frontend | Keep Secret? |
|------|---------|----------|--------------|
| URL | `SUPABASE_URL` | `NEXT_PUBLIC_SUPABASE_URL` | No (public) |
| Anon Key | ❌ No | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No (public) |
| Service Role Key | `SUPABASE_SERVICE_ROLE_KEY` | ❌ No | **YES - SECRET** |

## Key Differences Explained

- **URL**: Same for both backend and frontend. It's public information.
- **Anon Key**: Only for frontend. It's limited in what it can access. Safe to put in browser.
- **Service Role Key**: Only for backend. Has full database access. NEVER share or put in frontend.

## File Format Rules

All of these are WRONG:
```env
SUPABASE_URL = https://...  # Space around =
SUPABASE_URL="https://..."  # Quotes around value
SUPABASE_URL='https://...'  # Single quotes
# Comment has credentials
```

This is CORRECT:
```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## After Adding Credentials

1. **Stop your dev server** (press CTRL+C)
2. **Restart it** so it loads the new .env files
3. **Check for errors** - you should NOT see "undefined" errors for Supabase

## If Something's Wrong

| Problem | Solution |
|---------|----------|
| "SUPABASE_URL is undefined" | Restart dev server, check .env.local syntax |
| Backend won't connect | Check Service Role Key is complete, no typos in URL |
| Frontend won't connect | Check Anon Key is complete, uses NEXT_PUBLIC_ prefix |
| "Command not found" errors | Make sure credentials don't have extra spaces or quotes |

## Testing Your Setup

**Backend (Python/Node.js):**
```bash
cd net-worth-optimizer/backend
# No Supabase errors should appear on startup
```

**Frontend (Next.js):**
```bash
cd net-worth-optimizer/frontend
npm run dev
# Open http://localhost:3000
# Check browser console (F12) for Supabase errors
```

If you see no authentication-related errors, you're good to go!

## Need Full Details?

Read the complete guide: `docs/SUPABASE-SETUP.md`
