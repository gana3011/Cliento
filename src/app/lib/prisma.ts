import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma : PrismaClient | undefined;
};

const createPrismaClient = () => {
    return new PrismaClient({
        log: ["error", "warn"],
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Use global instance in all environments to prevent connection issues
if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prisma;
}