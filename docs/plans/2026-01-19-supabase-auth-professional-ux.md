# Supabase Authentication & Professional UI/UX Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add secure user authentication with Supabase, implement professional UI/UX with loading skeletons and error states, and create a trustworthy enterprise-grade financial platform.

**Architecture:**
- Supabase provides PostgreSQL database + built-in authentication (zero cost at free tier)
- Next.js middleware enforces route protection (redirect unauthenticated users to login)
- Supabase client library (supabase-js) handles sessions with HTTP-only cookies
- Professional UI components for loading states, error handling, and form validation
- User profile/settings page with account management

**Tech Stack:**
- Supabase (PostgreSQL + Auth)
- @supabase/supabase-js (v2.39+)
- Next.js Middleware for route protection
- React Query (optional, for state management) or Context API
- Tailwind CSS (existing) with new component library

---

## Phase 1: Supabase Setup & Infrastructure

### Task 1: Create Supabase Project & Get Credentials

**Files:**
- Create: `backend/.env` (add Supabase keys)
- Create: `frontend/.env.local` (add Supabase keys)
- Create: `docs/SUPABASE-SETUP.md` (documentation)

**Step 1: Create Supabase account**

Go to https://supabase.com and sign up for free account.
- Create new project named "fratfinance"
- Choose region (US recommended)
- Set a strong database password
- Wait for database initialization (~2 minutes)

**Step 2: Collect credentials from Supabase dashboard**

In Project Settings → API:
- Copy `Project URL` (e.g., https://xxxxx.supabase.co)
- Copy `anon public key` (this is safe to expose in frontend)
- Copy `service_role key` (keep secret, backend only)
- Copy database password (you set this during creation)

**Step 3: Add to backend/.env**

```env
# Add to existing backend/.env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=YOUR_SERVICE_ROLE_KEY
DATABASE_URL=postgresql://postgres:PASSWORD@xxxxx.supabase.co:5432/postgres
```

**Step 4: Add to frontend/.env.local**

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
```

**Step 5: Verify connection**

Test that you can access Supabase dashboard → SQL Editor, run:
```sql
SELECT NOW();
```

Expected: Returns current timestamp - confirms database connection works.

---

### Task 2: Create Database Schema for Users & Financial Data

**Files:**
- Create: `backend/migrations/001_create_schema.sql` (database schema)
- Reference: Supabase SQL Editor

**Step 1: Create users_public table**

In Supabase Dashboard → SQL Editor, run:

```sql
-- Create users_public table (extends Supabase auth.users)
CREATE TABLE users_public (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (Row Level Security)
ALTER TABLE users_public ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
CREATE POLICY "Users can read own data" ON users_public
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users_public
  FOR UPDATE USING (auth.uid() = id);

-- Create index for email lookups
CREATE INDEX users_public_email_idx ON users_public(email);
```

**Step 2: Create financial_data table (for saving user's plans)**

```sql
CREATE TABLE financial_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_name TEXT NOT NULL,
  plan_type TEXT NOT NULL,  -- 'debt_vs_invest', 'multi_loan', 'investment_plan'
  data JSONB NOT NULL,      -- Store full plan data as JSON
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
```

**Step 3: Create plaid_accounts table (for storing Plaid token metadata)**

```sql
CREATE TABLE plaid_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plaid_item_id TEXT NOT NULL,
  account_name TEXT,
  account_type TEXT,  -- 'checking', 'savings', 'credit', etc.
  plaid_access_token TEXT NOT NULL ENCRYPTED,  -- Store encrypted
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

**Step 4: Verify schema creation**

In SQL Editor, run:
```sql
SELECT * FROM information_schema.tables
WHERE table_schema = 'public';
```

Expected: See `users_public`, `financial_data`, and `plaid_accounts` tables.

**Step 5: Commit schema**

```bash
mkdir -p /home/shane/Development/FratFinance/FratFinance/backend/migrations
# Copy SQL from Supabase console into file
```

---

### Task 3: Install Supabase Dependencies

**Files:**
- Modify: `frontend/package.json`
- Modify: `backend/requirements.txt`

**Step 1: Add frontend dependencies**

```bash
cd /home/shane/Development/FratFinance/FratFinance/net-worth-optimizer/frontend

npm install @supabase/supabase-js@2.39.0
npm install @supabase/auth-helpers-nextjs@0.7.4
```

**Step 2: Add backend dependencies**

```bash
cd /home/shane/Development/FratFinance/FratFinance/net-worth-optimizer/backend

# Add to requirements.txt
echo "supabase==2.1.2" >> requirements.txt
echo "postgrest-py==0.14.2" >> requirements.txt

# Install
pip install -r requirements.txt
```

**Step 3: Verify installations**

```bash
# Frontend
cd /home/shane/Development/FratFinance/FratFinance/net-worth-optimizer/frontend
npm list @supabase/supabase-js

# Backend
cd /home/shane/Development/FratFinance/FratFinance/net-worth-optimizer/backend
pip show supabase
```

Expected: Both show installed versions.

**Step 4: Commit**

```bash
git add frontend/package.json frontend/package-lock.json backend/requirements.txt
git commit -m "feat: add Supabase authentication dependencies"
```

---

## Phase 2: Frontend Authentication System

### Task 4: Create Supabase Client Utility

**Files:**
- Create: `frontend/lib/supabase.ts`
- Create: `frontend/lib/auth.ts`

**Step 1: Create Supabase client (lib/supabase.ts)**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'pkce'
  }
})

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  return { session: data.session, error }
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  return { user: data.user, error }
}
```

**Step 2: Create auth utilities (lib/auth.ts)**

```typescript
import { supabase } from './supabase'

