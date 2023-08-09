import type { FileEntry, Prisma, PrismaClient } from "@prisma/client";

import type { OneDriveConfig, OneDriveItem } from "./onedrive";
import { getOneDriveItemEmbedUrl, getOneDriveTree, makeConfig } from "./onedrive";
import type { TreeNode} from "./tree";
import { diffObject, mergeTrees } from "./tree";
import type { Context } from "@/graphql/context";



interface ScanContext extends Context, OneDriveConfig {  }



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



async function odTree2prismaCreateInput(odNode: TreeNode<OneDriveItem>, ctx: ScanContext): Promise<Prisma.FileEntryUncheckedCreateWithoutParentInput> {
    const embedUrl = await getOneDriveItemEmbedUrl(odNode.id, ctx);

    const create: Prisma.FileEntryUncheckedCreateWithoutParentInput[] = [];
    for(const child of odNode.children) {
        create.push(await odTree2prismaCreateInput(child, ctx));
    }

    return {
        id: odNode.id,
        name: odNode.value.name,
        type: odNode.value.type,
        url: odNode.value.itemUrl,

        contentUrl: `${odNode.value.itemUrl}/content`,
        webDavUrl: odNode.value.webDavUrl,
        webUrl: odNode.value.webUrl,
        embedUrl,

        children: odNode.children ? { create } : undefined
    };
}

async function createPrismaFileTree(odRoot: TreeNode<OneDriveItem>, ctx: ScanContext) {
    return ctx.prisma.fileEntry.create({
        data: await odTree2prismaCreateInput(odRoot, ctx)
    });
}



async function updatePrismaFileTree(pRoot: PrismaTreeNode, odRoot: TreeNode<OneDriveItem>, ctx: ScanContext) {
    if(odRoot.id !== pRoot.id) {
        // Make sure the root folder IDs match (root folder is identified by name)
        await ctx.prisma.fileEntry.updateMany({
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
            onNew: (odNode) => createPrismaFileTree(odNode, ctx),
            async onExisting(odNode, pNode) {
                const odValue = {
                    ...odNode.value,
                    downloadUrl: `${odNode.value.itemUrl}/content`
                };
                const diffObj = diffObject(pNode.value, odValue, [
                    ["name", "name"],
                    ["url", "itemUrl"],
                    ["contentUrl", "downloadUrl"],
                    ["webUrl", "webUrl"],
                    ["webDavUrl", "webDavUrl"]
                ]);
                if(!pNode.value.embedUrl) {
                    (diffObj as any).embedUrl = await getOneDriveItemEmbedUrl(odValue.id, ctx);
                }
                // TODO: support type changes with file cleanup.
                // if(pChild.type !== odNode.value.type) { diffObj.type = odNode.value.type; }

                if(diffObj) {
                    return ctx.prisma.fileEntry.update({
                        where: { id: odNode.value.id },
                        data: diffObj
                    });
                }
            },
            async onOld(pNode) {
                if(pNode.value.type === "directory" || pNode.value.type === "file") {
                    return ctx.prisma.fileEntry.delete({
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
    const scanCtx: ScanContext = {
        ...ctx,
        ...makeConfig(ctx.token)
    }
    const odTree = await getOneDriveTree(scanCtx);

    const odFileRoot = odTree.children?.find((e) => e.value.name === "Files");
    if(!odFileRoot) {
        throw new Error("Could not find root file directory 'Files' in OneDrive.");
    }

    let pFileRoot: FileEntry;

    // TODO: implement merging the OneDrive tree with the Prisma tree, to avoid unnecessary deletions
    const pTree = await getPrismaFileTree(ctx.prisma);
    if(!pTree) {
        pFileRoot = await createPrismaFileTree(odFileRoot, scanCtx);
    } else {
        await updatePrismaFileTree(pTree, odFileRoot, scanCtx);
        pFileRoot = await ctx.prisma.fileEntry.findUniqueOrThrow({
            where: { id: odFileRoot.id }
        });
    }

    return pFileRoot;
}
