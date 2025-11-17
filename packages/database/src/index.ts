import { PrismaPg } from "@prisma/adapter-pg";
import type { PoolConfig } from "pg";

import { PrismaClient } from "./generated/prisma/client.js";



export function createPrismaClient(poolConfig: PoolConfig) {
    const adapter = new PrismaPg(poolConfig);
    const client = new PrismaClient({ adapter });

    return client;
}

export * from "./generated/prisma/client.js";
