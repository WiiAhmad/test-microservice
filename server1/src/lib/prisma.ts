import { PrismaClient } from '../../node_modules/.prisma/client-user'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ['query'],
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma