import { createPrismaClient } from "himalayan-drumming-research-database";

import { executeFullScan } from "@/lib/scan";



(async function main() {
    const prismaClient = createPrismaClient({
        connectionString: process.env.DATABASE_URL
    });

    await executeFullScan(prismaClient);
})();
