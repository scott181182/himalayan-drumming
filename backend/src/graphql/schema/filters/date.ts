import { inputObjectType } from "nexus";



export const DateNullableFilterInput = inputObjectType({
    name: "DateNullableFilterInput",
    definition(t) {
        t.date("equals");
        t.list.nonNull.date("in");
        t.list.nonNull.date("notIn");
        t.date("lt");
        t.date("lte");
        t.date("gt");
        t.date("gte");
    },
});
