import path from "path";

import { makeSchema } from "nexus";

import * as types from "./schema";



export const schema = makeSchema({
    types,
    outputs: {
        typegen: path.resolve(__dirname, "..", "..", "nexus-typegen.d.ts"),
        schema: path.resolve(__dirname, "..", "..", "schema.graphql"),
    },
    sourceTypes: {
        modules: [
            {
                module: path.resolve(__dirname, "..", "..", "node_modules", ".prisma", "client", "index.d.ts"),
                alias: "prisma"
            }
        ]
    },
    contextType: {
        module: path.join(__dirname, "context.ts"),
        export: "Context",
    },
    shouldGenerateArtifacts: process.env.NEXUS_GEN === "1"
});
