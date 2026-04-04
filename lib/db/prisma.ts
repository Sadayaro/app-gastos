import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // During build, DATABASE_URL might not be available
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not set, Prisma client not initialized')
    return null as unknown as PrismaClient
  }
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
