import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/admin/login') || 
                      req.nextUrl.pathname.startsWith('/admin/register');
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin') && 
                       !req.nextUrl.pathname.startsWith('/admin/login') && 
                       !req.nextUrl.pathname.startsWith('/admin/register');

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    // Redirect unauthenticated users to login
    if (isAdminPage && !isAuth) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // Check role-based access
    if (isAdminPage && isAuth) {
      const userRole = token?.role as string;
      
      // Only allow admin and owner roles to access admin pages
      if (!['admin', 'owner'].includes(userRole)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public pages
        if (req.nextUrl.pathname.startsWith('/menu/') || 
            req.nextUrl.pathname.startsWith('/restaurant/') ||
            req.nextUrl.pathname === '/' ||
            req.nextUrl.pathname.startsWith('/api/auth/') ||
            req.nextUrl.pathname.startsWith('/_next/') ||
            req.nextUrl.pathname.startsWith('/favicon.ico')) {
          return true;
        }

        // For admin pages, check if user is authenticated
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

