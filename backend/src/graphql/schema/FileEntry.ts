import { mkdir } from "node:fs/promises";
import path from "node:path";

import { extendType, idArg, inputObjectType, intArg, nonNull, objectType, stringArg } from "nexus";

import { IdNullableFilterInput, StringNullableArrayFilterInput, StringNullableFilterInput } from "./filters";
import { makeRelationCreateInput, unnullifyObject } from "./utils";
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

        t.id("locationId");
        t.field("location", {
            type: "LatLng",
            resolve(src, _args, ctx) {
                return src.locationId ? ctx.prisma.latLng.findUniqueOrThrow({
                    where: { id: src.locationId }
                }) : null;
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
            type: "PersonOnFile",
            resolve(src, _args, ctx) {
                return ctx.prisma.personOnFile.findMany({
                    where: { fileId: src.id },
                });
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
                });
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





export const CreateFileReferenceInput = inputObjectType({
    name: "CreateFileReferenceInput",
    definition(t) {
        t.nonNull.id("parentId");
        t.nonNull.string("name");
        t.nonNull.string("url");
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
        });

        t.field("createFileReference", {
            type: "FileEntry",
            args: {
                data: nonNull(CreateFileReferenceInput)
            },
            async resolve(_, { data }, ctx) {
                const parent = await ctx.prisma.fileEntry.findUniqueOrThrow({
                    where: { id: data.parentId }
                });

                const vPath = parent.path === "/" ? data.name : path.join(parent.path, data.name);

                return ctx.prisma.fileEntry.create({
                    data: {
                        ...data,
                        path: vPath,
                        type: "reference"
                    }
                });
            }
        });


    }
});





export const FileCreateLocationInput = makeRelationCreateInput("FileCreateLocationInput", "IdWhereUniqueInput", "LatLngCreateInput");

export const FileEntryUpdateInput = inputObjectType({
    name: "FileEntryUpdateInput",
    definition(t) {
        t.string("notes");
        t.datetime("timestamp");

        t.field("location", { type: FileCreateLocationInput });
        
        t.field("people", { type: "PersonOnFileFileRelationUpdateInput" });
    }
});

export const FileEntryUpdateMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("updateFile", {
            type: FileEntry,
            args: {
                fileId: nonNull(idArg()),
                data: nonNull(FileEntryUpdateInput)
            },
            resolve(_, args, ctx) {
                return ctx.prisma.fileEntry.update({
                    where: { id: args.fileId },
                    data: unnullifyObject(args.data),
                });
            }
        });

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

        t.list.nonNull.field("associateFiles", {
            type: "FileEntry",
            args: {
                file1Id: nonNull(idArg()),
                file2Id: nonNull(idArg())
            },
            resolve(_, { file1Id, file2Id }, ctx) {
                if(file1Id === file2Id) { return []; }

                return ctx.prisma.fileAssociations.create({
                    data: {
                        file1Id,
                        file2Id
                    },
                    include: {
                        file1: true,
                        file2: true,
                    }
                }).then((res) => [ res.file1, res.file2 ]);
            }
        });
        t.list.nonNull.field("disassociateFiles", {
            type: "FileEntry",
            args: {
                file1Id: nonNull(idArg()),
                file2Id: nonNull(idArg())
            },
            resolve(_, { file1Id, file2Id }, ctx) {
                if(file1Id === file2Id) { return []; }

                return ctx.prisma.fileAssociations.deleteMany({
                    where: {
                        OR: [
                            { file1Id: { equals: file1Id }, file2Id: { equals: file2Id } },
                            { file1Id: { equals: file2Id }, file2Id: { equals: file1Id } },
                        ]
                    },
                }).then(() => ctx.prisma.fileEntry.findMany({
                    where: {
                        id: { in: [ file1Id, file2Id ] }
                    }
                }));
            }
        });
    }
});
