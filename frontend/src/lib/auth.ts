import type { Configuration, PopupRequest } from "@azure/msal-browser";

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
    auth: {
        clientId: "3fdd03ac-4be4-4995-8d5d-6d487ba3d40f",
        authority: "https://login.microsoftonline.com/f5222e6c-5fc6-48eb-8f03-73db18203b63",
        redirectUri: "/",
        postLogoutRedirectUri: "/"
    },
    system: {
        allowNativeBroker: false // Disables WAM Broker
    }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: PopupRequest = {
    scopes: [
        "User.Read",
        "profile",
        "email",
        "Files.Read",
        "Files.Read.All",
        "Files.ReadWrite",
        "Files.ReadWrite.All",
        "Files.Read.Selected",
        "Sites.Read.All"
    ]
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};
