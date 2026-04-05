import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check for auth session cookie
  const sessionCookie = request.cookies.get("next-auth.session-token") || 
                       request.cookies.get("__Secure-next-auth.session-token")
  
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register")
  const isProtectedRoute = 
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/expenses") ||
    pathname.startsWith("/incomes") ||
    pathname.startsWith("/documents") ||
    pathname.startsWith("/settings")

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/expenses/:path*",
    "/incomes/:path*",
    "/documents/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
}
