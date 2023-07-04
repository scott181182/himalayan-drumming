

import { useApolloClient } from "@apollo/client";
import type { TreeDataNode } from "antd";
import { Button, Descriptions, Tree } from "antd";
import { useCallback, useMemo } from "react";

import type { FileEntryBasicFragment} from "@/generated/graphql";
import { GetAllFileEntriesDocument, StartFullScanDocument } from "@/generated/graphql";
import type { ImmutableTree} from "@/utils/tree";



export interface FileBrowserProps {
    fileTree: ImmutableTree<FileEntryBasicFragment>;
    selectedFile?: FileEntryBasicFragment
    onSelect?: (id: string | undefined) => void;
}

export function FileBrowser({
    fileTree,
    selectedFile,
    onSelect: _onSelect
}: FileBrowserProps) {
    const apolloClient = useApolloClient();

    const startFullScan = useCallback(() => {
        return apolloClient.mutate({
            mutation: StartFullScanDocument,
            refetchQueries: [ GetAllFileEntriesDocument ]
        });
    }, [apolloClient]);

    const onSelect = useCallback((keys: (string | number)[]) => {
        _onSelect?.(keys.length > 0 ? keys[0] as string : undefined);
    }, [_onSelect]);


    const files = useMemo<TreeDataNode[]>(
        () => fileTree.toAntdTree({
            titleFn: (t) => t.name,
            isLeafFn: (t) => t.type !== "directory"
        })?.children ?? [],
        [fileTree]
    );

    return <div className="flex flex-col h-full gap-1">
        <Button onClick={() => startFullScan()} className="m-4">
            Full Scan
        </Button>
        <h3 className="ml-4 text-lg font-bold">Files</h3>
        <Tree
            treeData={files}
            className="flex-1 overflow-y-auto"
            selectedKeys={selectedFile ? [ selectedFile.id ] : []}
            onSelect={onSelect}
        />
        {selectedFile && <Descriptions title={selectedFile.name} className="p-4 border-t-2 border-t-black">

        </Descriptions>}
    </div>;

}
