
import { extendType, idArg, inputObjectType, nonNull, objectType } from "nexus";

import { LatLng } from "./LatLng";
import { combinationOperators, makeRelationCreateInput, unnullifyObject } from "./utils";



export const  Village = objectType({
    name: "Village",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("name");
        t.string("temples");
        t.string("divinities");
        t.string("rituals");
        t.string("notes");

        t.nonNull.string("locationId");
        t.nonNull.field("location", {
            type: LatLng,
            resolve(src, _args, ctx) {
                return ctx.prisma.latLng.findUniqueOrThrow({
                    where: { id: src.locationId }
                });
            }
        });

        t.nonNull.list.nonNull.field("people", {
            type: "PersonInVillage",
            resolve: (src, _, ctx) => ctx.prisma.personInVillage.findMany({
                where: { villageId: src.id }
            })
        });
    },
});



export const VillageWhereInput = inputObjectType({
    name: "VillageWhereInput",
    definition(t) {
        t.field("id", { type: "IdNullableFilterInput" });
        t.field("name", { type: "StringNullableFilterInput" });
        
        t.field("temples", { type: "StringNullableFilterInput" });
        t.field("divinities", { type: "StringNullableFilterInput" });
        t.field("rituals", { type: "StringNullableFilterInput" });
        t.field("notes", { type: "StringNullableFilterInput" });
        
        t.field("people", { type: "PersonInVillageWhereManyInput" });

        combinationOperators(t, "VillageWhereInput");
    },
});
export const VillageQuery = extendType({
    type: "Query",
    definition(t) {
        t.field("village", {
            type: Village,
            args: {
                id: nonNull(idArg())
            },
            resolve(_, args, ctx) {
                return ctx.prisma.village.findUnique({
                    where: { id: args.id }
                });
            }
        });

        t.nonNull.list.nonNull.field("villages", {
            type: Village,
            resolve(_, _args, ctx) {
                return ctx.prisma.village.findMany();
            }
        });


    },
});



export const VillageCreateLocationInput = makeRelationCreateInput("VillageCreateLocationInput", "IdWhereUniqueInput", "LatLngCreateInput");
export const VillageCreateInput = inputObjectType({
    name: "VillageCreateInput",
    definition(t) {
        t.nonNull.string("name");
        
        t.string("temples");
        t.string("divinities");
        t.string("rituals");
        t.string("notes");

        t.nonNull.field({name: "location", type: VillageCreateLocationInput});
        t.field("people", { type: "PersonInVillageVillageRelationCreateInput" });
    },
});

export const VillageUpdateInput = inputObjectType({
    name: "VillageUpdateInput",
    definition(t) {
        t.string("name");
        t.string("temples");
        t.string("divinities");
        t.string("rituals");
        t.string("notes");
        
        t.field("location", { type: VillageCreateLocationInput });
        t.field("people", { type: "PersonInVillageVillageRelationUpdateInput" });
    },
});

export const VillageMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("createVillage", {
            type: Village,
            args: {
                data: nonNull(VillageCreateInput)
            },
            resolve(_, args, ctx) {
                return ctx.prisma.village.create({
                    data: unnullifyObject(args.data)
                });
            }
        });
        
        t.nonNull.field("updateVillage", {
            type: Village,
            args: {
                id: nonNull(idArg()),
                data: nonNull(VillageUpdateInput)
            },
            resolve(_, args, ctx) {
                return ctx.prisma.village.update({
                    where: { id: args.id },
                    data: unnullifyObject(args.data)
                });
            }
        });
    },
});
