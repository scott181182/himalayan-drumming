


export interface TreeNode<T> {
    value: T;
    id: string;
    children: TreeNode<T>[];
}

export interface MergeTreeOptions<T, U> {
    onNew: (node: TreeNode<T>) => Promise<unknown>;
    onExisting: (newNode: TreeNode<T>, oldNode: TreeNode<U>) => Promise<unknown>;
    onOld: (node: TreeNode<U>) => Promise<unknown>;
}



export async function mergeTrees<T, U>(newTree: TreeNode<T>, oldTree: TreeNode<U>, options: MergeTreeOptions<T, U>) {
    if(newTree.children.length === 0) { return; }

    if(oldTree.children.length === 0) {
        for(const child of newTree.children) {
            await options.onNew(child);
        }

        return;
    }

    /**
     * Keeps track of nodes in the old tree that DON'T have a corresponding node in the new tree.
     * This will be used to delete nodes that no longer exist.
     */
    const unseenNodes = new Map(oldTree.children.map((oldChild) => [oldChild.id, oldChild]));

    for(const newChild of newTree.children) {
        const oldChild = unseenNodes.get(newChild.id);

        if(!oldChild) {
            await options.onNew(newChild);
        } else {
            unseenNodes.delete(oldChild.id);

            await options.onExisting(newChild, oldChild);
            await mergeTrees(newChild, oldChild, options);
        }
    }
    for(const unseenChild of unseenNodes.values()) {
        await options.onOld(unseenChild);
    }
}
