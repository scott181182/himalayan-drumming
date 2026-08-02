import type { FileStorage } from "@flystorage/file-storage";

import { ROOT_FILE_ENTRY_ID } from "../files";
import { FILES_DIR } from "./storage";
import type { TreeNode } from "./tree";

export interface FileItem {
  name: string;
  path: string;
  type: string;
}

export async function readDirRecursive(
  dirpath: string,
  storage: Readonly<FileStorage>,
): Promise<TreeNode<FileItem>[]> {
  const directoryEntries = await storage
    .list(dirpath, {
      withFileTypes: true,
      encoding: "utf8",
      deep: false,
    })
    .toArray();

  const children: TreeNode<FileItem>[] = [];

  for (const dirent of directoryEntries) {
    // Ignore dot files/directories.
    const name = dirent.path.split("/").pop() ?? "";
    if (name.startsWith(".")) {
      continue;
    }

    const value: FileItem = {
      name: name,
      path: dirent.path,
      type: dirent.isFile ? "file" : "directory",
    };

    if (dirent.isFile) {
      children.push({
        id: dirent.path,
        value,
        children: [],
      });
    } else if (dirent.isDirectory) {
      children.push({
        id: dirent.path,
        value,
        children: await readDirRecursive(dirent.path, storage),
      });
    }
  }

  return children;
}

export async function getFileTree(storage: Readonly<FileStorage>): Promise<TreeNode<FileItem>> {
  return {
    id: ROOT_FILE_ENTRY_ID,
    value: {
      name: "files",
      path: FILES_DIR,
      type: "directory",
    },
    children: await readDirRecursive(FILES_DIR, storage),
  };
}
