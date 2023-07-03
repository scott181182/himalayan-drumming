
import type { TreeDataNode } from "antd";
import { Tree } from "antd";



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
