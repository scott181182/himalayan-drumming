import { inputObjectType, objectType } from "nexus";




export const LatLng = objectType({
    name: "LatLng",
    definition(t) {
        t.nonNull.id("id");

        t.nonNull.float("latitude");
        t.nonNull.float("longitude");
    },
});



export const LatLngCreateInput = inputObjectType({
    name: "LatLngCreateInput",
    definition(t) {
        t.nonNull.float("latitude");
        t.nonNull.float("longitude");
    },
});
