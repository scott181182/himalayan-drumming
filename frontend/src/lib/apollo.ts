import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";



export function createApolloClient(token: string) {
    const rootEndpoint = process.env.NEXT_PUBLIC_API_ROOT_ENDPOINT ?? "/api";

    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: rootEndpoint + "/graphql",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    });
}
