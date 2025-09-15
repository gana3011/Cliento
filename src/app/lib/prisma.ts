import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma : PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: ["error", "warn"],
});

// Use global instance in all environments to prevent connection issues
if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prisma;
}