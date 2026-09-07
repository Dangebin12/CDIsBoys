import { PrismaClient } from '@prisma/client'

// En desarrollo el hot reload reevalúa los módulos; sin este singleton se
// abriría una conexión nueva a SQLite en cada recarga hasta agotarlas.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
