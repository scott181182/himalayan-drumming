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
            type: "Person",
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
                    where: { id: args.id }
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



export const VillageForPersonInput = inputObjectType({
    name: "PersonInVillageCreateInput",
    definition(t) {
        t.nonNull.id("villageId");
        t.string("description");
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
        t.field("village", { type: VillageForPersonInput });
        t.field("files", { type: FilesForPersonCreateInput });
    },
});

export const PersonUpdateInput = inputObjectType({
    name: "PersonUpdateInput",
    definition(t) {
        t.string("name");
        t.string("parentId");
        t.field("village", { type: VillageForPersonInput });
        t.field("files", { type: FilesForPersonUpdateInput });
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
                        ...data,
                        villages: village ? {
                            create: village
                        } : undefined
                    }
                });
            }
        });
        t.nonNull.field("updatePerson", {
            type: Person,
            args: {
                id: nonNull(idArg()),
                data: nonNull(PersonUpdateInput)
            },
            resolve(_, args, ctx) {
                const {village, ... data } = unnullifyObject(args.data);
                return ctx.prisma.person.update({
                    where: { id: args.id },
                    data: {
                        ...data,
                        villages: village ? {
                            create: village
                        } : undefined,
                    }
                });
            }
        });
    },
});
