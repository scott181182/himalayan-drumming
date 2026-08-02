// oxlint-disable typescript/no-unsafe-type-assertion import/max-dependencies
import type { FieldMap, MutationFieldsShape } from "@pothos/core";
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type { Document as DMMF } from "@prisma/dmmf";
import type { GetModels, SchemaDef } from "@zenstackhq/schema";
import type { GraphQLSchema } from "graphql";
import { BigIntResolver, DateTimeISOResolver, JSONResolver } from "graphql-scalars";

import type { Context } from "../../context";
import { addInputTypes } from "./input";
import { addMutationType } from "./mutation";
import type { GenerateObjectOptionsMap } from "./object";
import { addObjectTypes } from "./object";
import type { QueryResolverName, QueryTypeOptions } from "./query";
import { addQueryType } from "./query";
import type PrismaTypes from "@/generated/pothos-prisma-types";

function makeSchemaBuilder(dmmf: DMMF) {
  const builder = new SchemaBuilder<{
    Context: Context;
    Scalars: {
      BigInt: { Input: bigint; Output: bigint };
      DateTime: { Input: Date; Output: Date };
      Json: { Input: unknown; Output: unknown };
      Object: { Input: Record<string, unknown>; Output: Record<string, unknown> };
    };
    PrismaTypes: PrismaTypes;
  }>({
    plugins: [PrismaPlugin],
    prisma: {
      client: (ctx) => ctx.db,
      dmmf,
    },
  });

  builder.addScalarType("BigInt", BigIntResolver);
  builder.addScalarType("DateTime", DateTimeISOResolver);
  builder.addScalarType("Json", JSONResolver);
  builder.addScalarType("Object", JSONResolver);

  return builder;
}
export type SchemaBuilderType = Awaited<ReturnType<typeof makeSchemaBuilder>>;
export type SchemaTypes = SchemaBuilderType["$inferSchemaTypes"];

function addEnumTypes(builder: Readonly<SchemaBuilderType>, dmmf: DMMF) {
  const prismaEnumTypes = dmmf.schema.enumTypes.prisma ?? [];
  const modelEnumTypes = dmmf.schema.enumTypes.model ?? [];
  const allEnumTypes = [...prismaEnumTypes, ...modelEnumTypes];

  for (const enumType of allEnumTypes) {
    builder.enumType(enumType.name, {
      values: enumType.values as unknown as readonly [string, ...string[]],
    });
  }
}

function foldPlugins<ZS extends SchemaDef>(
  plugins?: readonly Readonly<GenerateSchemaPlugin<ZS>>[],
): GenerateSchemaPlugin<ZS> {
  return {
    build: (builder) => {
      plugins?.forEach((plugin) => plugin.build?.(builder));
    },
    query: {
      omit:
        plugins?.reduce<QueryResolverName<ZS>[]>(
          (acc, o) => [...acc, ...(o.query?.omit ?? [])],
          [],
        ) ?? [],
      omitModels:
        plugins?.reduce<GetModels<ZS>[]>(
          (acc, o) => [...acc, ...(o.query?.omitModels ?? [])],
          [],
        ) ?? [],
      extra: (t) =>
        plugins?.reduce<FieldMap>(
          (acc, plugin) => ({
            ...acc,
            ...plugin.query?.extra?.(t),
          }),
          {},
        ) ?? {},
    },
    mutation: (t) =>
      plugins?.reduce<FieldMap>(
        (acc, plugin) => ({
          ...acc,
          ...plugin.mutation?.(t),
        }),
        {},
      ) ?? {},
    objects: plugins?.reduce<GenerateObjectOptionsMap<ZS>>(
      (acc, plugin) => ({
        ...acc,
        ...plugin.objects,
      }),
      {},
    ),
  };
}

export interface GenerateSchemaPlugin<ZS extends SchemaDef> {
  objects?: GenerateObjectOptionsMap<ZS>;
  query?: QueryTypeOptions<ZS>;
  mutation?: MutationFieldsShape<SchemaTypes>;
  build?: (builder: Readonly<SchemaBuilderType>) => void;
}
export interface GenerateSchemaOptions<ZS extends SchemaDef> extends GenerateSchemaPlugin<ZS> {
  dmmf: DMMF;
  zenSchema: ZS;
  plugins?: ReadonlyArray<GenerateSchemaPlugin<ZS>>;
}
export function generateSchema<ZS extends SchemaDef>({
  dmmf,
  zenSchema: schema,
  objects: objectOptions,
  query,
  mutation,
  build,
  plugins,
}: Readonly<GenerateSchemaOptions<ZS>>): GraphQLSchema {
  const builder = makeSchemaBuilder(dmmf);

  const foldedPlugins = foldPlugins([
    { objects: objectOptions, query, mutation, build },
    ...(plugins ?? []),
  ]);

  addEnumTypes(builder, dmmf);
  addInputTypes(builder, dmmf, schema);
  addObjectTypes(builder, schema, foldedPlugins.objects);

  foldedPlugins.build?.(builder);

  addQueryType(builder, schema, foldedPlugins.query);
  addMutationType(builder, schema, foldedPlugins.mutation);

  return builder.toSchema();
}
