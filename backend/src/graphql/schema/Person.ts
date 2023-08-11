import { extendType, idArg, inputObjectType, nonNull, objectType } from "nexus";

import { unnullifyObject } from "./utils";




export const  Person = objectType({
    name: "Person",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("name");

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
            type: 'Person',
            resolve(src, _args, ctx) {
                return ctx.prisma.person.findMany({
                    where: { parentId: src.id }
                });
            }
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
                    where: {
                        id: args.id
                    }
                });
            }
        });

        t.nonNull.list.nonNull.field("people", {
            type: Person,
            resolve(_, _args, ctx) {
                return ctx.prisma.person.findMany();
            }
        });
    },
});



export const PersonCreateInput = inputObjectType({
    name: "PersonCreateInput",
    definition(t) {
        t.nonNull.string("name");
        t.string("parentId");
        t.field("village", {type: PersonInVillageCreateInput})
    },
});

export const PersonInVillageCreateInput = inputObjectType({
    name: "PersonInVillageCreateInput",
    definition(t) {
        t.nonNull.id("villageId");
        t.string("description");
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
                const {village, ... data } = unnullifyObject(args.data);
                return ctx.prisma.person.create({
                    data: {
                        ... data,
                        villages: village ? {
                            create: village

                        } : undefined
                    }
                });
            }
        });
    },
});
