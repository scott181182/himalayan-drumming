"use client";

import { useQuery } from "@apollo/client";
import { Layout, Typography } from "antd";
import { useCallback, useState } from "react";

import { AsyncData } from "@/components/AsyncData";
import { FileBrowser } from "@/components/FileBrowser";
import { Map } from "@/components/Map";
import { RelationBrowser } from "@/components/RelationBrowser";
import type { FileEntryBasicFragment} from "@/generated/graphql";
import { GetAllFileEntriesDocument } from "@/generated/graphql";
import type { ImmutableTree} from "@/utils/tree";
import { fileEntries2tree } from "@/utils/tree";



export default function HomePage() {
    const [fileBrowserCollapsed, setFileBrowserCollapsed] = useState(true);
    const [relationBrowserCollapsed, setRelationBrowserCollapsed] = useState(true);

    const [fileTree, setFileTree] = useState<ImmutableTree<FileEntryBasicFragment> | undefined>();
    const [selectedFile, setSelectedFile] = useState<FileEntryBasicFragment | undefined>();

    const onSelect = useCallback((id: string | undefined) => {
        const file = (id && fileTree?.hasNode(id)) ? fileTree.getNode(id) : undefined;
        setSelectedFile(file);
    }, [fileTree]);

    const { loading, error } = useQuery(GetAllFileEntriesDocument, {
        onCompleted(data) {
            setFileTree(fileEntries2tree(data.fileEntries));
        },
    });



    return <Layout hasSider className="h-full">
        <Layout.Sider
            collapsible
            collapsed={fileBrowserCollapsed}
            onCollapse={setFileBrowserCollapsed}
            theme="light"
            width="25%"
        >
            {fileBrowserCollapsed ?
                <Typography.Title
                    level={2}
                    className="rotate-90 whitespace-nowrap mt-10"
                >
                    File Browser
                </Typography.Title> :
                <AsyncData
                    data={fileTree}
                    loading={loading}
                    error={error}
                >
                    {(tree) => <FileBrowser
                        fileTree={tree}
                        selectedFile={selectedFile}
                        onSelect={onSelect}
                    />}
                </AsyncData>
            }
        </Layout.Sider>
        <Layout.Content className="relative">
            <Map/>
        </Layout.Content>
        <Layout.Sider
            collapsible
            collapsed={relationBrowserCollapsed}
            onCollapse={setRelationBrowserCollapsed}
            theme="light"
            reverseArrow
        >
            {relationBrowserCollapsed ?
                <Typography.Title
                    level={2}
                    className="rotate-90 whitespace-nowrap mt-10"
                >
                    Relation Browser
                </Typography.Title> :
                <RelationBrowser/>
            }
        </Layout.Sider>
    </Layout>;
}
