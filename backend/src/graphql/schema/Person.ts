import { extendType, idArg, inputObjectType, intArg, nonNull, objectType } from "nexus";

import { combinationOperators, makeListRelationWhereInput, unnullifyObject } from "./utils";



export const  Person = objectType({
    name: "Person",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("name");
        t.string("avatarUrl");

        t.string("parentId");
        t.field("parent", {
            type: "Person",
            resolve(src, _args, ctx) {
                return src.parentId ? ctx.prisma.person.findUniqueOrThrow({
                    where: { id: src.parentId }
                }) : null;
            }
        });

        t.nonNull.list.nonNull.field("children", {
            type: "Person",
            resolve(src, _args, ctx) {
                return ctx.prisma.person.findMany({
                    where: { parentId: src.id }
                });
            }
        });
        t.nonNull.list.nonNull.field("villages", {
            type: "PersonInVillage",
            resolve: (src, _, ctx) => ctx.prisma.personInVillage.findMany({
                where: { personId: src.id }
            })
        });

        t.nonNull.list.nonNull.field("files", {
            type: "FileEntry",
            resolve(src, _args, ctx) {
                return ctx.prisma.person.findUniqueOrThrow({
                    where: { id: src.id },
                    select: { files: true }
                }).then((res) => res.files);
            }
        });
    },
});



export const PersonWhereInput = inputObjectType({
    name: "PersonWhereInput",
    definition(t) {
        t.field("id", { type: "IdNullableFilterInput" });
        t.field("name", { type: "StringNullableFilterInput" });

        t.field("parentId", { type: "IdNullableFilterInput" });
        t.field("parent", { type: "PersonWhereInput" });

        t.field("children", { type: "PersonWhereManyInput" });
        t.field("villages", { type: "PersonInVillageWhereManyInput" });

        combinationOperators(t, "PersonWhereInput");

        // TODO: add files?
    },
});
export const PersonWhereManyInput = makeListRelationWhereInput("PersonWhereManyInput", "PersonWhereInput");

export const PersonOrderByInput = inputObjectType({
    name: "PersonOrderByInput",
    definition(t) {
        t.field({ name: "name", type: "OrderDirection" });
    },
});

export const PersonQuery = extendType({
    type: "Query",
    definition(t) {
        t.field("person", {
            type: Person,
            args: {
                id: nonNull(idArg())
            },
            resolve(_, args, ctx) {
                return ctx.prisma.person.findUnique({
                    where: { id: args.id }
                });
            }
        });

        t.nonNull.list.nonNull.field("people", {
            type: Person,
            args: {
                where: PersonWhereInput,
                take: nonNull(intArg({ default: 20 })),
                skip: nonNull(intArg({ default: 0 })),
                orderBy: PersonOrderByInput
            },
            resolve(_, { where, take, skip, orderBy }, ctx) {
                return ctx.prisma.person.findMany({
                    where: unnullifyObject(where),
                    take, skip,
                    orderBy: unnullifyObject(orderBy)
                });
            }
        });
    },
});



export const FilesForPersonCreateInput = inputObjectType({
    name: "FilesForPersonCreateInput",
    definition(t) {
        t.list.nonNull.field("connect", {
            type: "IdWhereUniqueInput"
        });
    },
});
export const FilesForPersonUpdateInput = inputObjectType({
    name: "FilesForPersonUpdateInput",
    definition(t) {
        t.list.nonNull.field("connect", {
            type: "IdWhereUniqueInput"
        });
        t.list.nonNull.field("disconnect", {
            type: "IdWhereUniqueInput"
        });
    },
});

export const PersonCreateInput = inputObjectType({
    name: "PersonCreateInput",
    definition(t) {
        t.nonNull.string("name");
        t.string("parentId");
        t.field("files", { type: FilesForPersonCreateInput });
        t.field("villages", { type: "PersonInVillageRelationCreateInput" });
    },
});

export const PersonUpdateInput = inputObjectType({
    name: "PersonUpdateInput",
    definition(t) {
        t.string("name");
        t.string("parentId");
        t.field("files", { type: FilesForPersonUpdateInput });
        t.field("villages", { type: "PersonInVillageRelationUpdateInput" });
    },
});

export const PersonMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("createPerson", {
            type: Person,
            args: {
                data: nonNull(PersonCreateInput)
            },
            resolve(_, args, ctx) {
                const data = unnullifyObject(args.data);
                return ctx.prisma.person.create({ data });
            }
        });
        t.nonNull.field("updatePerson", {
            type: Person,
            args: {
                id: nonNull(idArg()),
                data: nonNull(PersonUpdateInput)
            },
            resolve(_, args, ctx) {
                const data = unnullifyObject(args.data);
                return ctx.prisma.person.update({
                    where: { id: args.id },
                    data
                });
            }
        });
    },
});