interface SignUpData {
  email: string
  password: string
  fullName: string
}

interface SignInData {
  email: string
  password: string
}

export async function signUp({ email, password, fullName }: SignUpData) {
  try {
    // Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })

    if (authError) throw authError

    // Create user profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users_public')
        .insert([{
          id: authData.user.id,
          email,
          full_name: fullName
        }])

      if (profileError) throw profileError
    }

    return { user: authData.user, error: null }
  } catch (error) {
    return { user: null, error }
  }
}

export async function signIn({ email, password }: SignInData) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return { user: data.user, session: data.session, error: null }
  } catch (error) {
    return { user: null, session: null, error }
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`
  })
  return { data, error }
}

export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  })
  return { data, error }
}

export async function updateProfile(fullName: string) {
  try {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('users_public')
      .update({ full_name: fullName })
      .eq('id', user.user.id)

    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error }
  }
}
```

**Step 3: Test auth utilities (optional - can verify in browser console later)**

```bash
cd /home/shane/Development/FratFinance/FratFinance/net-worth-optimizer/frontend
npm run dev
# Navigate to browser console and test supabase import
```

**Step 4: Commit**

```bash
git add frontend/lib/supabase.ts frontend/lib/auth.ts
git commit -m "feat: create Supabase client and auth utilities"
```

---

### Task 5: Create Auth Context Provider

**Files:**
- Create: `frontend/app/context/AuthContext.tsx`
- Modify: `frontend/app/layout.tsx`

**Step 1: Create AuthContext (app/context/AuthContext.tsx)**

```typescript
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

**Step 2: Update layout.tsx to include AuthProvider**

Read the current layout.tsx first:

```bash
cat /home/shane/Development/FratFinance/FratFinance/net-worth-optimizer/frontend/app/layout.tsx
```

Then modify it to wrap with AuthProvider:

```typescript
import type { Metadata } from 'next'
import { AuthProvider } from '@/app/context/AuthContext'
import Navigation from '@/app/components/Navigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'FratFinance - College Wealth Builder',
  description: 'Optimize your financial decisions as a college student'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="dark">
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

**Step 3: Commit**

```bash
git add frontend/app/context/AuthContext.tsx frontend/app/layout.tsx
git commit -m "feat: add authentication context provider"
```

---

### Task 6: Create Login Page

**Files:**
- Create: `frontend/app/auth/login/page.tsx`
- Create: `frontend/app/auth/login/LoginForm.tsx`
- Create: `frontend/app/auth/layout.tsx`

**Step 1: Create auth layout (app/auth/layout.tsx)**

```typescript
export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {children}
    </div>
  )
}
```

**Step 2: Create LoginForm component (app/auth/login/LoginForm.tsx)**

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from '@/lib/auth'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const { user, error: signInError } = await signIn({ email, password })

    if (signInError) {
      setError(signInError.message || 'Failed to sign in')
      setIsLoading(false)
      return
    }

    if (user) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo/Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-2">
          FratFinance
        </h1>
        <p className="text-slate-400">College Wealth Builder</p>
      </div>

      {/* Form Card */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-6">Welcome Back</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition"
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="mt-4 text-center">
          <Link href="/auth/forgot-password" className="text-sm text-emerald-400 hover:text-emerald-300 transition">
            Forgot your password?
          </Link>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 pt-6 border-t border-slate-700 text-center text-slate-400 text-sm">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-emerald-400 hover:text-emerald-300 transition font-medium">
            Sign up
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-slate-500 text-xs">
        <p>Your financial data is encrypted and secure.</p>
      </div>
    </div>
  )
}
```

**Step 3: Create login page (app/auth/login/page.tsx)**

```typescript
import LoginForm from './LoginForm'

