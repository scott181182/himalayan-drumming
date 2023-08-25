import type { TreeDataNode } from "antd";

import type { FileEntryBasicFragment, LocationCompleteFragment} from "@/generated/graphql";



export interface IdObject {
    id: string;
}

export interface AntdTreeConfig<T extends IdObject> {
    titleFn: (t: T) => React.ReactNode;
    isLeafFn: (t: T) => boolean;

    filter?: (t: T) => boolean;
}

export type AntDTreeNode<T> = TreeDataNode & {
    children?: AntDTreeNode<T>[],
    data: T
};



export class ImmutableTree<T extends IdObject> {
    protected readonly nodeMap: Record<string, T>;
    protected readonly parentMap: Record<string, string[]>;

    public constructor(
        protected readonly root: T,
        nodeMap?: Record<string, T>,
        parentMap?: Record<string, string[]>
    ) {
        this.nodeMap = nodeMap ?? { [root.id]: root };
        this.parentMap = parentMap ?? {  };
    }



    public getNodes(): T[] { return Object.values(this.nodeMap); }

    public hasNode(id: string): boolean { return id in this.nodeMap; }
    public getNode(id: string): T { return this.nodeMap[id]; }

    public getNodeParent(id: string): T | undefined {
        const parentEntry = Object.entries(this.parentMap).find(([_, children]) => children.includes(id));
        return parentEntry && this.nodeMap[parentEntry[0]];
    }

    public getTraversedRange(fromId: string, toId: string): T[] {
        const parent = this.getNodeParent(fromId);
        if(!parent) {
            // `fromId` is the root node, so the range includes the full tree.
            return Object.values(this.nodeMap);
        }

        const siblings = this.parentMap[parent.id];
        const toIdIdx = siblings.indexOf(toId);
        if(toIdIdx) {
            // Every node in this range comes from the same parent.
            return siblings.slice(siblings.indexOf(fromId), toIdIdx + 1)
                // Exclude non-leaf nodes from this traversal.
                .filter((id) => !(id in this.parentMap))
                .map((id) => this.nodeMap[id]);
        }

        const startNode = this.nodeMap[fromId];
        const nodes = [ startNode ];
        // TODO: implement ranges the span multiple parent nodes.
        console.warn("Cannot range-select nodes from different directories yet");
        return nodes;
    }



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



    private toAntdTreeNode(t: T, options: AntdTreeConfig<T>): AntDTreeNode<T> {
        return {
            key: t.id,
            title: options.titleFn(t),
            isLeaf: options.isLeafFn(t),
            children: t.id in this.parentMap ?
                this.parentMap[t.id]
                    .map((id) => this.nodeMap[id])
                    .filter((c) => (options.filter && options.isLeafFn(c)) ? options.filter(c) : true)
                    .map((n) => this.toAntdTreeNode(n, options)) :
                undefined,
            data: t
        };
    }
    public toAntdTree(options: AntdTreeConfig<T>): AntDTreeNode<T> {
        return this.toAntdTreeNode(this.root, options);
    }
}

export class FileTree extends ImmutableTree<FileEntryBasicFragment> {
    protected constructor(
        root: FileEntryBasicFragment,
        nodeMap: Record<string, FileEntryBasicFragment>,
        parentMap: Record<string, string[]>,
        protected readonly locations: LocationCompleteFragment[],
        /** Map from locationId to FileEntry */
        protected readonly locationMap: Record<string, FileEntryBasicFragment[]>,
    ) {
        super(root, nodeMap, parentMap);
    }

    public static fromEntries(entries: FileEntryBasicFragment[]): FileTree {
        let rootIndex = -1;
        const nodeMap: Record<string, FileEntryBasicFragment> = {};
        const parentMap: Record<string, string[]> = {};
        const locations: LocationCompleteFragment[] = [];
        const locationMap: Record<string, FileEntryBasicFragment[]> = {};

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

            const loc = entry.metadata?.location;
            if(!loc) { continue; }

            if(!(loc.id in locationMap)) {
                locations.push(loc);
                locationMap[loc.id] = [];
            }

            locationMap[loc.id].push(entry);
        }
        if(rootIndex < 0) {
            throw new Error("Could not find root file entry");
        }
        const root = entries[rootIndex];

        return new FileTree(root, nodeMap, parentMap, locations, locationMap);
    }



    public getLocations() { return this.locations; }
    public getFilesAtLocation(locId: string) { return this.locationMap[locId]; }



    public updateNode(file: FileEntryBasicFragment): FileTree {
        const oldFile = this.nodeMap[file.id];

        const locations = [ ...this.locations ];
        const locationMap = { ...this.locationMap };

        // Functions for handling locations changes.
        const removeFileFromLocation = (locationId: string) => {
            if(!(locationId in locationMap)) { return; }
            if(locationMap[locationId].length <= 1) {
                delete locationMap[locationId];
                const locationIndex = locations.findIndex((l) => l.id === locationId);
                if(locationIndex >= 0) {
                    locations.splice(locationIndex, 1);
                }
            } else {
                const fileIndex = locationMap[locationId].findIndex((f) => f.id === file.id);
                locationMap[locationId].splice(fileIndex, 1);
            }
        };
        const addFileToLocation = (location: LocationCompleteFragment) => {
            if(location.id in locationMap) {
                locationMap[location.id].push(file);
            } else {
                locationMap[location.id] = [ file ];
                locations.push(location);
            }
        };

        // Check if locations need to be updated.
        if(file.metadata?.location && !oldFile.metadata?.location) {
            // Location is first assigned.
            addFileToLocation(file.metadata.location);
        } else if(file.metadata?.location && oldFile.metadata?.location) {
            // Files present in both. Check if it changed.
            if(file.metadata.location.id !== oldFile.metadata.location.id) {
                removeFileFromLocation(oldFile.metadata.location.id);
                addFileToLocation(file.metadata.location);
            }
        } else if(!file.metadata?.location && oldFile.metadata?.location) {
            // Location removed
            removeFileFromLocation(oldFile.metadata.location.id);
        }

        return new FileTree(
            file.id === this.root.id ? file : this.root,
            { ...this.nodeMap, [file.id]: file },
            { ...this.parentMap },
            locations,
            locationMap
        );
    }
}
