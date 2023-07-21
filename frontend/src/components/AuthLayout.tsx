"use client";

import type { EventMessage, AuthenticationResult } from "@azure/msal-browser";
import { InteractionType , PublicClientApplication, EventType } from "@azure/msal-browser";
import { MsalProvider, MsalAuthenticationTemplate } from "@azure/msal-react";

import { loginRequest, msalConfig } from "@/lib/auth";
import type { LayoutProps } from "@/utils/layout";



const pca = new PublicClientApplication(msalConfig);



export function AuthLayout({ children }: LayoutProps) {
    const accounts = pca.getAllAccounts();
    if (accounts.length > 0) {
        pca.setActiveAccount(accounts[0]);
    } else {
        // console.warn("No Azure accounts logged in");
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
                {children}
            </MsalAuthenticationTemplate>
        </MsalProvider>
    );
}
