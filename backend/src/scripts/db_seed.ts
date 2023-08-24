import { PrismaClient } from "@prisma/client";



const FILE_TYPES = [
    "directory",
    "file",
    "reference"
];

(async function main() {
    const prismaClient = new PrismaClient();

    // Check for seed data already present
    const currentFileTypes = await prismaClient.fileType.findMany();
    const unseenFileTypes = new Set(FILE_TYPES);
    for(const ft of currentFileTypes) {
        if(unseenFileTypes.has(ft.name)) {
            // Database already has this type, nice!
            unseenFileTypes.delete(ft.name);
        } else {
            // This is an unexpected type, time to delete.
            await prismaClient.fileType.delete({ where: { name: ft.name } });
        }
    }
    for(const unseenFileType of unseenFileTypes) {
        // Add any file types not present in database.
        await prismaClient.fileType.create({
            data: { name: unseenFileType }
        });
    }
})();
