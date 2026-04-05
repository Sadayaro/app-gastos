import { authConfig } from "@/lib/auth"
import NextAuth from "next-auth"

export default NextAuth(authConfig).auth

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/expenses/:path*",
    "/incomes/:path*",
    "/documents/:path*",
    "/settings/:path*",
    "/api/expenses/:path*",
    "/api/incomes/:path*",
    "/api/documents/:path*",
  ],
}
