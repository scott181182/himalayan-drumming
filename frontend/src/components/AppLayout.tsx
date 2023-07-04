"use client";

import { ApolloProvider } from "@apollo/client";
import type { EventMessage, AuthenticationResult } from "@azure/msal-browser";
import { InteractionType , PublicClientApplication, EventType } from "@azure/msal-browser";
import { MsalProvider, MsalAuthenticationTemplate } from "@azure/msal-react";
import { App, Layout } from "antd";
import { useEffect, useState } from "react";

import { AppNavbar } from "./AppNavbar";
import { createApolloClient } from "@/lib/apollo";
import { loginRequest, msalConfig } from "@/lib/auth";
import type { LayoutProps } from "@/utils/layout";



const pca = new PublicClientApplication(msalConfig);



export function AppLayout({ children }: LayoutProps) {

    const accounts = pca.getAllAccounts();
    if (accounts.length > 0) {
        pca.setActiveAccount(accounts[0]);
    } else {
        console.warn("No Azure accounts logged in");
    }

    pca.addEventCallback((event: EventMessage) => {
        if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
            const payload = event.payload as AuthenticationResult;
            pca.setActiveAccount(payload.account);
        }
    });

    // TODO: consider using `pca.setNavigationClient()` for Next-based routing from MSAL.

    const [token, setToken] = useState<string | undefined>();
    useEffect(() => {
        pca.acquireTokenSilent(loginRequest).then((res) => setToken(res.accessToken));
    });

    if(!token) { return <></>; }
    const apolloClient = createApolloClient(token);

    return (
        <MsalProvider instance={pca}>
            <ApolloProvider client={apolloClient}>
                <App>
                    <MsalAuthenticationTemplate
                        interactionType={InteractionType.Redirect}
                        authenticationRequest={loginRequest}
                    >
                        <Layout className="h-screen">
                            <Layout.Header>
                                <AppNavbar/>
                            </Layout.Header>
                            <Layout.Content>
                                {children}
                            </Layout.Content>
                        </Layout>
                    </MsalAuthenticationTemplate>
                </App>
            </ApolloProvider>
        </MsalProvider>
    );
}
