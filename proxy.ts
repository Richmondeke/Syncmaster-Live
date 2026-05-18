import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request })

  const { pathname } = request.nextUrl

  const isAuthRoute = pathname === '/login' || pathname === '/signup'
  const isDashboardRoute = pathname.startsWith('/dashboard')

  const sessionEmail = request.cookies.get('session_email')?.value

  // Dynamic cookie-based routing
  if (isAuthRoute && sessionEmail) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  if (isDashboardRoute && !sessionEmail) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
