import { createId, isCuid } from "@paralleldrive/cuid2";
import { PrismaClient } from "@prisma/client";



(async function main() {
    const prismaClient = new PrismaClient();

    const fileEntries = await prismaClient.fileEntry.findMany();
    console.log(`Found ${fileEntries.length} file entries`);

    let changed = 0;
    for(const entry of fileEntries) {
        // Only update ID if it _isn't_ already a CUID.
        if(!isCuid(entry.id)) {
            changed++;
            await prismaClient.fileEntry.update({
                where: { id: entry.id },
                data: { id: createId() }
            });
        }
    }
    console.log(`Updated ${changed} file entry IDs to CUIDs`);
})();
