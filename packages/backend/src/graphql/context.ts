import type { PrismaClient } from "himalayan-drumming-research-database";



export interface Context {
    prisma: PrismaClient;
    token: string;
}
