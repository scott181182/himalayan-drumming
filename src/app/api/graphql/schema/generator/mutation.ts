// oxlint-disable typescript/no-unsafe-type-assertion
import type { MutationFieldBuilder, MutationFieldsShape } from "@pothos/core";
import type { ModelDef, SchemaDef } from "@zenstackhq/schema";
import { camel } from "radashi";

import type { SchemaBuilderType, SchemaTypes } from "../generator";

function createCreateMutation(
  modelDef: Readonly<ModelDef>,
  // oxlint-disable-next-line typescript/ban-types - This is the accurate ParentType
  t: Readonly<MutationFieldBuilder<SchemaTypes, {}>>,
) {
  return t.prismaField({
    type: modelDef.name as never,
    nullable: false,
    args: {
      data: t.arg({ type: `${modelDef.name}CreateInput` as never, required: true }),
    },
    resolve: (query, _root, args, ctx, _info) =>
      // oxlint-disable-next-line - we're in the wild west here
      (ctx.db as any)[camel(modelDef.name)].create({
        ...query,
        data: args.data,
      }),
  });
}

function createCreateManyMutation(
  modelDef: Readonly<ModelDef>,
  // oxlint-disable-next-line typescript/ban-types - This is the accurate ParentType
  t: Readonly<MutationFieldBuilder<SchemaTypes, {}>>,
) {
  return t.int({
    nullable: false,
    args: {
      data: t.arg({ type: [`${modelDef.name}CreateManyInput`] as never, required: true }),
    },
    resolve: async (_root, args, ctx, _info) => {
      // oxlint-disable-next-line - we're in the wild west here
      const result = (await (ctx.db as any)[camel(modelDef.name)].createMany({
        data: args.data,
      })) as { count: number };
      return result.count;
    },
  });
}

function createUpdateMutation(
  modelDef: Readonly<ModelDef>,
  // oxlint-disable-next-line typescript/ban-types - This is the accurate ParentType
  t: Readonly<MutationFieldBuilder<SchemaTypes, {}>>,
) {
  return t.prismaField({
    type: modelDef.name as never,
    nullable: true,
    args: {
      where: t.arg({ type: `${modelDef.name}WhereUniqueInput` as never, required: true }),
      data: t.arg({ type: `${modelDef.name}UpdateInput` as never, required: true }),
    },
    resolve: (query, _root, args, ctx, _info) =>
      // oxlint-disable-next-line - we're in the wild west here
      (ctx.db as any)[camel(modelDef.name)].update({
        ...query,
        where: args.where,
        data: args.data,
      }),
  });
}

function createDeleteMutation(
  modelDef: Readonly<ModelDef>,
  // oxlint-disable-next-line typescript/ban-types - This is the accurate ParentType
  t: Readonly<MutationFieldBuilder<SchemaTypes, {}>>,
) {
  return t.prismaField({
    type: modelDef.name as never,
    nullable: true,
    args: {
      where: t.arg({ type: `${modelDef.name}WhereUniqueInput` as never, required: true }),
    },
    resolve: (query, _root, args, ctx, _info) =>
      // oxlint-disable-next-line - we're in the wild west here
      (ctx.db as any)[camel(modelDef.name)].delete({
        ...query,
        where: args.where,
      }),
  });
}

function createDeleteManyMutation(
  modelDef: Readonly<ModelDef>,
  // oxlint-disable-next-line typescript/ban-types - This is the accurate ParentType
  t: Readonly<MutationFieldBuilder<SchemaTypes, {}>>,
) {
  return t.int({
    nullable: false,
    args: {
      where: t.arg({ type: `${modelDef.name}WhereInput` as never }),
    },
    resolve: async (_root, args, ctx, _info) => {
      // oxlint-disable-next-line - we're in the wild west here
      const result = (await (ctx.db as any)[camel(modelDef.name)].deleteMany({
        where: args.where,
      })) as { count: number };
      return result.count;
    },
  });
}

function createUpsertMutation(
  modelDef: Readonly<ModelDef>,
  // oxlint-disable-next-line typescript/ban-types - This is the accurate ParentType
  t: Readonly<MutationFieldBuilder<SchemaTypes, {}>>,
) {
  return t.prismaField({
    type: modelDef.name as never,
    nullable: false,
    args: {
      where: t.arg({ type: `${modelDef.name}WhereUniqueInput` as never, required: true }),
      create: t.arg({ type: `${modelDef.name}CreateInput` as never, required: true }),
      update: t.arg({ type: `${modelDef.name}UpdateInput` as never, required: true }),
    },
    resolve: (query, _root, args, ctx, _info) =>
      // oxlint-disable-next-line - we're in the wild west here
      (ctx.db as any)[camel(modelDef.name)].upsert({
        ...query,
        where: args.where,
        create: args.create,
        update: args.update,
      }),
  });
}

export function addMutationType(
  builder: Readonly<SchemaBuilderType>,
  schema: Readonly<SchemaDef>,
  extra?: MutationFieldsShape<SchemaTypes>,
) {
  builder.mutationType({
    fields: (t) => ({
      ...Object.values(schema.models).reduce((acc, modelDef) => {
        return {
          ...acc,
          [`create${modelDef.name}`]: createCreateMutation(modelDef, t),
          [`createMany${modelDef.name}`]: createCreateManyMutation(modelDef, t),
          [`update${modelDef.name}`]: createUpdateMutation(modelDef, t),
          [`delete${modelDef.name}`]: createDeleteMutation(modelDef, t),
          [`deleteMany${modelDef.name}`]: createDeleteManyMutation(modelDef, t),
          [`upsert${modelDef.name}`]: createUpsertMutation(modelDef, t),
        };
      }, {}),
      ...extra?.(t),
    }),
  });
}
