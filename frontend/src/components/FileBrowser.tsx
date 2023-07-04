

import { LoadingOutlined } from "@ant-design/icons";
import { useApolloClient, useQuery } from "@apollo/client";
import type { TreeDataNode } from "antd";
import { Alert, Button, Descriptions, Divider, Row, Space, Tree, Typography } from "antd";
import { useCallback, useMemo, useState } from "react";

import type { FileEntryBasicFragment} from "@/generated/graphql";
import { GetAllFileEntriesDocument, StartFullScanDocument } from "@/generated/graphql";
import type { ImmutableTree} from "@/utils/tree";
import { fileEntries2tree } from "@/utils/tree";



const APP_DRIVE_ID = "b!PdaO42V9RUmFElWpViyytFdVIGOuCpVClLAJG1HQ_Z7YTK-gU5uKT4Fxeg0iXwKP";
const APP_FOLDER_ID = "01COUOXFJUKYDPF6HWKBELMEHVODWE6DSA";
const APP_FOLDER_URL = `https://graph.microsoft.com/v1.0/drives/${APP_DRIVE_ID}/items/${APP_FOLDER_ID}`;




export function FileBrowser() {
    const apolloClient = useApolloClient();
    const [fileTree, setFileTree] = useState<ImmutableTree<FileEntryBasicFragment> | undefined>();

    const { loading, error } = useQuery(GetAllFileEntriesDocument, {
        onCompleted(data) {
            setFileTree(fileEntries2tree(data.fileEntries));
        },
    });

    const startFullScan = useCallback(() => {
        return apolloClient.mutate({
            mutation: StartFullScanDocument,
            refetchQueries: [ GetAllFileEntriesDocument ]
        });
    }, [apolloClient]);

    const [selectedFile, setSelectedFile] = useState<FileEntryBasicFragment | undefined>();


    const files = useMemo<TreeDataNode[]>(
        () => fileTree?.toAntdTree({
            titleFn: (t) => t.name,
            isLeafFn: (t) => t.type !== "directory"
        })?.children ?? [],
        [fileTree]
    );


    if(loading) {
        return <LoadingOutlined spin/>;
    } else if(error) {
        console.error(error);
        return <>
            <Alert type="error" message="Apollo Error!"/>
        </>;
    }

    return <div className="flex flex-col h-full gap-1">
        <Button onClick={() => startFullScan()} className="m-4">
            Full Scan
        </Button>
        <h3 className="ml-4 text-lg font-bold">Files</h3>
        <Tree
            treeData={files}
            className="flex-1"
            selectedKeys={selectedFile ? [ selectedFile.id ] : []}
            onSelect={(keys) => setSelectedFile(keys.length > 0 && fileTree?.hasNode(keys[0] as string) ? fileTree.getNode(keys[0] as string) : undefined)}
        />
        {selectedFile && <Descriptions title={selectedFile.name} className="p-4 border-t-2 border-t-black">

        </Descriptions>}
    </div>;

}
