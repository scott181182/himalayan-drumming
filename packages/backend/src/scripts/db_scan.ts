import { PrismaClient } from "@/generated/prisma";
import { executeFullScan } from "@/lib/scan";



(async function main() {
    const prismaClient = new PrismaClient();

    await executeFullScan(prismaClient);
})();
