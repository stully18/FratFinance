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
