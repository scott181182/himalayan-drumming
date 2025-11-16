import { PrismaClient } from "@prisma/client";

import { executeFullScan } from "@/lib/scan";



(async function main() {
    const prismaClient = new PrismaClient();

    await executeFullScan(prismaClient);
})();
