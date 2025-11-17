import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";



const GRAPHQL_ENDPOINT = typeof window === "undefined" ?
    (process.env.SSR_API_HOST ? `${process.env.SSR_API_HOST}/api/graphql` : "http://127.0.0.1:3001") :
    "/api/graphql";

export function createApolloClient() {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: GRAPHQL_ENDPOINT,
            credentials: "same-origin"
        })
    });
}
