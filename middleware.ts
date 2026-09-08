import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'nr_session';
const DEFAULT_SECRET = 'nr-it-catalog-nusantara-regas-enterprise-auth-secret-key-2026';
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || DEFAULT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let sessionUser: { userId: string; name: string; email: string; role: string } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET, {
        algorithms: ['HS256'],
      });
      sessionUser = payload as any;
    } catch (err) {
      sessionUser = null;
    }
  }

  const isPublicRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.startsWith('/register/') ||
    pathname === '/unauthorized';

  // 1. If unauthenticated and NOT on a public route -> redirect to /login
  if (!sessionUser) {
    if (!isPublicRoute) {
      const loginUrl = new URL('/login', request.url);
      if (pathname !== '/') {
        loginUrl.searchParams.set('callbackUrl', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. If authenticated user visits /login or /register -> redirect to appropriate home
  if (pathname === '/login' || pathname === '/register' || pathname === '/register/pending') {
    if (sessionUser.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. If authenticated user tries to access /admin/* but is not ADMIN -> redirect to /unauthorized
  if (pathname.startsWith('/admin')) {
    if (sessionUser.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - images (public images)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
};

