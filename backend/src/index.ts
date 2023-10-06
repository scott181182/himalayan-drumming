require("module-alias/register");

import path from "node:path";

import type { ContextFunction } from "@apollo/server";
import { ApolloServer } from "@apollo/server";
import type { ExpressContextFunctionArgument} from "@apollo/server/express4";
import { expressMiddleware } from "@apollo/server/express4";
import { PrismaClient } from "@prisma/client";
import express from "express";
import fileUpload from "express-fileupload";
import { GraphQLError } from "graphql";

import { schema } from "./graphql";
import type { Context } from "./graphql/context";
import { odTree2prismaCreateInput } from "./lib/scan";



const PORT = parseInt(process.env.PORT ?? "3001");
const FILE_DIR = "/workspace/blob/files";
const AVATAR_DIR = "/workspace/blob/avatars";



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



    app.post(
        "/api/files/:parentId/children",
        fileUpload({ preserveExtension: true }),
        async (req, res) => {
            const parentId = req.params.parentId;
            if(!parentId) { return res.status(404).send(); }
            
            const file = req.files?.file;
            if(!file) {
                return res.status(400).json({ status: "error", reason: "No file in request" });
            }
            if(Array.isArray(file)) {
                return res.status(400).json({ status: "error", reason: "Only one file allowed for upload" });
            }

            const parent = await prismaClient.fileEntry.findUnique({
                where: { id: parentId }
            });
            if(!parent) {
                return res.status(404).json({ status: "error", reason: "Could not find parent directory" });
            }
            if(parent?.type !== "directory") {
                return res.status(400).json({ status: "error", reason: "Can only upload files underneath directories" });
            }

            const vPath = path.join(parent.path, file.name);
            const fileDestFull = path.join(FILE_DIR, vPath);
            // TODO: check if file already exists
            
            file.mv(fileDestFull, (err) => {
                if(err) {
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
        fileUpload({ preserveExtension: true }),
        (req, res) => {
            const personId = req.params.id;
            if(!personId) { return res.status(404).send(); }

            const image = req.files?.image;
            if(!image) {
                return res.status(400).json({ status: "error", reason: "No image in request" });
            }
            if(Array.isArray(image)) {
                return res.status(400).json({ status: "error", reason: "Only one image allowed for upload" });
            }

            const imageExt = image.name.slice(image.name.lastIndexOf(".") + 1);
            const avatarFilename = `${personId}.${imageExt}`;
            image.mv(path.join(AVATAR_DIR, avatarFilename), (err) => {
                if(err) {
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
