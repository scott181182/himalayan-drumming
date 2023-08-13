import { PrismaClient } from "@prisma/client";



const FILE_TYPES = [
    "directory",
    "file",
    "reference"
];

(async function main() {
    const prismaClient = new PrismaClient();

    await prismaClient.fileType.deleteMany();

    for(const fileType of FILE_TYPES) {
        await prismaClient.fileType.upsert({
            where: { name: fileType },
            create: { name: fileType },
            update: {}
        });
    }
})();
