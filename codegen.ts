import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/generated/schema.graphql",
  documents: "./src/lib/graphql/**/*.graphql",
  ignoreNoDocuments: true,
  generates: {
    "./src/generated/graphql.ts": {
      plugins: ["typescript-operations", "typed-document-node"],
      config: {
        strictScalars: true,
        useTypeImports: true,
        enumsAsTypes: true,
        scalars: {
          DateTime: "string",
          BigInt: "string",
          Json: "Record<string, unknown>",
          Object: "Record<string, unknown>",
          ID: "string",
        },
      },
    },
  },
};

// oxlint-disable-next-line import/no-default-export
export default config;
