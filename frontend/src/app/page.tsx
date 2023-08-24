"use client";

import { Layout, Skeleton, Typography } from "antd";
import dynamic from "next/dynamic";
import { useState } from "react";

import { DashboardProvider } from "@/components/DashboardContext";
import { EnumProvider } from "@/components/EnumContext";
import { FileBrowser } from "@/components/FileBrowser";
import { RelationBrowser } from "@/components/RelationBrowser";

// Load map dynamically to avoid Next13 prerender errors.
const Map = dynamic(() => import("@/components/map").then((mod) => mod.Map), {
    loading: () => <Skeleton/>,
    ssr: false
});



export default function HomePage() {
    const [fileBrowserCollapsed, setFileBrowserCollapsed] = useState(true);
    const [relationBrowserCollapsed, setRelationBrowserCollapsed] = useState(true);



    return (
        <EnumProvider>
            <DashboardProvider>
                <Layout hasSider className="h-full">
                    <Layout.Sider
                        collapsible
                        collapsed={fileBrowserCollapsed}
                        onCollapse={setFileBrowserCollapsed}
                        theme="light"
                        width="35%"
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
                        width="20%"
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
                </Layout>
            </DashboardProvider>
        </EnumProvider>
    );
}
