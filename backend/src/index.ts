require("module-alias/register");

import { ApolloServer, ContextFunction } from "@apollo/server";
import { ExpressContextFunctionArgument, expressMiddleware } from "@apollo/server/express4";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";

import { schema } from "./graphql";
import type { Context } from "./graphql/context";
import { GraphQLError } from "graphql";



const PORT = parseInt(process.env.PORT ?? "3001");



type ContextFn = (prismaClient: PrismaClient) => ContextFunction<[ExpressContextFunctionArgument], Context>;

const prodContext: ContextFn = (prisma) =>(async ({ req }) => {
    const auth = req.headers.authorization;

    if(!auth) {
        throw new GraphQLError("Unauthorized Request", {
            extensions: {
                code: "UNAUTHENTICATED",
                http: { status: 401 }
            }
        });
    }
    const token = auth.split(" ")[1];
    if(!token) {
        throw new GraphQLError("Malformed Authorization", {
            extensions: {
                code: "UNAUTHENTICATED",
                http: { status: 400 }
            }
        });
    }

    return { prisma, token };
});
const devContext: ContextFn = (prisma) =>(async () => {
    return { prisma, token: "" };
});



(async function main() {
    const app = express();

    app.disable("x-powered-by");

    const prismaClient = new PrismaClient();

    const apolloServer = new ApolloServer<Context>({ schema });
    // This does NOT block the thread, and must be called prior to mounting it on the Express app.
    await apolloServer.start();

    app.use(
        "/api/graphql",
        express.json(),
        expressMiddleware(apolloServer, {
            context: process.env.NODE_ENV === "production" ? prodContext(prismaClient) : devContext(prismaClient)
        })
    );



    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}...`);
    });
})()
    .catch((err) => {
        console.error(err);
    });
