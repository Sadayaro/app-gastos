import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Lazy initialization - PrismaClient is only created when first accessed
function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  // During build without valid DB, return a mock client
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
    console.warn('DATABASE_URL not set, using mock Prisma client')
    return createMockPrismaClient()
  }

  // Create pool and adapter for Prisma 7.x
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }

  return client
}

// Mock PrismaClient for build time
function createMockPrismaClient(): PrismaClient {
  const mockData = {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
    count: async () => 0,
    aggregate: async () => ({ _sum: { amount: 0 } }),
    groupBy: async () => [],
  }

  return {
    branch: { ...mockData },
    expense: { ...mockData },
    category: { ...mockData },
    user: { ...mockData },
    splitAssignment: { ...mockData },
    document: { ...mockData },
    $connect: async () => {},
    $disconnect: async () => {},
  } as unknown as PrismaClient
}

// Export a Proxy that lazily initializes the client
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    const client = getPrismaClient()
    return (client as any)[prop]
  },
})
