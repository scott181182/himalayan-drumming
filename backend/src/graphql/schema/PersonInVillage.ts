import { extendType, idArg, inputObjectType, nonNull, objectType } from "nexus";

import { combinationOperators, makeListRelationWhereInput, makeRelationCreateInput, makeRelationUpdateInput } from "./utils";



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

export const PersonIdVillageIdInput = inputObjectType({
    name: "PersonIdVillageIdInput",
    definition(t) {
        t.nonNull.id("personId");
        t.nonNull.id("villageId");
    },
});
export const PersonInVillageUniqueWhereInput = inputObjectType({
    name: "PersonInVillageUniqueWhereInput",
    definition(t) {
        t.nonNull.field("personId_villageId", {
            type: PersonIdVillageIdInput
        });
    },
});

export const PersonInVillageWhereInput = inputObjectType({
    name: "PersonInVillageWhereInput",
    definition(t) {
        t.field("description", { type: "StringNullableFilterInput" });

        t.field("villageId", { type: "IdNullableFilterInput" });
        t.field("village", { type: "VillageWhereInput" });
        t.field("personId", { type: "IdNullableFilterInput" });
        t.field("person", { type: "PersonWhereInput" });

        combinationOperators(t, "PersonInVillageWhereInput");
    },
});
export const PersonInVillageWhereManyInput = makeListRelationWhereInput("PersonInVillageWhereManyInput", "PersonInVillageWhereInput");



// Inputs for relationships from Person to PersonInVillage.
export const PersonInVillagePersonCreateInput = inputObjectType({
    name: "PersonInVillagePersonCreateInput",
    definition(t) {
        t.nonNull.id("villageId");
        t.string("description");
    },
});
export const PersonInVillagePersonRelationCreateInput = makeRelationCreateInput("PersonInVillagePersonRelationCreateInput", "PersonInVillageUniqueWhereInput", "PersonInVillagePersonCreateInput");
export const PersonInVillagePersonRelationUpdateInput = makeRelationUpdateInput("PersonInVillagePersonRelationUpdateInput", "PersonInVillageUniqueWhereInput", "PersonInVillagePersonCreateInput");



// Inputs for relationships from Village to PersonInVillage.
export const PersonInVillageVillageCreateInput = inputObjectType({
    name: "PersonInVillageVillageCreateInput",
    definition(t) {
        t.nonNull.id("personId");
        t.string("description");
    },
});
export const PersonInVillageVillageRelationCreateInput = makeRelationCreateInput("PersonInVillageVillageRelationCreateInput", "PersonInVillageUniqueWhereInput", "PersonInVillageVillageCreateInput");
export const PersonInVillageVillageRelationUpdateInput = makeRelationUpdateInput("PersonInVillageVillageRelationUpdateInput", "PersonInVillageUniqueWhereInput", "PersonInVillageVillageCreateInput");



export const PersonInVillageMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.boolean("removePersonFromVillage", {
            args: {
                villageId: nonNull(idArg()),
                personId: nonNull(idArg()),
            },
            resolve(_, { villageId, personId }, ctx) {
                return ctx.prisma.personInVillage.delete({
                    where: {
                        personId_villageId: {
                            personId, villageId
                        }
                    }
                }).then(() => true).catch(() => false);
            }
        });
    },
});
