"use client";

import { Layout, Typography } from "antd";
import { useState } from "react";

import { FileBrowser } from "@/components/FileBrowser";
import { Map } from "@/components/Map";
import { RelationBrowser } from "@/components/RelationBrowser";



export default function HomePage() {
    const [fileBrowserCollapsed, setFileBrowserCollapsed] = useState(true);
    const [relationBrowserCollapsed, setRelationBrowserCollapsed] = useState(true);

    return <Layout hasSider className="h-full">
        <Layout.Sider
            collapsible
            collapsed={fileBrowserCollapsed}
            onCollapse={setFileBrowserCollapsed}
            theme="light"
        >
            {fileBrowserCollapsed ?
                <Typography.Title
                    level={2}
                    className="rotate-90 whitespace-nowrap mt-10"
                >
                    File Browser
                </Typography.Title> :
                <FileBrowser/>
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
