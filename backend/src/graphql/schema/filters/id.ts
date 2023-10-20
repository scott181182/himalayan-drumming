import { inputObjectType } from "nexus";
import type { InputDefinitionBlock } from "nexus/dist/core";



function definedIdFilterInput(t: InputDefinitionBlock<"IdNullableFilterInput" | "NestedIdNullableFilterInput">) {
    t.string("equals");
    t.list.nonNull.string("in");
    t.list.nonNull.string("notIn");
    t.field("not", { type: "NestedIdNullableFilterInput" });
}

export const IdNullableFilterInput = inputObjectType({
    name: "IdNullableFilterInput",
    definition: definedIdFilterInput,
});

export const NestedIdNullableFilterInput = inputObjectType({
    name: "NestedIdNullableFilterInput",
    definition: definedIdFilterInput,
});
