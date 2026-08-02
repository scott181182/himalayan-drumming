// oxlint-disable typescript/no-unsafe-type-assertion
import type { GenericFieldRef } from "@pothos/core";
import type {
  PrismaObjectFieldBuilder,
  PrismaObjectImplementationOptions,
} from "@pothos/plugin-prisma";
import type { FieldDef, GetModelFields, GetModels, SchemaDef } from "@zenstackhq/schema";
import type { GraphQLOutputType } from "graphql";
import { BigIntResolver, DateTimeISOResolver, JSONResolver } from "graphql-scalars";
import { mapValues } from "radashi";

import type { SchemaBuilderType, SchemaTypes } from "../generator";

const PRISMA_SCALAR_TYPES = ["Boolean", "Float", "Int", "String"];
const CUSTOM_SCALAR_MAP: Record<string, GraphQLOutputType> = {
  // String: GraphQLString,
  // Boolean: GraphQLBoolean,
  // Int: GraphQLInt,
  // Float: GraphQLFloat,
  BigInt: BigIntResolver,
  // Decimal, unsupported
  DateTime: DateTimeISOResolver,
  // Bytes, unsupported
  Json: JSONResolver,
  // Null, unsupported
  Object: JSONResolver,
  // Any, unsupported
  // Unsupported, unsupported
  // Void, unsupported
  // Undefined, unsupported
};

export type FieldBuilder<
  ZS extends SchemaDef,
  Model extends GetModels<ZS>,
> = PrismaObjectImplementationOptions<
  SchemaTypes,
  // @ts-expect-error - TS complains of incompatible types, but we're just navigating to it in a weird way.
  SchemaTypes["PrismaTypes"][Model],
  [],
  unknown,
  object
>["fields"];

export interface GenerateObjectOptions<ZS extends SchemaDef, Model extends GetModels<ZS>> {
  omit?: GetModelFields<ZS, Model>[];
  extraFields?: FieldBuilder<ZS, Model>;
}
export type GenerateObjectOptionsMap<ZS extends SchemaDef> = Partial<{
  [Model in GetModels<ZS>]: GenerateObjectOptions<ZS, Model>;
}>;

function exposeScalarType(
  fieldDef: Readonly<FieldDef>,
  t: Readonly<PrismaObjectFieldBuilder<SchemaTypes, any>>,
): GenericFieldRef<any> {
  // oxlint-disable-next-line typescript/no-unsafe-assignment
  const listNullable = { items: !!fieldDef.optional, list: false } as any;
  switch (fieldDef.type) {
    case "Boolean":
      if (fieldDef.array) {
        return t.exposeBooleanList(fieldDef.name, { nullable: listNullable });
      }
      return t.exposeBoolean(fieldDef.name, { nullable: !!fieldDef.optional });

    case "Float":
      if (fieldDef.array) {
        return t.exposeFloatList(fieldDef.name, { nullable: listNullable });
      }
      return t.exposeFloat(fieldDef.name, { nullable: !!fieldDef.optional });

    case "Int":
      if (fieldDef.array) {
        return t.exposeIntList(fieldDef.name, { nullable: listNullable });
      }
      return t.exposeInt(fieldDef.name, { nullable: !!fieldDef.optional });

    case "String":
      if (fieldDef.array) {
        return t.exposeStringList(fieldDef.name, { nullable: listNullable });
      }
      return t.exposeString(fieldDef.name, { nullable: !!fieldDef.optional });

    default:
      throw new Error(`Unsupported scalar type: ${fieldDef.type}`);
  }
}

export function addObjectTypes<ZS extends SchemaDef>(
  builder: Readonly<SchemaBuilderType>,
  schema: Readonly<ZS>,
  options?: Readonly<GenerateObjectOptionsMap<ZS>>,
) {
  for (const modelDef of Object.values(schema.models)) {
    const modelOptions = options?.[modelDef.name as keyof typeof options] ?? {};

    const modelFields = modelOptions?.omit
      ? Object.fromEntries(
          Object.entries(modelDef.fields).filter(
            ([f, _]) => !(modelOptions.omit as string[]).includes(f),
          ),
        )
      : modelDef.fields;

    builder.prismaObject(modelDef.name as never, {
      fields: (t) => ({
        ...mapValues(modelFields, (fieldDef) => {
          if (fieldDef.id && fieldDef.type === "String") {
            return t.exposeID(fieldDef.name as never, { nullable: !!fieldDef.optional });
          }
          if (PRISMA_SCALAR_TYPES.includes(fieldDef.type)) {
            // oxlint-disable-next-line typescript/no-unsafe-argument
            return exposeScalarType(fieldDef, t as any);
          }
          if (fieldDef.relation) {
            return t.relation(fieldDef.name as never, {
              nullable: fieldDef.array ? false : !!fieldDef.optional,
            });
          }
          if (fieldDef.type in CUSTOM_SCALAR_MAP) {
            return t.field({
              type: fieldDef.type as any,
              // oxlint-disable-next-line
              resolve: (src) => (src as any)[fieldDef.name],
            });
          }

          throw new Error(`Unsupported field type: ${fieldDef.type}`);
        }),
        // oxlint-disable-next-line typescript/no-unsafe-argument
        ...modelOptions.extraFields?.(t as any),
      }),
    });
  }
}
