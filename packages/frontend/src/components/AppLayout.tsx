"use client";

import { ApolloProvider } from "@apollo/client";
import { App, Layout } from "antd";

import { AppNavbar } from "./AppNavbar";
import { createApolloClient } from "@/lib/apollo";
import type { LayoutProps } from "@/utils/layout";




export function AppLayout({ children }: LayoutProps) {
    const apolloClient = createApolloClient();

    return (
        <ApolloProvider client={apolloClient}>
            <App>
                <Layout className="h-screen">
                    <Layout.Header>
                        <AppNavbar />
                    </Layout.Header>
                    <Layout.Content>
                        {children}
                    </Layout.Content>
                </Layout>
            </App>
        </ApolloProvider>
    );
}
