import { PrismaClient } from "himalayan-drumming-research-database";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";



export function makeAuth(prisma: PrismaClient) {
    return betterAuth({
        database: prismaAdapter(prisma, {
            provider: "postgresql",
        }),
        emailAndPassword: {
            enabled: true,
        },
    });
}

export type AppAuth = ReturnType<typeof makeAuth>;
export type BetterAuthUser = NonNullable<Awaited<ReturnType<AppAuth["api"]["getSession"]>>>["user"];
