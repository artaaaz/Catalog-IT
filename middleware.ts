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

  // 1. Protect Admin Routes (/admin, /admin/*)
  if (pathname.startsWith('/admin')) {
    if (!sessionUser) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (sessionUser.role !== 'ADMIN') {
      // User is logged in as regular USER -> unauthorized access to Admin
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  }

  // 2. Redirect logged-in users visiting /login
  if (pathname === '/login') {
    if (sessionUser) {
      if (sessionUser.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
