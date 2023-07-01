"use client";

import { LayoutProps } from "@/utils/layout";
import { App, Layout } from "antd";
import { AppNavbar } from "./AppNavbar";



export function AppLayout({ children }: LayoutProps) {
    return (
        <App>
            <Layout className="h-screen">
                <Layout.Header>
                    <AppNavbar/>
                </Layout.Header>
                <Layout.Content>
                    {children}
                </Layout.Content>
            </Layout>
        </App>
    );
}
