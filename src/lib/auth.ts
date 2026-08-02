import { makeAuth } from "himalayan-drumming-research-auth";
import { createPrismaClient } from "himalayan-drumming-research-database";

const prisma = createPrismaClient({
    connectionString: process.env.DATABASE_URL
});

export const auth = makeAuth(prisma);
