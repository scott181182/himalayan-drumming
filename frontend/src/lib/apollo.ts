import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";



export function createApolloClient(token: string) {
    const api_root = process.env.NEXT_PUBLIC_API_ROOT_ENDPOINT || "/api";

    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: api_root + "/graphql",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    });
}
