// oxlint-disable unicorn/prefer-top-level-await
import { writeFile } from "node:fs/promises";

import { printSchemaWithDirectives } from "@graphql-tools/utils";

import { createSchema } from "@/app/api/graphql/schema";

async function generateSchemaSdl() {
  const graphQlSchema = await createSchema();
  const schemaSdl = printSchemaWithDirectives(graphQlSchema);

  await writeFile("src/generated/schema.graphql", schemaSdl, "utf8");
}

generateSchemaSdl()
  // oxlint-disable-next-line promise/always-return
  .then(() => {
    console.log("Done");
  })
  .catch((error) => {
    console.error(error);
  });
