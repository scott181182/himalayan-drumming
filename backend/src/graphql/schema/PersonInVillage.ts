import { inputObjectType, objectType } from "nexus";

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



export const PersonInVillageCreateInput = inputObjectType({
    name: "PersonInVillageCreateInput",
    definition(t) {
        t.nonNull.id("villageId");
        t.string("description");
    },
});
export const PersonInVillageRelationCreateInput = makeRelationCreateInput("PersonInVillageRelationCreateInput", "PersonInVillageUniqueWhereInput", "PersonInVillageCreateInput");
export const PersonInVillageRelationUpdateInput = makeRelationUpdateInput("PersonInVillageRelationUpdateInput", "PersonInVillageUniqueWhereInput", "PersonInVillageCreateInput");
