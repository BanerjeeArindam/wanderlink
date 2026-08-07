import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isComingSoonEnabled } from './lib/coming-soon';

export function middleware(request: NextRequest) {
  if (!isComingSoonEnabled()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api')) {
    return NextResponse.json(
      { error: 'WanderLink is coming soon. Please check back later.' },
      { status: 503 }
    );
  }

  if (pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.svg|.*\\..*).*)'],
};
