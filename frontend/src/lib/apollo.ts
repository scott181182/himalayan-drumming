import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";



export function createApolloClient(token: string) {
    if(!process.env.NEXT_PUBLIC_API_ROOT_ENDPOINT) {
        throw new Error("Could not find GraphQL API route!");
    }

    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: process.env.NEXT_PUBLIC_API_ROOT_ENDPOINT + "/graphql",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    });
}
