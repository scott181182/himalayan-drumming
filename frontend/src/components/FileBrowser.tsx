
import type { TreeDataNode } from "antd";
import { Tree } from "antd";



const APP_DRIVE_ID = "b!PdaO42V9RUmFElWpViyytFdVIGOuCpVClLAJG1HQ_Z7YTK-gU5uKT4Fxeg0iXwKP";
const APP_FOLDER_ID = "01COUOXFJUKYDPF6HWKBELMEHVODWE6DSA";
const APP_FOLDER_URL = `https://graph.microsoft.com/v1.0/drives/${APP_DRIVE_ID}/items/${APP_FOLDER_ID}`;

export function FileBrowser() {
    const files: TreeDataNode[] = [
        { key: "tst", title: "Test.docx" }
    ];

    return <div className="h-40">
        <Tree
            treeData={files}
        />
    </div>;

}
