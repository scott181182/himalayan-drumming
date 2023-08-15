import { enumType, inputObjectType } from "nexus";

export * from "./FileEntry";
export * from "./FileMetadata";
export * from "./LatLng";
export * from "./Person";
export * from "./Village";


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