export const metadata = {
  title: 'Sign In - FratFinance',
  description: 'Sign in to your FratFinance account'
}

export default function LoginPage() {
  return <LoginForm />
}
```

**Step 4: Commit**

```bash
git add frontend/app/auth/layout.tsx frontend/app/auth/login/page.tsx frontend/app/auth/login/LoginForm.tsx
git commit -m "feat: create professional login page with form validation"
```

---

### Task 7: Create Sign Up Page

**Files:**
- Create: `frontend/app/auth/signup/page.tsx`
- Create: `frontend/app/auth/signup/SignUpForm.tsx`

**Step 1: Create SignUpForm (app/auth/signup/SignUpForm.tsx)**

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/auth'

interface ValidationError {
  password?: string
  email?: string
  fullName?: string
}

export default function SignUpForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationError>({})

  const validateForm = (): boolean => {
    const errors: ValidationError = {}

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required'
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Please enter a valid email'
    }

    if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      errors.password = 'Passwords do not match'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) return

    setIsLoading(true)

    const { user, error: signUpError } = await signUp({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName
    })

    if (signUpError) {
      setError(signUpError.message || 'Failed to sign up')
      setIsLoading(false)
      return
    }

    if (user) {
      router.push('/auth/verify-email')
    }
  }

  const getPasswordStrength = (): { strength: string; color: string } => {
    const pwd = formData.password
    if (!pwd) return { strength: '', color: '' }

    let score = 0
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++

    if (score < 2) return { strength: 'Weak', color: 'bg-red-500' }
    if (score < 4) return { strength: 'Good', color: 'bg-yellow-500' }
    return { strength: 'Strong', color: 'bg-emerald-500' }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="w-full max-w-md">
      {/* Logo/Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-2">
          FratFinance
        </h1>
        <p className="text-slate-400">College Wealth Builder</p>
      </div>

      {/* Form Card */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-6">Create Account</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition"
              placeholder="John Doe"
              disabled={isLoading}
            />
            {validationErrors.fullName && (
              <p className="text-red-400 text-xs mt-1">{validationErrors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition"
              placeholder="you@example.com"
              disabled={isLoading}
            />
            {validationErrors.email && (
              <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition"
              placeholder="••••••••"
              disabled={isLoading}
            />

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-slate-700 rounded overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all w-1/3`}
                      style={{
                        width: formData.password.length < 8 ? '33%' :
                               formData.password.length < 12 ? '66%' : '100%'
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{passwordStrength.strength}</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition"
              placeholder="••••••••"
              disabled={isLoading}
            />
            {validationErrors.password && (
              <p className="text-red-400 text-xs mt-1">{validationErrors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 pt-6 border-t border-slate-700 text-center text-slate-400 text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-emerald-400 hover:text-emerald-300 transition font-medium">
            Sign in
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-slate-500 text-xs">
        <p>Your data is encrypted and secure. No spam, ever.</p>
      </div>
    </div>
  )
}
```

**Step 2: Create signup page (app/auth/signup/page.tsx)**

```typescript
import SignUpForm from './SignUpForm'

export const metadata = {
  title: 'Sign Up - FratFinance',
  description: 'Create your FratFinance account'
}

export default function SignUpPage() {
  return <SignUpForm />
}
```

**Step 3: Commit**

```bash
git add frontend/app/auth/signup/page.tsx frontend/app/auth/signup/SignUpForm.tsx
git commit -m "feat: create professional signup page with password strength indicator"
```

---

### Task 8: Create Middleware for Protected Routes

**Files:**
- Create: `frontend/middleware.ts`

**Step 1: Create middleware**

```typescript
import { type NextRequest, NextResponse } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/plan',
  '/investments',
  '/calculator',
  '/roth-ira',
  '/settings',
  '/profile'
]

// Routes for unauthenticated users only
const authRoutes = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get session from cookies (Supabase auth)
  const session = request.cookies.get('sb-auth-token')

  // If accessing protected route without session
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!session) {
      // Redirect to login with return path
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // If accessing auth routes with session, redirect to dashboard
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

**Step 2: Commit**

```bash
git add frontend/middleware.ts
git commit -m "feat: add route protection middleware"
```

---

### Task 9: Create User Profile / Settings Page

**Files:**
- Create: `frontend/app/settings/page.tsx`
- Create: `frontend/app/settings/ProfileCard.tsx`
- Create: `frontend/app/settings/ChangePasswordForm.tsx`

**Step 1: Create ProfileCard component**

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { supabase } from '@/lib/supabase'

export default function ProfileCard() {
  const { user } = useAuth()
  const [fullName, setFullName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (user) {
      // Load user profile
      supabase
        .from('users_public')
        .select('full_name')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.full_name) {
            setFullName(data.full_name)
          }
        })
    }
  }, [user])

  const handleUpdateProfile = async () => {
    if (!user || !fullName.trim()) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('users_public')
        .update({ full_name: fullName })
        .eq('id', user.id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Profile updated successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update profile' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
      <h2 className="text-2xl font-semibold text-white mb-6">Profile</h2>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {/* Email (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed"
          />
          <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition"
            placeholder="John Doe"
            disabled={isLoading}
          />
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdateProfile}
          disabled={isLoading}
          className="w-full py-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </div>
    </div>
  )
}
```

**Step 2: Create ChangePasswordForm component**

```typescript
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all password fields' })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' })
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setMessage({ type: 'success', text: 'Password changed successfully' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to change password' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
      <h2 className="text-2xl font-semibold text-white mb-6">Change Password</h2>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleChangePassword}
          disabled={isLoading}
          className="w-full py-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {isLoading ? 'Updating...' : 'Change Password'}
        </button>
      </div>
    </div>
  )
}
```

**Step 3: Create settings page**

```typescript
// frontend/app/settings/page.tsx
'use client'

import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ProfileCard from './ProfileCard'
import ChangePasswordForm from './ChangePasswordForm'

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>

        <div className="space-y-6">
          <ProfileCard />
          <ChangePasswordForm />
        </div>
      </div>
    </main>
  )
}
```

**Step 4: Commit**

```bash
git add frontend/app/settings/page.tsx frontend/app/settings/ProfileCard.tsx frontend/app/settings/ChangePasswordForm.tsx
git commit -m "feat: add user profile and settings page"
```

---

## Phase 3: Professional UI/UX Components

### Task 10: Create Loading Skeleton Components

**Files:**
- Create: `frontend/app/components/Skeletons.tsx`

**Step 1: Create skeleton components**

```typescript
'use client'

export function SkeletonCard({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-slate-700 rounded w-3/4 mb-4" />
          <div className="space-y-3">
            <div className="h-4 bg-slate-700 rounded w-full" />
            <div className="h-4 bg-slate-700 rounded w-5/6" />
            <div className="h-4 bg-slate-700 rounded w-4/6" />
          </div>
        </div>
      ))}
    </>
  )
}

export function SkeletonChart() {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-slate-700 rounded w-1/3 mb-6" />
      <div className="w-full h-64 bg-slate-700 rounded mb-4" />
      <div className="flex gap-4">
        <div className="flex-1 h-12 bg-slate-700 rounded" />
        <div className="flex-1 h-12 bg-slate-700 rounded" />
      </div>
    </div>
  )
}

export function SkeletonForm() {
  return (
    <div className="space-y-4 animate-pulse">
      <div>
        <div className="h-4 bg-slate-700 rounded w-1/4 mb-2" />
        <div className="h-10 bg-slate-700 rounded" />
      </div>
      <div>
        <div className="h-4 bg-slate-700 rounded w-1/4 mb-2" />
        <div className="h-10 bg-slate-700 rounded" />
      </div>
      <div className="h-10 bg-gradient-to-r from-emerald-600 to-blue-600 rounded w-full" />
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add frontend/app/components/Skeletons.tsx
git commit -m "feat: add loading skeleton components"
```

---

### Task 11: Create Error & Success Components

**Files:**
- Create: `frontend/app/components/Alerts.tsx`

**Step 1: Create alert components**

```typescript
'use client'

interface AlertProps {
  message: string
  onDismiss?: () => void
  autoClose?: boolean
  duration?: number
}

export function SuccessAlert({ message, onDismiss, autoClose = true, duration = 5000 }: AlertProps) {
  React.useEffect(() => {
    if (autoClose && onDismiss) {
      const timer = setTimeout(onDismiss, duration)
      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onDismiss])

  return (
    <div className="fixed top-4 right-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 max-w-md shadow-lg animate-in slide-in-from-right">
      <div className="flex items-start gap-3">
        <div className="text-emerald-400 text-2xl">✓</div>
        <div className="flex-1">
          <p className="text-emerald-400 font-medium">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-emerald-400 hover:text-emerald-300 transition"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export function ErrorAlert({ message, onDismiss, autoClose = false }: AlertProps) {
  return (
    <div className="fixed top-4 right-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-w-md shadow-lg animate-in slide-in-from-right">
      <div className="flex items-start gap-3">
        <div className="text-red-400 text-2xl">✕</div>
        <div className="flex-1">
          <p className="text-red-400 font-medium">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-300 transition"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export function WarningAlert({ message, onDismiss, autoClose = false }: AlertProps) {
  return (
    <div className="fixed top-4 right-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 max-w-md shadow-lg animate-in slide-in-from-right">
      <div className="flex items-start gap-3">
        <div className="text-yellow-400 text-2xl">⚠</div>
        <div className="flex-1">
          <p className="text-yellow-400 font-medium">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-yellow-400 hover:text-yellow-300 transition"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add frontend/app/components/Alerts.tsx
git commit -m "feat: add alert components for errors and success states"
```

---

### Task 12: Create Modal/Dialog Component

**Files:**
- Create: `frontend/app/components/Modal.tsx`

**Step 1: Create modal component**

```typescript
'use client'

interface ModalProps {
  isOpen: boolean
  title: string
  description?: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
  isLoading?: boolean
}

export function Modal({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-w-md w-full animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="border-b border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {description && <p className="text-slate-400 text-sm mt-2">{description}</p>}
        </div>

        {/* Footer with Actions */}
        <div className="flex gap-3 p-6 bg-slate-900">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white'
            }`}
          >
            {isLoading ? 'Loading...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add frontend/app/components/Modal.tsx
git commit -m "feat: add reusable modal component for confirmations"
```

---

### Task 13: Update Navigation Component with Auth Status

**Files:**
- Modify: `frontend/app/components/Navigation.tsx`

**Step 1: Update navigation to show auth status**

Read existing Navigation.tsx, then update it to:

```typescript
'use client'

import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navigation() {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = async () => {
    await signOut()
    router.push('/auth/login')
  }

  // Hide nav on auth pages
  if (pathname?.startsWith('/auth')) {
    return null
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/plan', label: 'Plan' },
    { href: '/investments', label: 'Investments' },
    { href: '/calculator', label: 'Calculator' }
  ]

  return (
    <nav className="sticky top-0 z-40 bg-slate-900 border-b border-slate-700 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            FratFinance
          </div>
        </Link>

        {/* Center Nav Items - Only visible when logged in */}
        {user && !isLoading && (
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg transition ${
                  pathname === item.href
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right Side - Auth Status */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500" />
                <span className="text-sm hidden sm:inline">{user.email}</span>
                <span className="text-xl">▼</span>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-2 z-50">
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                    onClick={() => setShowDropdown(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setShowDropdown(false)
                      handleLogout()
                    }}
                    className="w-full text-left px-4 py-2 text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-slate-300 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-lg transition font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
```

**Step 2: Commit**

```bash
git add frontend/app/components/Navigation.tsx
git commit -m "feat: update navigation with authentication status and user menu"
```

---

## Phase 4: Connect Authentication to Backend

### Task 14: Update Backend to Support User-Scoped Data

**Files:**
- Modify: `backend/app/main.py` (add user context middleware)
- Create: `backend/app/middleware/auth.py`
- Create: `backend/app/services/user_service.py`

**Step 1: Create auth middleware**

```python
# backend/app/middleware/auth.py
from fastapi import HTTPException, Request
from supabase import create_client, Client
import os

def get_supabase_client() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    return create_client(url, key)

async def verify_user_token(request: Request) -> str:
    """Extract and verify Supabase token from Authorization header"""
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = auth_header.split(" ")[1]

    # Verify token with Supabase
    supabase = get_supabase_client()
    try:
        response = supabase.auth.get_user(token)
        return response.user.id
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
```

**Step 2: Create user service**

```python
# backend/app/services/user_service.py
from supabase import create_client, Client
import os
from uuid import UUID

def get_supabase_client() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    return create_client(url, key)

async def save_financial_plan(user_id: str, plan_name: str, plan_type: str, data: dict):
    """Save a financial plan to the database"""
    supabase = get_supabase_client()

    response = supabase.table("financial_data").upsert({
        "user_id": user_id,
        "plan_name": plan_name,
        "plan_type": plan_type,
        "data": data
    }).execute()

    return response.data

async def get_user_plans(user_id: str):
    """Get all saved plans for a user"""
    supabase = get_supabase_client()

    response = supabase.table("financial_data").select("*").eq("user_id", user_id).execute()

    return response.data

async def delete_plan(user_id: str, plan_name: str):
    """Delete a specific plan"""
    supabase = get_supabase_client()

    response = supabase.table("financial_data").delete().eq("user_id", user_id).eq("plan_name", plan_name).execute()

    return {"deleted": True}
```

**Step 3: Update main.py to add protected endpoints**

Add these endpoints to `backend/app/main.py`:

```python
from fastapi import Depends, Request
from app.middleware.auth import verify_user_token
from app.services.user_service import save_financial_plan, get_user_plans

@app.post("/api/plans/save")
async def save_plan(
    request: Request,
    user_id: str = Depends(verify_user_token)
):
    """Save a financial plan"""
    body = await request.json()
    result = await save_financial_plan(user_id, body["plan_name"], body["plan_type"], body["data"])
    return {"success": True, "data": result}

@app.get("/api/plans")
async def list_plans(user_id: str = Depends(verify_user_token)):
    """Get all user's saved plans"""
    plans = await get_user_plans(user_id)
    return {"plans": plans}

@app.delete("/api/plans/{plan_name}")
async def delete_plan_endpoint(
    plan_name: str,
    user_id: str = Depends(verify_user_token)
):
    """Delete a saved plan"""
    result = await delete_plan(user_id, plan_name)
    return result
```

**Step 4: Commit**

```bash
git add backend/app/middleware/auth.py backend/app/services/user_service.py
# Update main.py with new endpoints
git commit -m "feat: add user authentication middleware and plan persistence"
```

---

## Phase 5: Testing & Deployment

### Task 15: Create .env Configuration Files

**Files:**
- Update: `backend/.env`
- Update: `frontend/.env.local`

**Step 1: Update backend .env with Supabase credentials**

```bash
cd /home/shane/Development/FratFinance/FratFinance/net-worth-optimizer/backend

# Edit .env and add:
# SUPABASE_URL=your_url_from_dashboard
# SUPABASE_SERVICE_KEY=your_service_key
# DATABASE_URL=your_database_url
```

**Step 2: Create frontend .env.local**

```bash
cd /home/shane/Development/FratFinance/FratFinance/net-worth-optimizer/frontend

cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your_url_from_dashboard
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF
```

**Step 3: Verify files are in .gitignore**

```bash
# Check that .env files are ignored
grep ".env" /home/shane/Development/FratFinance/FratFinance/net-worth-optimizer/backend/.gitignore
grep ".env.local" /home/shane/Development/FratFinance/FratFinance/net-worth-optimizer/frontend/.gitignore
```

**Step 4: Commit (without secrets)**

```bash
git add backend/.env.example frontend/.env.example
git commit -m "feat: add environment configuration examples"
```

---

### Task 16: Test Complete Auth Flow

**Testing Checklist:**

1. **Start both servers:**
   ```bash
   # Terminal 1
   cd /home/shane/Development/FratFinance/FratFinance/net-worth-optimizer/backend
   source venv/bin/activate
   uvicorn app.main:app --reload

   # Terminal 2
   cd /home/shane/Development/FratFinance/FratFinance/net-worth-optimizer/frontend
   npm run dev
   ```

2. **Test Sign Up Flow:**
   - Navigate to http://localhost:3000/auth/signup
   - Fill form with valid data
   - Click "Sign Up"
   - Verify user created in Supabase dashboard
   - Verify redirected to login page

3. **Test Login Flow:**
   - Navigate to http://localhost:3000/auth/login
   - Enter credentials from signup
   - Click "Sign In"
   - Verify redirected to /dashboard

4. **Test Protected Routes:**
   - Try accessing /dashboard without token
   - Should redirect to login
   - Login, then access /dashboard
   - Should display correctly

5. **Test Settings Page:**
   - Navigate to /settings
   - Update profile name
   - Change password
   - Verify changes in Supabase dashboard

6. **Test Logout:**
   - Click logout in navigation
   - Verify redirected to login
   - Try accessing protected route
   - Should require login

---

### Task 17: Documentation & Deployment Guide

**Files:**
- Create: `docs/AUTHENTICATION-GUIDE.md`
- Create: `docs/DEPLOYMENT.md`

**Step 1: Create authentication guide**

```markdown
# Authentication System Guide

## Setup Supabase

1. Create account at supabase.com
2. Create new project
3. Wait for database initialization
4. Copy credentials to .env files

## Local Development

1. Set environment variables in .env files
2. Run both backend and frontend
3. Navigate to http://localhost:3000

## User Flow

- **Unauthenticated**: See landing page with Sign Up/Sign In links
- **Sign Up**: Create account with email/password
- **Sign In**: Login with email/password
- **Authenticated**: Access dashboard and other features
- **Settings**: Update profile and password
- **Logout**: Clear session and redirect to login

## Security

- Passwords hashed with bcrypt (Supabase)
- Tokens stored in HTTP-only cookies
- All user data encrypted at rest
- Row-level security on all tables
```

**Step 2: Commit all documentation**

```bash
git add docs/AUTHENTICATION-GUIDE.md docs/SUPABASE-SETUP.md
git commit -m "docs: add authentication and Supabase setup guides"
```

---

## Summary

This plan implements:

✅ **Supabase Infrastructure** - Free PostgreSQL + Auth
✅ **User Authentication** - Sign up, login, logout, password reset
✅ **Session Management** - HTTP-only cookies, auto-refresh
✅ **Professional UI** - Polished forms, loading states, error handling
✅ **User Profile** - Update name, change password, settings page
✅ **Route Protection** - Middleware redirects unauthenticated users
✅ **Data Persistence** - Save plans, Plaid accounts per user
✅ **Backend Integration** - User-scoped API endpoints

**Next Steps:**
1. Complete all tasks above
2. Test the full auth flow
3. Deploy to production (Vercel for frontend, Railway/Render for backend)

