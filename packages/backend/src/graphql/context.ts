import type { PrismaClient } from "@/generated/prisma";



export interface Context {
    prisma: PrismaClient;
    token: string;
}
