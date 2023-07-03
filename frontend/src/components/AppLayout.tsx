"use client";

import { App, Layout } from "antd";

import { AppNavbar } from "./AppNavbar";
import { LayoutProps } from "@/utils/layout";



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
