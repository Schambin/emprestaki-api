import prisma from "./client";

export async function checkDatabaseConnection() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        console.log('✅ Database connection established');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}