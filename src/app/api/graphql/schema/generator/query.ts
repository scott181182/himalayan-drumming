// oxlint-disable typescript/no-unsafe-type-assertion
import type { FieldMap, QueryFieldBuilder, QueryFieldsShape } from "@pothos/core";
import type { GetModels, ModelDef, SchemaDef } from "@zenstackhq/schema";
import { plural } from "pluralize";
import { camel } from "radashi";

import type { SchemaBuilderType, SchemaTypes } from "../generator";

function createFindUniqueQuery(
  modelDef: Readonly<ModelDef>,
  // oxlint-disable-next-line typescript/ban-types - This is the accurate ParentType
  t: Readonly<QueryFieldBuilder<SchemaTypes, {}>>,
) {
  return t.prismaField({
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    type: modelDef.name as never,
    nullable: true,
    args: {
      where: t.arg({ type: `${modelDef.name}WhereUniqueInput` as never, required: true }),
    },
    resolve: (query, _root, args, ctx, _info) =>
      // oxlint-disable-next-line - we're in the wild west here
      (ctx.db as any)[camel(modelDef.name)].findUnique({
        ...query,
        where: args.where,
      }),
  });
}
function createFindManyQuery(
  modelDef: Readonly<ModelDef>,
  // oxlint-disable-next-line typescript/ban-types - This is the accurate ParentType
  t: Readonly<QueryFieldBuilder<SchemaTypes, {}>>,
) {
  return t.prismaField({
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    type: [modelDef.name as never],
    nullable: false,
    args: {
      where: t.arg({ type: `${modelDef.name}WhereInput` as never }),
      orderBy: t.arg({ type: [`${modelDef.name}OrderByWithRelationInput`] as never }),
      skip: t.arg.int({ defaultValue: 0 }),
      take: t.arg.int({ defaultValue: 10 }),
    },
    resolve: (query, _root, args, ctx, _info) =>
      // oxlint-disable-next-line - we're in the wild west here
      (ctx.db as any)[camel(modelDef.name)].findMany({
        ...query,
        ...args,
      }),
  });
}

function createCountQuery(
  modelDef: Readonly<ModelDef>,
  // oxlint-disable-next-line typescript/ban-types - This is the accurate ParentType
  t: Readonly<QueryFieldBuilder<SchemaTypes, {}>>,
) {
  return t.int({
    nullable: false,
    args: {
      where: t.arg({ type: `${modelDef.name}WhereInput` as never }),
    },
    resolve: (_root, args, ctx, _info) =>
      // oxlint-disable-next-line - we're in the wild west here
      (ctx.db as any)[camel(modelDef.name)].count({
        where: args.where,
      }),
  });
}

export type QueryResolverName<ZS extends SchemaDef> =
  | Uncapitalize<GetModels<ZS>>
  | `count${GetModels<ZS>}`
  // This type isn't really right, since we're correctly pluralizing the model name for the resolver.
  | `${Uncapitalize<GetModels<ZS>>}s`;
export interface QueryTypeOptions<ZS extends SchemaDef> {
  omit?: QueryResolverName<ZS>[];
  omitModels?: GetModels<ZS>[];
  extra?: QueryFieldsShape<SchemaTypes>;
}
export function addQueryType(
  builder: Readonly<SchemaBuilderType>,
  schema: Readonly<SchemaDef>,
  options?: Readonly<QueryTypeOptions<SchemaDef>>,
) {
  const modelOmits = (options?.omitModels as string[]) ?? [];
  const resolverOmits = (options?.omit as string[]) ?? [];

  builder.queryType({
    fields: (t) => ({
      ...Object.values(schema.models)
        .filter((modelDef) => !modelOmits.includes(modelDef.name))
        .reduce((acc, modelDef) => {
          const uniqueResolverName = camel(modelDef.name);
          const manyResolverName = plural(uniqueResolverName);
          const countFieldName = `count${modelDef.name}`;

          if (!resolverOmits.includes(uniqueResolverName)) {
            acc[uniqueResolverName] = createFindUniqueQuery(modelDef, t);
          }
          if (!resolverOmits.includes(manyResolverName)) {
            acc[manyResolverName] = createFindManyQuery(modelDef, t);
          }
          if (!resolverOmits.includes(countFieldName)) {
            acc[countFieldName] = createCountQuery(modelDef, t);
          }

          return acc;
        }, {} as FieldMap),
      ...options?.extra?.(t),
    }),
  });
}
