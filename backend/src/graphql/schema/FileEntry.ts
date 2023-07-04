import { extendType, nonNull, objectType, stringArg } from "nexus";

import { executeFullScan } from "@/lib/scan";



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
                id: nonNull(stringArg())
            },
            resolve(_, args, ctx) {
                return ctx.prisma.fileEntry.findUnique({
                    where: { id: args.id }
                });
            }
        });

        t.nonNull.list.nonNull.field("fileEntries", {
            type: FileEntry,
            resolve(_, _args, ctx) {
                return ctx.prisma.fileEntry.findMany();
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
                return executeFullScan(ctx);
            }
        });
    }
});
