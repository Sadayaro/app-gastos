import type { NextAuthConfig, Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db/prisma"

// Extend the session and JWT types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      firstName?: string | null
      lastName?: string | null
      avatarUrl?: string | null
      isAdmin?: boolean
    }
  }

  interface User {
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    isAdmin?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    isAdmin?: boolean
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
          isAdmin: user.isAdmin,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.avatarUrl = user.avatarUrl
        token.isAdmin = user.isAdmin
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.firstName = token.firstName
        session.user.lastName = token.lastName
        session.user.avatarUrl = token.avatarUrl
        session.user.isAdmin = token.isAdmin
      }
      return session
    },
  },
}
