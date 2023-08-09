import { Axios, AxiosError } from "axios";
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
    }).optional(),

    webDavUrl: z.string().optional(),
    webUrl: z.string().optional(),
});
const GetChildrenSchema = z.object({
    value: DriveItemSchema.array(),
    "@odata.nextLink": z.string().optional()
});
const DriveItemEmbedLinkSchema = z.object({
    id: z.string(),
    roles: z.string().array(),
    link: z.object({
        type: z.string(),
        webUrl: z.string()
    })
});



export interface OneDriveConfig {
    ax: Axios;
    baseURL: string;
    driveId: string;
}

export interface OneDriveItem extends Omit<z.infer<typeof DriveItemSchema>, "createdDateTime" | "lastModifiedDateTime"> {
    type: "directory" | "file";
    createdDateTime: Date;
    lastModifiedDateTime: Date;
    itemUrl: string;
}

function getOneDriveItemURL(itemId: string, cfg: OneDriveConfig) {
    return `${cfg.baseURL}/drives/${cfg.driveId}/items/${itemId}`;
}



export function getOneDriveItemEmbedUrl(itemId: string, cfg: OneDriveConfig) {
    const url = getOneDriveItemURL(itemId, cfg) + "/createLink";
    return cfg.ax.post(url, {
        type: "embed",
        scope: "anonymous"
    })
        .catch((err) => {
            console.error("Error fetching embed url");
            if(err instanceof AxiosError) {
                console.error(err.message);
                console.error(url)
                console.error(err.response?.data);
            } else {
                console.error(err);
            }
            throw err;
        })
        .then((res) => DriveItemEmbedLinkSchema.parse(res.data).link.webUrl);
}

function driveItem2treeNode(item: z.infer<typeof DriveItemSchema>, cfg: OneDriveConfig): TreeNode<OneDriveItem> {
    return {
        value: {
            ...item,
            type: item.folder ? "directory" : "file",

            createdDateTime: new Date(item.createdDateTime),
            lastModifiedDateTime: new Date(item.lastModifiedDateTime),
            itemUrl: getOneDriveItemURL(item.id, cfg),
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

export function makeConfig(token: string): OneDriveConfig {
    const baseURL = "https://graph.microsoft.com/v1.0";
    const ax = axios.create({
        baseURL,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return {
        ax,
        baseURL,
        driveId: APP_DRIVE_ID
    };
}
export function getOneDriveTree(cfg: OneDriveConfig): Promise<TreeNode<OneDriveItem>> {
    return getDriveItem(APP_FOLDER_ID, cfg);
}
