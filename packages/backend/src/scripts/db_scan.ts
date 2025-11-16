import { PrismaClient } from "himalayan-drumming-research-database";

import { executeFullScan } from "@/lib/scan";



(async function main() {
    const prismaClient = new PrismaClient();

    await executeFullScan(prismaClient);
})();
