import { PrismaClient } from "himalayan-drumming-research-database";



export function makePrismaClient() {
    return new PrismaClient();
}
