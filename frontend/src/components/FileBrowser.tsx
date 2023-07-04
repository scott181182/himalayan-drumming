

import { LoadingOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import type { TreeDataNode } from "antd";
import { Alert, Tree } from "antd";
import { useMemo } from "react";

import type { FileEntryBasicFragment} from "@/generated/graphql";
import { GetRootFileEntryDocument } from "@/generated/graphql";



const APP_DRIVE_ID = "b!PdaO42V9RUmFElWpViyytFdVIGOuCpVClLAJG1HQ_Z7YTK-gU5uKT4Fxeg0iXwKP";
const APP_FOLDER_ID = "01COUOXFJUKYDPF6HWKBELMEHVODWE6DSA";
const APP_FOLDER_URL = `https://graph.microsoft.com/v1.0/drives/${APP_DRIVE_ID}/items/${APP_FOLDER_ID}`;



function fileEntry2TreeNode(entry: FileEntryBasicFragment & { children?: FileEntryBasicFragment[] | null }): TreeDataNode {
    return {
        key: entry.id,
        title: entry.name,
        children: entry.children?.map(fileEntry2TreeNode)
    };
}


export function FileBrowser() {
    console.log("Sending query...");
    const { data, loading, error } = useQuery(GetRootFileEntryDocument);
    console.log("Query sent!");


    const files: TreeDataNode[] = useMemo(() => data?.rootFileEntry ? [
        fileEntry2TreeNode(data?.rootFileEntry)
    ] : [], [data]);

    if(loading) {
        return <LoadingOutlined spin/>;
    } else if(error) {
        console.error(error);
        return <Alert type="error" message="Apollo Error!"/>;
    }

    return <div className="h-40">
        <Tree
            treeData={files}
        />
    </div>;

}
