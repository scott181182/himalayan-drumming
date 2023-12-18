import { GraphQLDate, GraphQLDateTime } from "graphql-scalars";
import { asNexusMethod, enumType, inputObjectType } from "nexus";

export * from "./enums";
export * from "./filters";

export * from "./FileEntry";
export * from "./LatLng";
export * from "./Person";
export * from "./Tag";
export * from "./Village";

export * from "./PersonInVillage";
export * from "./PersonOnFile";



export const IdWhereUniqueInput = inputObjectType({
    name: "IdWhereUniqueInput",
    definition(t) {
        t.nonNull.id("id");
    },
});

export const OrderDirection = enumType({
    name: "OrderDirection",
    members: [ "asc", "desc" ]
});

export const Date = asNexusMethod(GraphQLDate, "date");
export const DateTime = asNexusMethod(GraphQLDateTime, "datetime");