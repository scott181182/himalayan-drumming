import path from "path";

import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: path.resolve(__dirname, "..", "backend", "schema.graphql"),
    documents: "./src/lib/graphql/**/*.graphql",
    ignoreNoDocuments: true,
    generates: {
        "./src/generated/graphql.ts": {
            plugins: [
                "typescript",
                "typescript-operations",
                "typed-document-node"
            ]
        }
    }
};
export default config;
