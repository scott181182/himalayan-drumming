import { enumType, inputObjectType } from "nexus";
import type { InputDefinitionBlock } from "nexus/dist/core";



export const StringQueryModeEnum = enumType({
    name: "StringQueryModeEnum",
    members: [
        "default",
        "insensitive",
    ],
});

function definedStringFilterInput(t: InputDefinitionBlock<"StringNullableFilterInput" | "NestedStringNullableFilterInput">) {
    t.string("equals");
    t.list.nonNull.string("in");
    t.list.nonNull.string("notIn");
    t.string("lt");
    t.string("lte");
    t.string("gt");
    t.string("gte");
    t.string("contains");
    t.string("startsWith");
    t.string("endsWith");
    t.field("not", { type: "NestedStringNullableFilterInput" });
}

export const StringNullableFilterInput = inputObjectType({
    name: "StringNullableFilterInput",
    definition: definedStringFilterInput,
});

export const NestedStringNullableFilterInput = inputObjectType({
    name: "NestedStringNullableFilterInput",
    definition: definedStringFilterInput,
});

export const StringNullableArrayFilterInput = inputObjectType({
    name: "StringNullableArrayFilterInput",
    definition(t) {
        t.field("some", { type: StringNullableFilterInput });
        t.field("every", { type: StringNullableFilterInput });
        t.field("none", { type: StringNullableFilterInput });
    },
});
