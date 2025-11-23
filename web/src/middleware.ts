// web/middleware.ts
// -----------------------------------------------------------------------------
// PURPOSE:
// Global middleware for Next.js (v13/v14+). Handles auth redirects and route protection.
// ----------------------------------------------------------------------------- 

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Read auth token from cookies
  const token = request.cookies.get('Nexion-token')?.value;

  // Protected routes (require login)
  const protectedRoutes = ['/dashboard', '/chat', '/classroom', '/settings'];

  // Authentication related routes
  const authRoutes = [
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/google-callback',
    '/auth/github-callback',
  ];

  // Public routes
  const publicRoutes = ['/', '/about', '/contact'];

  // Determine route types
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname === route);

  // --------------------------
  // Redirect logged-in users away from auth pages
  // --------------------------
  if (token && isAuthRoute) {
    const redirect = searchParams.get('redirect');
    const redirectUrl = redirect && !redirect.startsWith('/auth') ? redirect : '/dashboard';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // --------------------------
  // Redirect unauthenticated users from protected routes
  // --------------------------
  if (!token && isProtectedRoute) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('redirect', pathname); // Save intended destination
    return NextResponse.redirect(url);
  }

  // --------------------------
  // Allow public routes and auth routes (login/signup/forgot) without token
  // --------------------------
  if (isPublicRoute || isAuthRoute) {
    return NextResponse.next();
  }

  // --------------------------
  // Default: protect any other unknown route
  // --------------------------
  // if (!token) {
  //   return NextResponse.redirect(new URL('/auth/login', request.url));
  // }

  return NextResponse.next();
}

// ----------------------------------------------------------------------------
// Configuration: skip API routes, Next.js static files, favicon, and important static assets
// ----------------------------------------------------------------------------
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|robots.txt).*)',
  ],
};

// -----------------------------------------------------------------------------
// Notes:
// ✅ Prevents infinite redirect loops
// ✅ Handles protected, auth, and public routes
// ✅ Skips static files (images, favicon, manifest, robots.txt)
// ✅ Uses cookies for auth check
// -----------------------------------------------------------------------------
