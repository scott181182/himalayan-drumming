


export interface TreeNode<T> {
    value: T;
    id: string;
    children: TreeNode<T>[];
}

export interface MergeTreeOptions<T, U> {
    idFn?: (node: TreeNode<T> | TreeNode<U>) => string;

    onNew: (node: TreeNode<T>, parent: TreeNode<U>) => Promise<unknown>;
    onExisting: (newNode: TreeNode<T>, oldNode: TreeNode<U>, parent: TreeNode<U>) => Promise<unknown>;
    onOld: (node: TreeNode<U>) => Promise<unknown>;
}



export function diffObject<T, U, TK extends keyof T, UK extends keyof U>(oldObj: T, newObj: U, keys: [TK, UK][]): { [Key in TK]?: T[Key] } | undefined {
    const diffObj: { [Key in TK]?: T[Key] } = {};

    for(const [tkey, ukey] of keys) {
        if(!oldObj[tkey] && !newObj[ukey]) { continue; }
        if(oldObj[tkey] as unknown !== newObj[ukey]) { diffObj[tkey] = newObj[ukey] as unknown as T[typeof tkey]; }
    }

    if(Object.keys(diffObj).length > 0) {
        return diffObj;
    }
}

export async function mergeTrees<T, U>(newTree: TreeNode<T>, oldTree: TreeNode<U>, options: MergeTreeOptions<T, U>) {
    if(newTree.children.length === 0) { return; }

    if(oldTree.children.length === 0) {
        for(const child of newTree.children) {
            await options.onNew(child, oldTree);
        }

        return;
    }

    /**
     * Keeps track of nodes in the old tree that DON'T have a corresponding node in the new tree.
     * This will be used to delete nodes that no longer exist.
     */
    const unseenNodes = new Map(oldTree.children.map((oldChild) => [options.idFn ? options.idFn(oldChild) : oldChild.id, oldChild]));

    for(const newChild of newTree.children) {
        const newChildId = options.idFn ? options.idFn(newChild) : newChild.id;
        const oldChild = unseenNodes.get(newChildId);

        if(!oldChild) {
            await options.onNew(newChild, oldTree);
        } else {
            unseenNodes.delete(newChildId);

            await options.onExisting(newChild, oldChild, oldTree);
            await mergeTrees(newChild, oldChild, options);
        }
    }
    for(const unseenChild of unseenNodes.values()) {
        await options.onOld(unseenChild);
    }
}
