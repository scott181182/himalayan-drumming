require("module-alias/register");

import path from "node:path";

import type { ContextFunction } from "@apollo/server";
import { ApolloServer } from "@apollo/server";
import type { ExpressContextFunctionArgument } from "@apollo/server/express4";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import fileUpload from "express-fileupload";
import { GraphQLError } from "graphql";
import { makeAuth } from "himalayan-drumming-research-auth";
import type { PrismaClient } from "himalayan-drumming-research-database";
import { createPrismaClient } from "himalayan-drumming-research-database";

import { authGuardMiddleware } from "./auth";
import { AVATAR_ROOT, FILE_ROOT } from "./config";
import { schema } from "./graphql";
import type { Context } from "./graphql/context";
import { odTree2prismaCreateInput } from "@/lib/scan";



const PORT = parseInt(process.env.PORT ?? "3001");



type ContextFn = (prismaClient: PrismaClient) => ContextFunction<[ExpressContextFunctionArgument], Context>;

const makeContext: ContextFn = (prisma) => (async ({ res }) => {
    if (!res.locals.user) {
        throw new GraphQLError("Unauthorized Request", {
            extensions: {
                code: "UNAUTHENTICATED",
                http: { status: 401 }
            }
        });
    }

    return { prisma, user: res.locals.user };
});



(async function main() {
    const app = express();

    app.disable("x-powered-by");

    const prismaClient = createPrismaClient({
        connectionString: process.env.DATABASE_URL
    });
    const auth = makeAuth(prismaClient);

    app.use((_req, res, next) => {
        res.locals.auth = auth;
        next();
    });
    app.get("/api/status", (_req, res) => {
        res.json({ status: "ok" });
    });

    const apolloServer = new ApolloServer<Context>({ schema });
    // This does NOT block the thread, and must be called prior to mounting it on the Express app.
    await apolloServer.start();

    app.use(
        "/api/graphql",
        authGuardMiddleware,
        express.json(),
        expressMiddleware(apolloServer, { context: makeContext(prismaClient) })
    );

    const fileUploadConfig: fileUpload.Options = {
        preserveExtension: true,
        limits: {
            fileSize: 8_000_000 // 8 MB
        }
    };


    app.post(
        "/api/files/:parentId/children",
        authGuardMiddleware,
        fileUpload(fileUploadConfig),
        async (req, res) => {
            const parentId = req.params.parentId;
            if (!parentId) { return res.status(404).send(); }

            const file = req.files?.file;
            if (!file) {
                return res.status(400).json({ status: "error", reason: "No file in request" });
            }
            if (Array.isArray(file)) {
                return res.status(400).json({ status: "error", reason: "Only one file allowed for upload" });
            }

            const parent = await prismaClient.fileEntry.findUnique({
                where: { id: parentId }
            });
            if (!parent) {
                return res.status(404).json({ status: "error", reason: "Could not find parent directory" });
            }
            if (parent?.type !== "directory") {
                return res.status(400).json({ status: "error", reason: "Can only upload files underneath directories" });
            }

            const vPath = path.join(parent.path, file.name);
            const fileDestFull = path.join(FILE_ROOT, vPath);
            // TODO: check if file already exists

            file.mv(fileDestFull, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ status: "error", reason: "There was an error uploading the file" });
                } else {
                    const fileCreateInput = odTree2prismaCreateInput(
                        {
                            id: vPath,
                            value: {
                                name: file.name,
                                path: vPath,
                                type: "file"
                            },
                            children: []
                        },
                        parent.id
                    );

                    prismaClient.fileEntry.create({
                        data: fileCreateInput
                    }).then(() => {
                        res.status(200).json({ status: "success" });
                    }).catch((gerr) => {
                        console.error(gerr);
                        res.status(500).json({ status: "error", reason: "There was an error updating the person record" });
                    });
                }
            });
        }
    );

    app.put(
        "/api/people/:id/avatar",
        authGuardMiddleware,
        fileUpload(fileUploadConfig),
        (req, res) => {
            const personId = req.params.id;
            if (!personId) { return res.status(404).send(); }

            const image = req.files?.image;
            if (!image) {
                return res.status(400).json({ status: "error", reason: "No image in request" });
            }
            if (Array.isArray(image)) {
                return res.status(400).json({ status: "error", reason: "Only one image allowed for upload" });
            }

            const imageExt = image.name.slice(image.name.lastIndexOf(".") + 1);
            const avatarFilename = `${personId}.${imageExt}`;
            image.mv(path.join(AVATAR_ROOT, avatarFilename), (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ status: "error", reason: "There was an error uploading the file" });
                } else {
                    prismaClient.person.update({
                        where: { id: personId },
                        data: {
                            avatarUrl: `/blob/avatars/${avatarFilename}`
                        }
                    }).then(() => {
                        res.status(200).json({ status: "success" });
                    }).catch((gerr) => {
                        console.error(gerr);
                        res.status(500).json({ status: "error", reason: "There was an error updating the person record" });
                    });
                }
            });
        }
    );



    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}...`);
    });
})()
    .catch((err) => {
        console.error(err);
    });
