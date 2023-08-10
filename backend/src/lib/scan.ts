import type { FileEntry, Prisma, PrismaClient } from "@prisma/client";

import { FileItem, getFileTree } from "./local";
import type { TreeNode} from "./tree";
import { diffObject, mergeTrees } from "./tree";



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



function odTree2prismaCreateInput(odNode: TreeNode<FileItem>): Prisma.FileEntryUncheckedCreateWithoutParentInput {
    return {
        id: odNode.id,
        name: odNode.value.name,
        type: odNode.value.type,
        url: `/blob/files/${odNode.id == "/" ? "" : odNode.id}`,

        children: odNode.children ? {
            create: odNode.children.map(odTree2prismaCreateInput)
        } : undefined
    };
}

function createPrismaFileTree(odRoot: TreeNode<FileItem>, prisma: PrismaClient) {
    return prisma.fileEntry.create({
        data: odTree2prismaCreateInput(odRoot)
    });
}



async function updatePrismaFileTree(pRoot: PrismaTreeNode, odRoot: TreeNode<FileItem>, prisma: PrismaClient) {
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
                const odValue = {
                    ...odNode.value,
                };
                const diffObj = diffObject(pNode.value, odValue, [
                    ["name", "name"],
                ]);
                // TODO: support type changes with file cleanup.
                // if(pChild.type !== odNode.value.type) { diffObj.type = odNode.value.type; }

                if(diffObj) {
                    return prisma.fileEntry.update({
                        where: { id: odNode.id },
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
export async function executeFullScan(prisma: PrismaClient) {
    const fTree = await getFileTree();

    let pFileRoot: FileEntry;

    // TODO: implement merging the file tree with the Prisma tree, to avoid unnecessary deletions
    const pTree = await getPrismaFileTree(prisma);
    if(!pTree) {
        pFileRoot = await createPrismaFileTree(fTree, prisma);
    } else {
        await updatePrismaFileTree(pTree, fTree, prisma);
        pFileRoot = await prisma.fileEntry.findUniqueOrThrow({
            where: { id: fTree.id }
        });
    }

    return pFileRoot;
}
