require("module-alias/register");

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

    app.use(cors({
        origin: "http://localhost:3000"
    }));
    app.use(
        "/api/graphql",
        express.json(),
        expressMiddleware(apolloServer, {
            context: async ({ req, res }) => {
                const auth = req.headers.authorization;

                if(!auth) {
                    res.status(401).json({
                        status: "error",
                        reason: "Expected Authorization header with Bearer token"
                    });
                    throw new Error("Unauthorized Request");
                }
                const token = auth.split(" ")[1];
                if(!token) {
                    res.status(400).json({
                        status: "error",
                        reason: "Malformed Authorization header"
                    });
                    throw new Error("Malformed Authorization");
                }

                return {
                    prisma: prismaClient,
                    token
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
