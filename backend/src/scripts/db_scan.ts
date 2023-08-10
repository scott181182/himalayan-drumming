import { PrismaClient } from "@prisma/client";

import { fatal } from "./util";
import { executeFullScan } from "@/lib/scan";



(async function main() {
    const prismaClient = new PrismaClient();

    await executeFullScan(prismaClient);
})();
