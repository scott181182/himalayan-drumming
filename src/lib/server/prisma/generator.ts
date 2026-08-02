import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { generatorHandler } from "@prisma/generator-helper";
import { z } from "zod";

const optionsSchema = z.object({
  pothosOutput: z.string(),
});

generatorHandler({
  onManifest: () => ({
    prettyName: "DMMF Export",
  }),
  onGenerate: async (options) => {
    const output = options.generator.output?.value;
    if (!output) {
      throw new Error("Output path is not specified in the generator configuration.");
    }
    const parsedOptions = optionsSchema.parse(options.generator.config);

    // Adapt the Pothos types for Zenstack (instead of Prisma);
    const pothosPath = path.resolve(
      options.generator.sourceFilePath,
      "..",
      parsedOptions.pothosOutput,
    );

    console.log(`Adapting Pothos types for Zenstack: ${pothosPath}`);
    const pothosRaw = await readFile(pothosPath, "utf8");
    const lastLineStart = pothosRaw.indexOf("export function getDatamodel");

    const pothosProcessed =
      `
import { QueryOptions, IncludeInput, SelectInput, OrderBy, WhereInput, WhereUniqueInput } from "@zenstackhq/orm";
import { SchemaType } from "./zenstack/schema";
` +
      pothosRaw
        .slice(0, lastLineStart)
        .replace("import type { Prisma, ", "import type { ")
        .replace('import type { PothosPrismaDatamodel } from "@pothos/plugin-prisma";', "")
        .replaceAll(/Prisma\.(\w+)Include;/gu, 'IncludeInput<SchemaType, "$1">')
        .replaceAll(/Prisma\.(\w+)Select;/gu, 'SelectInput<SchemaType, "$1">')
        .replaceAll(
          /Prisma\.(\w+)OrderByWithRelationInput;/gu,
          'OrderBy<SchemaType, "$1", true, false>',
        )
        .replaceAll(
          /Prisma\.(\w+)WhereUniqueInput;/gu,
          'WhereUniqueInput<SchemaType, "$1", QueryOptions<SchemaType>>',
        )
        .replaceAll(
          /Prisma\.(\w+)WhereInput;/gu,
          'WhereInput<SchemaType, "$1", QueryOptions<SchemaType>>',
        );

    await writeFile(pothosPath, pothosProcessed, "utf8");

    await writeFile(output, JSON.stringify(options.dmmf), "utf8");
  },
});
