import type { FileEntry, Prisma, PrismaClient } from "@prisma/client";

import type { OneDriveTreeNode} from "./onedrive";
import { getOneDriveTree } from "./onedrive";
import type { Context } from "@/graphql/context";



async function getPrismaFileTree(prisma: PrismaClient) {
    const entries = await prisma.fileEntry.findMany();

    const rootIndex = entries.findIndex((e) => e.parentId === null);
    if(rootIndex < 0) { return null; }
    const [root] = entries.splice(rootIndex, 1);

    const parentMap: Record<string, FileEntry[]> = {};
    for(const entry of entries) {
        if(entry.parentId === null) {
            console.warn(`Found more than one FileEntry without a parent: ${entry.id}`);
            continue;
        }
        if(!(entry.parentId in parentMap)) {
            parentMap[entry.parentId] = [];
        }
        parentMap[entry.parentId].push(entry);
    }

    const assignChildren = (parent: PrismaTreeNode) => {
        parent.children = parentMap[parent.id];
        for(const child of parent.children) {
            if(child.id in parentMap) { assignChildren(child); }
        }
    };
    assignChildren(root);

    return root;
}

interface PrismaTreeNode extends FileEntry {
    children?: PrismaTreeNode[]
}



function odTree2prismaCreateInput(odNode: OneDriveTreeNode): Prisma.FileEntryUncheckedCreateWithoutParentInput {
    return {
        id: odNode.id,
        name: odNode.name,
        type: odNode.type,
        url: odNode.itemUrl,

        children: odNode.children ? {
            create: odNode.children.map(odTree2prismaCreateInput)
        } : undefined
    };
}

function createPrismaFileTree(odRoot: OneDriveTreeNode, prisma: PrismaClient) {
    return prisma.fileEntry.create({
        data: odTree2prismaCreateInput(odRoot)
    });
}

async function updatePrismaDirectory(pDir: PrismaTreeNode, odDir: OneDriveTreeNode, prisma: PrismaClient) {
    if(!odDir.children) { return; }

    if(!pDir.children) {
        // TODO: change to `createMany` after migrating away from SQLite?
        return prisma.fileEntry.update({
            where: { id: odDir.id },
            data: {
                children: {
                    create: odDir.children.map(odTree2prismaCreateInput)
                }
            }
        });
    }

    /**
     * Keeps track of FileEntries in Prisma that DON'T have a corresponding file in OneDrive.
     * This will be used to delete files that no longer exist in OneDrive.
     */
    const unseenFileEntryIds = new Set(
        pDir.children
            .filter((pChild) => pChild.type === "directory" || pChild.type === "file")
            .map((pChild) => pChild.id)
    );
    for(const odChild of odDir.children) {
        const pChild = pDir.children.find((pChild) => pChild.id === odChild.id);

        if(!pChild) {
            await prisma.fileEntry.create({
                data: {
                    ...odTree2prismaCreateInput(odChild),
                    parentId: odDir.id
                }
            });
        } else {
            unseenFileEntryIds.delete(pChild.id);

            const diffObj: Prisma.FileEntryUncheckedUpdateInput = {};
            if(pChild.name !== odChild.name) { diffObj.name = odChild.name; }
            if(pChild.url !== odChild.itemUrl) { diffObj.url = odChild.itemUrl; }
            // TODO: support type changes with file cleanup.
            // if(pChild.type !== odChild.type) { diffObj.type = odChild.type; }

            if(Object.keys(diffObj).length > 0) {
                await prisma.fileEntry.update({
                    where: { id: odChild.id },
                    data: diffObj
                });
            }

            if(odChild.children) {
                await updatePrismaDirectory(pChild, odChild, prisma);
            }
        }
    }
    if(unseenFileEntryIds.size > 0) {
        // TODO: implement tree cleanup function.
    }
}
async function updatePrismaFileTree(pRoot: PrismaTreeNode, odRoot: OneDriveTreeNode, prisma: PrismaClient) {
    if(odRoot.id !== pRoot.id) {
        // Make sure the root folder IDs match (root folder is identified by name)
        await prisma.fileEntry.updateMany({
            where: { parentId: null },
            data: {
                id: odRoot.id
            }
        });
    }

    // Other file entries are identified by ID instead of name
    await updatePrismaDirectory(pRoot, odRoot, prisma);
}

/**
 * Updates the application database based on what's present in the application's OneDrive folder.
 * Currently removes all items from the database, and refreshes based on OneDrive contents.
 * @param ctx
 */
export async function executeFullScan(ctx: Context) {
    const odTree = await getOneDriveTree(ctx.token);

    const odFileRoot = odTree.children?.find((e) => e.name === "Files");
    if(!odFileRoot) {
        throw new Error("Could not find root file directory 'Files' in OneDrive.");
    }
    await ctx.prisma.fileEntry.deleteMany();
    const pFileRoot = await createPrismaFileTree(odFileRoot, ctx.prisma);

    // TODO: implement merging the OneDrive tree with the Prisma tree, to avoid unnecessary deletions
    // const pTree = await getPrismaFileTree(ctx.prisma);
    // if(!pTree) {
    //     await createPrismaFileTree(odFileRoot, ctx.prisma);
    // } else {
    //     await updatePrismaFileTree(pTree, odFileRoot, ctx.prisma);
    // }

    return pFileRoot;
}
