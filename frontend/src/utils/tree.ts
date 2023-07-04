import type { TreeDataNode } from "antd";

import type { FileEntryBasicFragment} from "@/generated/graphql";



export interface IdObject {
    id: string;
}

export interface AntdTreeConfig<T extends IdObject> {
    titleFn: (t: T) => React.ReactNode;
    isLeafFn: (t: T) => boolean;
}



export function fileEntries2tree(entries: FileEntryBasicFragment[]): ImmutableTree<FileEntryBasicFragment> {
    let rootIndex = -1;
    const nodeMap: Record<string, FileEntryBasicFragment> = {};
    const parentMap: Record<string, string[]> = {};

    for(let i = 0; i < entries.length; i++) {
        const entry = entries[i];

        nodeMap[entry.id] = entry;
        if(!entry.parentId) {
            if(rootIndex >= 0) {
                console.warn(`Found more than one FileEntry without a parent: ${entry.id}`);
                continue;
            }
            rootIndex = i;
        } else {
            if(!(entry.parentId in parentMap)) {
                parentMap[entry.parentId] = [];
            }
            parentMap[entry.parentId].push(entry.id);
        }
    }
    if(rootIndex < 0) {
        throw new Error("Could not find root file entry");
    }
    const root = entries[rootIndex];

    return new ImmutableTree(root, nodeMap, parentMap);
}

export class ImmutableTree<T extends IdObject> {
    private readonly nodeMap: Record<string, T>;
    private readonly parentMap: Record<string, string[]>;

    public constructor(
        private readonly root: T,
        nodeMap?: Record<string, T>,
        parentMap?: Record<string, string[]>
    ) {
        this.nodeMap = nodeMap ?? { [root.id]: root };
        this.parentMap = parentMap ?? {  };
    }



    public getNodes(): T[] { return Object.values(this.nodeMap); }

    public hasNode(id: string): boolean { return id in this.nodeMap; }
    public getNode(id: string): T { return this.nodeMap[id]; }



    public expandNode(id: string, children: T[]): ImmutableTree<T> {
        return new ImmutableTree(
            this.root,
            {
                ...this.nodeMap,
                ...Object.fromEntries(children.map((c) => [c.id, c]))
            },
            {
                ...this.parentMap,
                [id]: children.map((c) => c.id)
            }
        );
    }



    private toAntdTreeNode(t: T, options: AntdTreeConfig<T>): TreeDataNode {
        return {
            key: t.id,
            title: options.titleFn(t),
            isLeaf: options.isLeafFn(t),
            children: t.id in this.parentMap ?
                this.parentMap[t.id].map((id) => this.nodeMap[id]).map((n) => this.toAntdTreeNode(n, options)) :
                undefined
        };
    }
    public toAntdTree(options: AntdTreeConfig<T>): TreeDataNode {
        return this.toAntdTreeNode(this.root, options);
    }
}
