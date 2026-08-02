export interface TreeNode<T> {
  value: T;
  id: string;
  children: TreeNode<T>[];
}

export interface MergeTreeOptions<T, U> {
  idFn?: (node: Readonly<TreeNode<T>> | Readonly<TreeNode<U>>) => string;

  onNew: (node: Readonly<TreeNode<T>>, parent: Readonly<TreeNode<U>>) => Promise<void>;
  onExisting: (
    newNode: Readonly<TreeNode<T>>,
    oldNode: Readonly<TreeNode<U>>,
    parent: Readonly<TreeNode<U>>,
  ) => Promise<void>;
  onOld: (node: Readonly<TreeNode<U>>) => Promise<void>;
}

export function diffObject<T, U, TK extends keyof T>(
  oldObj: T,
  newObj: U,
  keys: readonly Readonly<[TK, keyof U]>[],
): { [Key in TK]?: T[Key] } | undefined {
  const diffObj: { [Key in TK]?: T[Key] } = {};

  for (const [tkey, ukey] of keys) {
    if (!oldObj[tkey] && !newObj[ukey]) {
      continue;
    }
    if ((oldObj[tkey] as unknown) !== newObj[ukey]) {
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      diffObj[tkey] = newObj[ukey] as unknown as T[typeof tkey];
    }
  }

  if (Object.keys(diffObj).length > 0) {
    return diffObj;
  }

  return undefined;
}

export async function mergeTrees<T, U>(
  newTree: Readonly<TreeNode<T>>,
  oldTree: Readonly<TreeNode<U>>,
  options: Readonly<MergeTreeOptions<T, U>>,
) {
  if (newTree.children.length === 0) {
    return;
  }

  if (oldTree.children.length === 0) {
    for (const child of newTree.children) {
      await options.onNew(child, oldTree);
    }

    return;
  }

  /**
   * Keeps track of nodes in the old tree that DON'T have a corresponding node in the new tree.
   * This will be used to delete nodes that no longer exist.
   */
  const unseenNodes = new Map(
    oldTree.children.map((oldChild) => [
      options.idFn ? options.idFn(oldChild) : oldChild.id,
      oldChild,
    ]),
  );

  for (const newChild of newTree.children) {
    const newChildId = options.idFn ? options.idFn(newChild) : newChild.id;
    const oldChild = unseenNodes.get(newChildId);

    if (oldChild) {
      unseenNodes.delete(newChildId);

      await options.onExisting(newChild, oldChild, oldTree);
      await mergeTrees(newChild, oldChild, options);
    } else {
      await options.onNew(newChild, oldTree);
    }
  }
  for (const unseenChild of unseenNodes.values()) {
    await options.onOld(unseenChild);
  }
}
