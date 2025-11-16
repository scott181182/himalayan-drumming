import { PrismaClient } from "@/generated/prisma";



export function makePrismaClient() {
    return new PrismaClient();
}
