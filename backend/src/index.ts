import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";

import { schema } from "./graphql";
import type { Context } from "./graphql/context";



const PORT = parseInt(process.env.PORT ?? "3001");

(async function main() {
    const app = express();

    const prismaClient = new PrismaClient();

    const apolloServer = new ApolloServer<Context>({ schema });
    // This does NOT block the thread, and must be called prior to mounting it on the Express app.
    await apolloServer.start();

    app.use(
        "/api/graphql",
        cors<cors.CorsRequest>(),
        express.json(),
        expressMiddleware(apolloServer, {
            context: async ({ req }) => {
                console.log(req.cookies);

                return {
                    prisma: prismaClient
                };
            }
        })
    );



    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}...`);
    });
})()
    .catch((err) => {
        console.error(err);
    });
