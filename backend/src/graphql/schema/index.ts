import { inputObjectType } from "nexus";

export * from "./FileEntry";
export * from "./FileMetadata";
export * from "./LatLng";

export const IdWhereUniqueInput = inputObjectType({
    name: "IdWhereUniqueInput",
    definition(t) {
        t.nonNull.id("id");
    },
});
