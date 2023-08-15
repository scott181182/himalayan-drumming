
import { extendType, idArg, inputObjectType, nonNull, objectType } from "nexus";

import { LatLng } from "./LatLng";
import { makeRelationCreateInput, unnullifyObject } from "./utils";




export const PersonInVillage = objectType({
    name: "PersonInVillage",
    definition(t) {
        t.string("description");

        t.nonNull.id("villageId");
        t.nonNull.field("village", {
            type: "Village",
            resolve: (src, _, ctx) => {
                return ctx.prisma.village.findUniqueOrThrow({
                    where: { id: src.villageId }
                });
            }
        });

        t.nonNull.id("personId");
        t.nonNull.field("person", {
            type: "Person",
            resolve: (src, _, ctx) => {
                return ctx.prisma.person.findUniqueOrThrow({
                    where: { id: src.personId }
                });
            }
        });
    },
});

export const  Village = objectType({
    name: "Village",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("name");

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
        t.nonNull.field({name: "location", type: VillageCreateLocationInput});
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
    },
});
