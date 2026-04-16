import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BACKEND_URL = 'http://localhost:5000';

/**
 * Next.js Middleware for server-side route protection
 * 
 * This middleware runs on the server before any page is rendered.
 * It validates tokens with the backend and enforces role-based access control.
 * 
 * Security Flow:
 * 1. Check if route is protected (admin/customer routes)
 * 2. If protected and no token -> redirect to login
 * 3. Verify token with backend /auth/verify endpoint
 * 4. If invalid token -> redirect to login + clear cookies
 * 5. If valid token but wrong role -> redirect to access-denied
 * 6. If authorized -> allow access
 */
export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Define route patterns
    const isAdminRoute = pathname.startsWith('/admin');
    const isCustomerRoute = pathname.startsWith('/customer');
    const isProtectedRoute = isAdminRoute || isCustomerRoute;

    // Public routes - allow access without authentication
    if (!isProtectedRoute) {
        return NextResponse.next();
    }

    // Protected route without token - redirect to login
    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        // Verify token with backend
        const response = await fetch(`${BACKEND_URL}/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            // Add timeout to prevent hanging
            signal: AbortSignal.timeout(5000),
        });

        // Invalid or expired token
        if (!response.ok) {
            console.log('[Middleware] Token verification failed:', response.status);
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('expired', 'true');
            const res = NextResponse.redirect(loginUrl);
            // Clear invalid cookies
            res.cookies.delete('token');
            res.cookies.delete('role');
            res.cookies.delete('id');
            res.cookies.delete('name');
            return res;
        }

        const { data } = await response.json();
        const userRole = data.role as 'ADMIN' | 'CUSTOMER';

        // Role-based access control
        // Admin routes: only ADMIN can access
        if (isAdminRoute && userRole !== 'ADMIN') {
            console.log('[Middleware] Access denied: Customer trying to access admin route');
            return NextResponse.redirect(new URL('/access-denied', request.url));
        }

        // Customer routes: both ADMIN and CUSTOMER can access
        // (No additional check needed - if we reach here, user is authenticated)

        // Authorized - allow access
        return NextResponse.next();

    } catch (error) {
        console.error('[Middleware] Token verification error:', error);

        // Backend unreachable - could be network issue
        // For security, redirect to login rather than allowing access
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('error', 'server');
        return NextResponse.redirect(loginUrl);
    }
}

// Configure which routes this middleware applies to
export const config = {
    matcher: [
        // Match admin routes
        '/admin/:path*',
        // Match customer routes
        '/customer/:path*',
    ]
};
