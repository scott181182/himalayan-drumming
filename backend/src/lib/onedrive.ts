import type { Axios } from "axios";
import axios from "axios";
import { z } from "zod";

import type { TreeNode } from "./tree";



export const APP_DRIVE_ID = "b!PdaO42V9RUmFElWpViyytFdVIGOuCpVClLAJG1HQ_Z7YTK-gU5uKT4Fxeg0iXwKP";
export const APP_FOLDER_ID = "01COUOXFJUKYDPF6HWKBELMEHVODWE6DSA";
// const APP_FOLDER_URL = `https://graph.microsoft.com/v1.0/drives/${APP_DRIVE_ID}/items/${APP_FOLDER_ID}`;

const DriveItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    size: z.number(),
    createdDateTime: z.string(),
    lastModifiedDateTime: z.string(),
    folder: z.object({
        childCount: z.number()
    }).optional()
});
const GetChildrenSchema = z.object({
    value: DriveItemSchema.array(),
    "@odata.nextLink": z.string().optional()
});



export interface OneDriveConfig {
    ax: Axios;
    baseURL: string;
    driveId: string;
}

export interface OneDriveItem {
    id: string;
    name: string;
    type: "directory" | "file";
    size: number;
    createdDateTime: Date;
    lastModifiedDateTime: Date;
    itemUrl: string;
}

function getOneDriveItemURL(itemId: string, cfg: OneDriveConfig) {
    return `${cfg.baseURL}/drives/${cfg.driveId}/items/${itemId}`;
}



function driveItem2treeNode(item: z.infer<typeof DriveItemSchema>, cfg: OneDriveConfig): TreeNode<OneDriveItem> {
    return {
        value: {
            id: item.id,
            name: item.name,
            type: item.folder ? "directory" : "file",

            size: item.size,
            createdDateTime: new Date(item.createdDateTime),
            lastModifiedDateTime: new Date(item.lastModifiedDateTime),
            itemUrl: getOneDriveItemURL(item.id, cfg)
        },
        id: item.id,
        children: []
    };
}
async function getDriveItemChildren(id: string, cfg: OneDriveConfig): Promise<TreeNode<OneDriveItem>[]> {
    const res = await cfg.ax.get(getOneDriveItemURL(id, cfg) + "/children");
    const data = GetChildrenSchema.parse(res.data);

    const nodes = data.value.map((v) => driveItem2treeNode(v, cfg));
    for(const node of nodes) {
        if(node.value.type === "directory") {
            node.children = await getDriveItemChildren(node.id, cfg);
        }
    }

    return nodes;
}
async function getDriveItem(id: string, cfg: OneDriveConfig): Promise<TreeNode<OneDriveItem>> {
    const res = await cfg.ax.get(getOneDriveItemURL(id, cfg));
    const data = DriveItemSchema.parse(res.data);

    const node = driveItem2treeNode(data, cfg);
    if(node.value.type === "directory") {
        node.children = await getDriveItemChildren(node.id, cfg);
    }

    return node;
}

export function getOneDriveTree(token: string): Promise<TreeNode<OneDriveItem>> {
    const baseURL = "https://graph.microsoft.com/v1.0";
    const ax = axios.create({
        baseURL,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const cfg: OneDriveConfig = {
        ax,
        baseURL,
        driveId: APP_DRIVE_ID
    };

    return getDriveItem(APP_FOLDER_ID, cfg);
}
