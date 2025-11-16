import { PrismaClient } from "@prisma/client";



export function makePrismaClient() {
    return new PrismaClient();
}
