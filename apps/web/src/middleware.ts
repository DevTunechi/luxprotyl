import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED = ['/dashboard', '/properties', '/tenants', '/payments', '/leases']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED.some(p => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const hasSession = request.cookies.getAll().some(c =>
    c.name.includes('auth-token') || c.name.startsWith('sb-')
  )

  if (!hasSession) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
