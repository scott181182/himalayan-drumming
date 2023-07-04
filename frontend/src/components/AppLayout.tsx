"use client";

import type { EventMessage, AuthenticationResult, RedirectRequest} from "@azure/msal-browser";
import { InteractionType , PublicClientApplication, EventType } from "@azure/msal-browser";
import { MsalProvider, MsalAuthenticationTemplate } from "@azure/msal-react";
import { App, Layout } from "antd";

import { AppNavbar } from "./AppNavbar";
import { msalConfig } from "@/lib/auth";
import type { LayoutProps } from "@/utils/layout";



const loginRequest: RedirectRequest = {
    scopes: [
        "User.Read",
        "profile",
        "email",
        "Files.Read",
        "Files.Read.All",
        "Files.Read.Selected",
        "Sites.Read.All"
    ]
};
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
    return (
        <MsalProvider instance={pca}>
            <MsalAuthenticationTemplate
                interactionType={InteractionType.Redirect}
                authenticationRequest={loginRequest}
            >
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
            </MsalAuthenticationTemplate>
        </MsalProvider>
    );
}
