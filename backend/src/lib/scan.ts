import type { FileEntry, Prisma, PrismaClient } from "@prisma/client";

import type { OneDriveItem } from "./onedrive";
import { getOneDriveTree } from "./onedrive";
import type { TreeNode} from "./tree";
import { mergeTrees } from "./tree";
import type { Context } from "@/graphql/context";



async function getPrismaFileTree(prisma: PrismaClient): Promise<PrismaTreeNode | null> {
    const entries = await prisma.fileEntry.findMany();

    const rootIndex = entries.findIndex((e) => e.parentId === null);
    if(rootIndex < 0) { return null; }
    const [root] = entries.splice(rootIndex, 1);
    const rootNode: PrismaTreeNode = {
        value: root,
        id: root.id,
        children: []
    };

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
        parent.children = parentMap[parent.id].map((entry) => ({
            value: entry,
            id: entry.id,
            children: []
        }));
        for(const child of parent.children) {
            if(child.id in parentMap) { assignChildren(child); }
        }
    };
    assignChildren(rootNode);

    return rootNode;
}

type PrismaTreeNode = TreeNode<FileEntry>;



function odTree2prismaCreateInput(odNode: TreeNode<OneDriveItem>): Prisma.FileEntryUncheckedCreateWithoutParentInput {
    return {
        id: odNode.id,
        name: odNode.value.name,
        type: odNode.value.type,
        url: odNode.value.itemUrl,

        contentUrl: `${odNode.value.itemUrl}/content`,
        webDavUrl: odNode.value.webDavUrl,
        webUrl: odNode.value.webUrl,

        children: odNode.children ? {
            create: odNode.children.map(odTree2prismaCreateInput)
        } : undefined
    };
}

function createPrismaFileTree(odRoot: TreeNode<OneDriveItem>, prisma: PrismaClient) {
    return prisma.fileEntry.create({
        data: odTree2prismaCreateInput(odRoot)
    });
}



async function updatePrismaFileTree(pRoot: PrismaTreeNode, odRoot: TreeNode<OneDriveItem>, prisma: PrismaClient) {
    if(odRoot.id !== pRoot.id) {
        // Make sure the root folder IDs match (root folder is identified by name)
        await prisma.fileEntry.updateMany({
            where: { parentId: null },
            data: {
                id: odRoot.id
            }
        });
    }

    return mergeTrees(
        odRoot,
        pRoot,
        {
            onNew: (odNode) => createPrismaFileTree(odNode, prisma),
            async onExisting(odNode, pNode) {
                const diffObj: Prisma.FileEntryUncheckedUpdateInput = {};
                if(pNode.value.name !== odNode.value.name) { diffObj.name = odNode.value.name; }
                if(pNode.value.url !== odNode.value.itemUrl) { diffObj.url = odNode.value.itemUrl; }
                // TODO: support type changes with file cleanup.
                // if(pChild.type !== odNode.value.type) { diffObj.type = odNode.value.type; }

                if(Object.keys(diffObj).length > 0) {
                    return prisma.fileEntry.update({
                        where: { id: odNode.value.id },
                        data: diffObj
                    });
                }
            },
            async onOld(pNode) {
                if(pNode.value.type === "directory" || pNode.value.type === "file") {
                    return prisma.fileEntry.delete({
                        where: { id: pNode.id }
                    });
                }
            }
        }
    );
}

/**
 * Updates the application database based on what's present in the application's OneDrive folder.
 * Currently removes all items from the database, and refreshes based on OneDrive contents.
 * @param ctx
 */
export async function executeFullScan(ctx: Context) {
    const odTree = await getOneDriveTree(ctx.token);

    const odFileRoot = odTree.children?.find((e) => e.value.name === "Files");
    if(!odFileRoot) {
        throw new Error("Could not find root file directory 'Files' in OneDrive.");
    }

    let pFileRoot: FileEntry;

    // TODO: implement merging the OneDrive tree with the Prisma tree, to avoid unnecessary deletions
    const pTree = await getPrismaFileTree(ctx.prisma);
    if(!pTree) {
        pFileRoot = await createPrismaFileTree(odFileRoot, ctx.prisma);
    } else {
        await updatePrismaFileTree(pTree, odFileRoot, ctx.prisma);
        pFileRoot = await ctx.prisma.fileEntry.findUniqueOrThrow({
            where: { id: odFileRoot.id }
        });
    }

    return pFileRoot;
}
