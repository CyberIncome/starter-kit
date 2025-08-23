// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Serve different robots.txt depending on the hostname.
 *
 *  - Your real domain →  /robots.prod.txt   (allows crawling)
 *  - Any *.vercel.app  →  /robots.vercel.txt (blocks crawling)
 */
export function middleware(request: NextRequest) {
  // Only intercept the robots.txt request
  if (request.nextUrl.pathname !== '/robots.txt') {
    return NextResponse.next();
  }

  const host = request.headers.get('host') || '';
  const isVercel = host.endsWith('.vercel.app');

  // Choose the correct file
  const rewriteTarget = isVercel ? '/robots.vercel.txt' : '/robots.prod.txt';

  // Rewrite keeps the URL shown to the user as /robots.txt
  return NextResponse.rewrite(new URL(rewriteTarget, request.url));
}

/**
 * Limit the middleware to just the /robots.txt route
 * so the rest of your site stays edge-fast.
 */
export const config = {
  matcher: '/robots.txt',
};
