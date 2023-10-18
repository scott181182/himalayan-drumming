import { extendType, idArg, inputObjectType, intArg, nonNull, objectType, stringArg } from "nexus";

import { IdNullableFilterInput, StringNullableArrayFilterInput, StringNullableFilterInput } from "./filters";
import { unnullifyObject } from "./utils";
import { executeFullScan } from "@/lib/scan";
import { mkdir } from "node:fs/promises";
import path from "node:path";



export const FileEntry = objectType({
    name: "FileEntry",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("name");
        t.string("url");
        t.nonNull.string("type");

        t.id("parentId");
        t.field("parent", {
            type: "FileEntry",
            resolve(src, _args, ctx) {
                return src.parentId ?
                    ctx.prisma.fileEntry.findUniqueOrThrow({
                        where: { id: src.parentId }
                    }) :
                    null;
            }
        });

        t.field("metadata", {
            type: "FileMetadata",
            resolve(src, _args, ctx) {
                return ctx.prisma.fileMetadata.findUnique({
                    where: { fileId: src.id }
                });
            }
        });
        t.nonNull.list.nonNull.string("tags", {
            resolve(src, _args, ctx) {
                return ctx.prisma.tagOnFile.findMany({
                    where: {
                        fileId: { equals: src.id }
                    }
                }).then((tags) => tags.map((t) => t.tagName));
            }
        });
        t.nonNull.list.nonNull.field("people", {
            type: "Person",
            resolve(src, _args, ctx) {
                return ctx.prisma.fileEntry.findUniqueOrThrow({
                    where: { id: src.id },
                    select: { people: true }
                }).then((res) => res.people);
            }
        });

        t.list.nonNull.field("children", {
            type: "FileEntry",
            resolve(src, _args, ctx) {
                return ctx.prisma.fileEntry.findMany({
                    where: {
                        parentId: { equals: src.id }
                    }
                });
            }
        });
        


        t.nonNull.list.nonNull.field("associatedFiles", {
            type: "FileEntry",
            resolve(src, _, ctx) {
                return ctx.prisma.$transaction(async (tx) => {
                    const fileAssociations = await tx.fileAssociations.findMany({
                        where: {
                            OR: [
                                { file1Id: { equals: src.id } },
                                { file2Id: { equals: src.id } },
                            ]
                        }
                    });
    
                    const associatedFileIds = fileAssociations.map((fa) => fa.file1Id === src.id ? fa.file2Id : fa.file1Id);
                    return tx.fileEntry.findMany({
                        where: {
                            id: { in: associatedFileIds }
                        }
                    });
                })
            }
        });
    },
});



export const FileEntryWhereInput = inputObjectType({
    name: "FileEntryWhereInput",
    definition(t) {
        t.field("id", { type: IdNullableFilterInput });
        t.field("name", { type: StringNullableFilterInput });
        t.field("url", { type: StringNullableFilterInput });
        t.field("type", { type: StringNullableFilterInput });

        t.field("parentId", { type: IdNullableFilterInput });
        t.field("tags", { type: StringNullableArrayFilterInput });
    },
});
export const FileEntryQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.field("rootFileEntry", {
            type: FileEntry,
            resolve(_, _args, ctx) {
                return ctx.prisma.fileEntry.findFirstOrThrow({
                    where: {
                        parentId: null
                    }
                });
            }
        });

        t.field("fileEntry", {
            type: FileEntry,
            args: {
                id: nonNull(idArg())
            },
            resolve(_, args, ctx) {
                return ctx.prisma.fileEntry.findUnique({
                    where: { id: args.id }
                });
            }
        });

        t.nonNull.list.nonNull.field("fileEntries", {
            type: FileEntry,
            args: {
                skip: nonNull(intArg({ default: 0 })),
                take: intArg(),
                where: FileEntryWhereInput,
            },
            resolve(_, { skip, take, where }, ctx) {
                return ctx.prisma.fileEntry.findMany({
                    skip,
                    take: take ?? undefined,
                    where: unnullifyObject(where)
                });
            }
        });

        t.nonNull.list.nonNull.string("tags", {
            resolve(_, _args, ctx) {
                return ctx.prisma.tag.findMany()
                    .then((tags) => tags.map((t) => t.name));
            }
        });
    },
});





export const FileEntryMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("fullscan", {
            type: "FileEntry",
            description: "Perform a full scan of OneDrive and other file sources. Creates, updates, and deletes entries as necessary.",
            resolve(_, _args, ctx) {
                return executeFullScan(ctx.prisma);
            }
        });

        t.field("createDirectory", {
            type: "FileEntry",
            args: {
                parentId: nonNull(idArg()),
                name: nonNull(stringArg())
            },
            async resolve(_, { parentId, name }, ctx) {
                const parent = await ctx.prisma.fileEntry.findUniqueOrThrow({
                    where: { id: parentId }
                });

                const vPath = parent.path === "/" ? name : path.join(parent.path, name);
                await mkdir(path.join("/workspace/blob/files", vPath));

                return ctx.prisma.fileEntry.create({
                    data: {
                        name,
                        parentId,
                        path: vPath,
                        url: `/blob/files/${vPath}`,
                        type: "directory"
                    }
                });
            }
        })



        t.nonNull.field("tagFile", {
            type: FileEntry,
            args: {
                fileId: nonNull(idArg()),
                tag: nonNull(stringArg())
            },
            async resolve(_, args, ctx) {
                const onFiles = {
                    create: {
                        fileId: args.fileId
                    }
                };
                return ctx.prisma.tag.upsert({
                    where: { name: args.tag },
                    create: {
                        name: args.tag,
                        onFiles
                    },
                    update: { onFiles },
                    include: {
                        onFiles: {
                            where: { fileId: { equals: args.fileId } },
                            include: { file: true }
                        }
                    }
                }).then((res) => res.onFiles[0].file);
            }
        });
        t.nonNull.field("untagFile", {
            type: FileEntry,
            args: {
                fileId: nonNull(idArg()),
                tag: nonNull(stringArg())
            },
            resolve(_, args, ctx) {
                return ctx.prisma.tagOnFile.delete({
                    where: {
                        tagName_fileId: {
                            fileId: args.fileId,
                            tagName: args.tag
                        }
                    },
                    include: {
                        file: true
                    }
                }).then((res) => res.file);
            }
        });

        t.nonNull.boolean("associateFiles", {
            args: {
                file1Id: nonNull(idArg()),
                file2Id: nonNull(idArg())
            },
            resolve(_, { file1Id, file2Id }, ctx) {
                if(file1Id === file2Id) { return false; }

                return ctx.prisma.fileAssociations.create({
                    data: {
                        file1Id,
                        file2Id
                    }
                }).then(() => true);
            }
        });
    }
});
