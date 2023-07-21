"use client";

import { ApolloProvider } from "@apollo/client";
import { InteractionType } from "@azure/msal-browser";
import { useMsal, useMsalAuthentication } from "@azure/msal-react";
import { App, Layout } from "antd";
import { useEffect, useState } from "react";

import { AppNavbar } from "./AppNavbar";
import { createApolloClient } from "@/lib/apollo";
import { loginRequest } from "@/lib/auth";
import type { LayoutProps } from "@/utils/layout";




export function AppLayout({ children }: LayoutProps) {
    const msal = useMsal();
    const account = msal.accounts[0];
    if(!account) {
        throw new Error("No azure accounts logged in!");
    }

    const auth = useMsalAuthentication(InteractionType.Redirect, loginRequest, account);
    const [token, setToken] = useState<string | undefined>(auth.result?.idToken);

    useEffect(() => {
        if(token) { return; }
        auth.acquireToken(InteractionType.Silent, loginRequest).then((res) => setToken(res?.accessToken));
    }, [auth, token]);

    if(!token) { return <></>; }

    const apolloClient = createApolloClient(token);

    return (
        <ApolloProvider client={apolloClient}>
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
        </ApolloProvider>
    );
}
