import type { BetterAuthUser } from "himalayan-drumming-research-auth";
import type { PrismaClient } from "himalayan-drumming-research-database";



export interface Context {
    prisma: PrismaClient;
    user: BetterAuthUser;
}
