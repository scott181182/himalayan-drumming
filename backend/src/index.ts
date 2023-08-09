require("module-alias/register");

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { PrismaClient } from "@prisma/client";
import axios, { AxiosError } from "axios";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
// import proxy from "express-http-proxy";

import { schema } from "./graphql";
import type { Context } from "./graphql/context";
import { APP_DRIVE_ID } from "./lib/onedrive";



const PORT = parseInt(process.env.PORT ?? "3001");

(async function main() {
    const app = express();

    app.disable("x-powered-by");

    const prismaClient = new PrismaClient();

    const apolloServer = new ApolloServer<Context>({ schema });
    // This does NOT block the thread, and must be called prior to mounting it on the Express app.
    await apolloServer.start();

    app.use(cors({
        origin: "http://localhost:3000",
        credentials: true
    }));
    app.use(cookieParser());

    app.use("/api/onedrive/:itemId/:content?", async (req, res) => {
        const endpoint = req.params.content ? `${req.params.itemId}/${req.params.content}` : req.params.itemId;
        const url = `https://graph.microsoft.com/v1.0/drives/${APP_DRIVE_ID}/items/${endpoint}`;
        const token = req.cookies["MSAL_TOKEN"];

        try {
            const pRes = await axios.get(url, {
                headers: {
                    ...req.headers,
                    Host: "graph.microsoft.com",
                    Authorization: `Bearer ${token}`
                },
                responseType: "stream"
            });

            for(const [ header, value ] of Object.entries(pRes.headers)) {
                res.setHeader(header, value);
            }
            pRes.data.pipe(res);
        } catch(err) {
            console.error("An error occurred requesting resources from OneDrive");
            if(err instanceof AxiosError) {
                console.error(err.message)
            } else {
                console.error(err)
            }

            return res.status(500).send();
        }
    }
    // proxy(`https://graph.microsoft.com`, {
    //     proxyReqPathResolver: (req) => {
    //         const endpoint = req.params.content ? `${req.params.itemId}/${req.params.content}` : req.params.itemId;
    //         return `/v1.0/drives/${APP_DRIVE_ID}/items/${endpoint}`;
    //     },
    //     proxyReqOptDecorator: (opts, req) => {
    //         const token = req.cookies["MSAL_TOKEN"];

    //         if(opts.headers) {
    //             opts.headers["Authorization"] = `Bearer ${token}`;
    //         } else {
    //             opts.headers = { "Authorization": `Bearer ${token}` };
    //         }

    //         return opts;
    //     }
    // })
    );
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

                res.cookie("MSAL_TOKEN", token, {
                    // domain: "localhost:3001",
                    maxAge: 1000 * 60 * 60 * 8,
                    path: "/api",
                    sameSite: "none",
                    secure: true,
                    httpOnly: true
                });

                return {
                    prisma: prismaClient,
                    token
                };
            },

        })
    );



    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}...`);
    });
})()
    .catch((err) => {
        console.error(err);
    });
