import { NextResponse, type NextRequest } from 'next/server'

// Protected routes — redirect to login if no session cookie found
const PROTECTED = ['/dashboard', '/properties', '/tenants', '/payments', '/leases']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if this is a protected route
  const isProtected = PROTECTED.some(p => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  // Supabase stores session in sb-*-auth-token cookie
  // If no cookie exists at all, redirect to login
  const hasSession = request.cookies.getAll().some(c =>
    c.name.includes('auth-token') || c.name.includes('sb-')
  )

  if (!hasSession) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}