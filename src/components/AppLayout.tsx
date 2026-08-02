"use client";

import { ApolloProvider } from "@apollo/client/react";
import { App, Layout } from "antd";
import type { PropsWithChildren } from "react";

import { AppNavbar } from "./AppNavbar";
import { createApolloClient } from "@/lib/apollo";

export function AppLayout({ children }: Readonly<PropsWithChildren>) {
  const apolloClient = createApolloClient();

  return (
    <ApolloProvider client={apolloClient}>
      <App>
        <Layout className="h-screen">
          <Layout.Header>
            <AppNavbar />
          </Layout.Header>
          <Layout.Content>{children}</Layout.Content>
        </Layout>
      </App>
    </ApolloProvider>
  );
}
