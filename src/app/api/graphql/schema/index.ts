import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { Document as DMMF } from "@prisma/dmmf";
import type { GraphQLSchema } from "graphql";

import { filesPlugin } from "./files";
import { generateSchema } from "./generator";
import { schema } from "@/generated/zenstack/schema";

// oxlint-disable-next-line unicorn/prefer-import-meta-properties
const FILEPATH = fileURLToPath(import.meta.url);
const PRISMA_DMMF_PATH = path.resolve(
  FILEPATH,
  "..",
  "..",
  "..",
  "..",
  "..",
  "generated",
  "dmmf.json",
);

export async function createSchema(): Promise<GraphQLSchema> {
  const dmmfRaw = await readFile(PRISMA_DMMF_PATH, "utf8");
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const dmmf = JSON.parse(dmmfRaw) as DMMF;

  return generateSchema({
    dmmf,
    zenSchema: schema,
    plugins: [filesPlugin],
    query: {
      omitModels: ["Tag"],
      extra: (t) => ({
        tags: t.stringList({
          nullable: false,
          resolve: (_root, _args, ctx) =>
            ctx.db.tag.findMany().then((tags) => tags.map((tag) => tag.name)),
        }),
        castes: t.stringList({
          nullable: false,
          resolve: (_root, _args, ctx) =>
            ctx.db.caste.findMany().then((castes) => castes.map((caste) => caste.name)),
        }),
        genders: t.stringList({
          nullable: false,
          resolve: (_root, _args, ctx) =>
            ctx.db.gender.findMany().then((genders) => genders.map((gender) => gender.name)),
        }),
      }),
    },
  });
}
