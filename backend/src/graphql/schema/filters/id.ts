import { inputObjectType } from "nexus";
import type { InputDefinitionBlock } from "nexus/dist/core";



function definedIdFilterInput(t: InputDefinitionBlock<"IdNullableFilterInput" | "NestedIdNullableFilterInput">) {
    t.id("equals");
    t.list.nonNull.id("in");
    t.list.nonNull.id("notIn");
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
