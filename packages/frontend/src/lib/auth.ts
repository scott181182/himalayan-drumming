import { makeAuth } from "himalayan-drumming-research-auth";
import { PrismaClient } from "himalayan-drumming-research-database";

const prisma = new PrismaClient();

export const auth = makeAuth(prisma);
