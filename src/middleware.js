import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = request.cookies.get('auth-token')?.value;
  
  // Protected routes that require authentication
  const protectedRoutes = [
    '/profile',
    '/checkout',
    '/orders',
    '/cart',
  ];
  
  // Admin-only routes
  const adminRoutes = [
    '/admin',
  ];
  
  const path = request.nextUrl.pathname;
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => path.startsWith(route));
  
  // If no token and trying to access protected route, redirect to login
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }
  
  // For admin routes, we'll check the role in the API routes since we can't decode JWT here
  // This is just a first layer of protection
  if (isAdminRoute && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    '/profile/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/cart/:path*',
  ],
};

