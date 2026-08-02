// oxlint-disable typescript/no-unsafe-type-assertion
import type { GenericInputFieldRef, InputFieldBuilder } from "@pothos/core";
import type { Document as DMMF, InputType, InputTypeRef, SchemaArg } from "@prisma/dmmf";
import type { SchemaDef } from "@zenstackhq/schema";

import type { SchemaBuilderType, SchemaTypes } from "../generator";

function getInputFieldType(fieldName: string, inputTypeRef: Readonly<InputTypeRef>) {
  if (inputTypeRef.location !== "scalar") {
    return inputTypeRef.type;
  }
  switch (inputTypeRef.type) {
    case "Boolean":
      return "Boolean";
    case "Float":
      return "Float";
    case "Int":
      return "Int";
    case "String":
      return fieldName === "id" || fieldName.endsWith("Id") ? "ID" : "String";
    case "BigInt":
      return "BigInt";
    case "DateTime":
      return "DateTime";
    case "Json":
      return "Json";
  }
  throw new Error(`Unknown scalar type: ${inputTypeRef.type}`);
}

function addStubInput(builder: Readonly<SchemaBuilderType>, inputType: InputType) {
  console.warn(`Input type ${inputType.name} has no fields. Injecting phantom field...`);

  builder.inputType(inputType.name, {
    description: "This is an empty input type and shouldn't be used in actual requests",
    fields: (t) => ({
      _stub: t.string({
        deprecationReason:
          "This is a stub field to avoid an empty input object. Do not use this field.",
      }),
    }),
  });
}

// oxlint-disable-next-line max-lines-per-function
function pickPrimaryType(inputFields: readonly Readonly<InputTypeRef>[]): InputTypeRef | undefined {
  let filteredTypes = inputFields.filter((t) => t.type !== "Null");

  if (filteredTypes.length === 0) {
    return undefined;
  }
  if (filteredTypes.length === 1) {
    return filteredTypes[0];
  }

  // Prioritize some input objects over scalars.
  const inputObjectTypes = filteredTypes.filter((t) => t.location === "inputObjectTypes");
  if (
    inputObjectTypes.length === 1 &&
    /(UpdateOperationsInput|Filter|SortOrderInput)$/u.test(inputObjectTypes[0].type)
  ) {
    return inputObjectTypes[0];
  }

  // Can we filter out unchecked create inputs?
  const withoutUnchecked = filteredTypes.filter(
    (t) => !t.type.includes("UncheckedCreate") && !t.type.includes("UncheckedUpdate"),
  );
  if (withoutUnchecked.length === 1) {
    return withoutUnchecked[0];
  }
  if (withoutUnchecked.length > 1) {
    filteredTypes = withoutUnchecked;
  }

  if (filteredTypes.length === 2) {
    const [a, b] = filteredTypes;
    if (a.type === b.type && a.isList !== b.isList) {
      // Prefer lists over non-lists.
      return a.isList ? a : b;
    }
    if (a.type.endsWith("ScalarRelationFilter") && b.type.endsWith("WhereInput")) {
      // Prefer direct WhereInputs over the extra scalar relation filter step.
      return b;
    }
    if (a.location === "scalar" && b.location === "fieldRefTypes") {
      // Prefer scalars over scalar refs.
      return a;
    }
    if (a.type.includes("ToOneWithWhere")) {
      // Prefer simpler relation filters.
      return b;
    }
    if (a.type === "Boolean" && b.type.endsWith("WhereInput")) {
      // Prefer simpler relation filters.
      return a;
    }
  }

  console.warn("Cannot call tiebreaker on:", filteredTypes);
  return undefined;
}

function mapInputObjectFields(
  inputType: InputType,
  inputFields: readonly SchemaArg[],
  t: Readonly<InputFieldBuilder<SchemaTypes, "InputObject">>,
): Record<string, GenericInputFieldRef> {
  return Object.fromEntries(
    inputFields.map<[string, GenericInputFieldRef]>((field) => {
      const primaryType = pickPrimaryType(field.inputTypes);
      if (!primaryType) {
        console.log(`\nNEW TYPE: ${inputType.name}.${field.name}`, field.inputTypes);
        throw new Error(`Input field ${field.name} has no input types defined`);
      }

      const fieldBaseType = getInputFieldType(field.name, primaryType);
      const required =
        (field.isRequired && !field.isNullable) ||
        (inputType.constraints.fields?.includes(field.name) &&
          inputType.constraints.fields.length === 1);

      const fieldType = (primaryType.isList ? [fieldBaseType] : fieldBaseType) as never;
      return [
        field.name,
        t.field({
          type: fieldType,
          required,
        }),
      ];
    }),
  );
}

export function addInputTypes(
  builder: Readonly<SchemaBuilderType>,
  dmmf: DMMF,
  _schema: Readonly<SchemaDef>,
) {
  const prismaInputTypes = dmmf.schema.inputObjectTypes.prisma ?? [];
  const modelInputTypes = dmmf.schema.inputObjectTypes.model ?? [];
  const allInputTypes = [...prismaInputTypes, ...modelInputTypes];

  for (const inputType of allInputTypes) {
    const inputFields =
      inputType.constraints.fields && inputType.constraints.fields.length > 0
        ? inputType.fields.filter((field) => inputType.constraints.fields?.includes(field.name))
        : inputType.fields;

    if (inputFields.length === 0) {
      addStubInput(builder, inputType);
      continue;
    }

    const hasMutuallyExclusiveFields =
      inputType.constraints.fields && inputType.constraints.fields.length > 1;

    builder.inputType(inputType.name, {
      // oxlint-disable-next-line typescript/prefer-nullish-coalescing
      isOneOf: hasMutuallyExclusiveFields || inputType.constraints.maxNumFields === 1,
      fields: (t) => mapInputObjectFields(inputType, inputFields, t),
    });
  }
}
