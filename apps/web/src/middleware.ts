import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('auth')?.value;

  // If user is logged in and hits /login -> redirect to app
  if (pathname.startsWith('/login')) {
    if (token) {
      const url = req.nextUrl.clone();
      url.pathname = '/customers';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Everything else requires auth
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};
