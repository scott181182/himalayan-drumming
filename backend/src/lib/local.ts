import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import type { TreeNode } from "./tree";



export interface FileItem {
    name: string;
    path: string;
    type: string;
}

export async function readDirRecursive(dirpath: string, rootpath: string): Promise<TreeNode<FileItem>[]> {
    const directoryEntries = await readdir(dirpath, {
        withFileTypes: true,
        encoding: "utf8"
    });

    const children: TreeNode<FileItem>[] = [];

    for(const dirent of directoryEntries) {
        const fullpath = path.join(dirpath, dirent.name);
        const id = path.relative(rootpath, fullpath);
        const value: FileItem = {
            name: dirent.name,
            path: fullpath,
            type: dirent.isFile() ? "file" : "directory"
        };

        if(dirent.isFile()) {
            children.push({
                id, value, children: []
            });
        } else if(dirent.isDirectory()) {
            children.push({
                id, value,
                children: await readDirRecursive(fullpath, rootpath)
            });
        }
    }

    return children;
}

export async function getFileTree(): Promise<TreeNode<FileItem>> {
    const rootDir = path.resolve(__dirname, "..", "..", "..", "blob", "files");

    return {
        id: "/",
        value: {
            name: "files",
            path: rootDir,
            type: "directory"
        },
        children: await readDirRecursive(rootDir, rootDir)
    }
}
