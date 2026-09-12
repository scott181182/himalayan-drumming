import type { FileStorage } from "@flystorage/file-storage";

import type { DbClient } from "./db";
import type { FileItem } from "./local";
import { getFileTree } from "./local";
import type { TreeNode } from "./tree";
import { diffObject, mergeTrees } from "./tree";
import type { FileEntryUncheckedCreateInput } from "@/generated/zenstack/input";
import type { FileEntry } from "@/generated/zenstack/models";

type FileEntryTreeNode = TreeNode<FileEntry>;

async function getPrismaFileTree(db: Readonly<DbClient>): Promise<FileEntryTreeNode | null> {
  const entries = await db.fileEntry.findMany();

  const rootIndex = entries.findIndex((e) => e.parentId === null);
  if (rootIndex < 0) {
    return null;
  }
  const [root] = entries.splice(rootIndex, 1);
  const rootNode: FileEntryTreeNode = {
    value: root,
    id: root.id,
    children: [],
  };

  const parentMap: Record<string, FileEntry[]> = {};
  for (const entry of entries) {
    if (entry.parentId === null) {
      console.warn(`Found more than one FileEntry without a parent: ${entry.id}`);
      continue;
    }
    if (!(entry.parentId in parentMap)) {
      parentMap[entry.parentId] = [];
    }
    parentMap[entry.parentId].push(entry);
  }

  // oxlint-disable-next-line typescript/prefer-readonly-parameter-types
  const assignChildren = (parent: FileEntryTreeNode) => {
    if (!(parent.id in parentMap)) {
      // This "parent" doesn't have any children.
      return;
    }
    parent.children = parentMap[parent.id].map((entry) => ({
      value: entry,
      id: entry.id,
      children: [],
    }));
    for (const child of parent.children) {
      if (child.id in parentMap) {
        assignChildren(child);
      }
    }
  };
  assignChildren(rootNode);

  return rootNode;
}

export async function fileTree2prismaCreateInput(
  fileNode: Readonly<TreeNode<FileItem>>,
  parentId: string | null,
  storage: Readonly<FileStorage>,
): Promise<FileEntryUncheckedCreateInput> {
  const input = await fileTree2prismaCreateWithoutParentInput(fileNode, storage);
  return {
    ...input,
    parentId,
  };
}
async function fileTree2prismaCreateWithoutParentInput(
  fileNode: Readonly<TreeNode<FileItem>>,
  storage: Readonly<FileStorage>,
): Promise<Omit<FileEntryUncheckedCreateInput, "parent">> {
  return {
    id: fileNode.id,
    path: fileNode.value.path,
    name: fileNode.value.name,
    type: fileNode.value.type,
    url: await storage.publicUrl(fileNode.value.path),

    children: fileNode.children
      ? {
          create: await Promise.all(
            fileNode.children.map((child) =>
              fileTree2prismaCreateWithoutParentInput(child, storage),
            ),
          ),
        }
      : undefined,
  };
}

async function createPrismaFileTree(
  odRoot: Readonly<TreeNode<FileItem>>,
  parentId: string | null,
  db: Readonly<DbClient>,
  storage: Readonly<FileStorage>,
) {
  const data = await fileTree2prismaCreateInput(odRoot, parentId, storage);
  console.log(JSON.stringify(data, null, 2));
  return db.fileEntry.create({ data });
}

async function updatePrismaFileTree(
  pRoot: Readonly<FileEntryTreeNode>,
  odRoot: Readonly<TreeNode<FileItem>>,
  db: Readonly<DbClient>,
  storage: Readonly<FileStorage>,
) {
  if (odRoot.id !== pRoot.id) {
    // Make sure the root folder IDs match (root folder is identified by name)
    await db.fileEntry.updateMany({
      where: { parentId: null },
      data: {
        id: odRoot.id,
      },
    });
  }

  return mergeTrees(odRoot, pRoot, {
    idFn: (node) => node.value.path,
    onNew: async (odNode, parent) => {
      await createPrismaFileTree(odNode, parent.id, db, storage);
    },
    async onExisting(odNode, pNode) {
      const odValue = {
        ...odNode.value,
      };
      const diffObj = diffObject(pNode.value, odValue, [["name", "name"]]);
      // TODO: support type changes with file cleanup.
      // if(pChild.type !== odNode.value.type) { diffObj.type = odNode.value.type; }

      if (diffObj) {
        await db.fileEntry.update({
          where: { id: odNode.id },
          data: diffObj,
        });
      }
    },
    async onOld(pNode) {
      if (pNode.value.type === "directory" || pNode.value.type === "file") {
        await db.fileEntry.delete({
          where: { id: pNode.id },
        });
      }
    },
  });
}

/**
 * Updates the application database based on what's present in the application's storage system.
 * Currently removes all items from the database, and refreshes based on storage system contents.
 *
 * @param db The database client to use for the update.
 * @param storage The file storage to use for scanning the storage system.
 *
 * @returns The root FileEntry of the updated database tree.
 */
export async function executeFullScan(
  db: Readonly<DbClient>,
  storage: Readonly<FileStorage>,
): Promise<FileEntry> {
  const fTree = await getFileTree(storage);

  let pFileRoot: FileEntry;

  const pTree = await getPrismaFileTree(db);
  if (pTree) {
    await updatePrismaFileTree(pTree, fTree, db, storage);
    pFileRoot = await db.fileEntry.findUniqueOrThrow({
      where: { id: fTree.id },
    });
  } else {
    pFileRoot = await createPrismaFileTree(fTree, null, db, storage);
  }

  return pFileRoot;
}
