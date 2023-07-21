import { PrismaClient } from "@prisma/client";

import { fatal } from "./util";
import { executeFullScan } from "@/lib/scan";



(async function main(args: string[]) {
    if(args.length !== 1) { fatal("Expected a token argument, but found none."); }
    const token = args.shift() as string;

    const prismaClient = new PrismaClient();

    await executeFullScan({
        prisma: prismaClient,
        token
    });
})(process.argv.slice(2));
