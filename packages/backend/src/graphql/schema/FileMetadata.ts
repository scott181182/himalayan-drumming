import { extendType, idArg, inputObjectType, nonNull, objectType } from "nexus";

import { makeRelationCreateInput, unnullifyObject } from "./utils";




export const FileMetadata = objectType({
    name: "FileMetadata",
    definition(t) {
        t.nonNull.id("fileId");

        t.nonNull.field("file", {
            type: "FileEntry",
            resolve(src, _args, ctx) {
                return ctx.prisma.fileEntry.findUniqueOrThrow({
                    where: { id: src.fileId }
                });
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
    },
});




export const FileMetadataCreateLocationInput = makeRelationCreateInput("FileMetadataCreateLocationInput", "IdWhereUniqueInput", "LatLngCreateInput");
export const FileMetadataUpdateInput = inputObjectType({
    name: "FileMetadataUpdateInput",
    definition(t) {
        t.field("location", {
            type: FileMetadataCreateLocationInput
        });
    },
});

export const FileMetadataMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("updateMetadata", {
            type: "FileEntry",
            args: {
                fileId: nonNull(idArg()),
                data: nonNull(FileMetadataUpdateInput)
            },
            resolve(_, args, ctx) {
                return ctx.prisma.fileMetadata.upsert({
                    where: { fileId: args.fileId },
                    create: {
                        file: { connect: { id: args.fileId } },
                        ...unnullifyObject(args.data)
                    },
                    update: unnullifyObject(args.data),
                    select: { file: true }
                }).then((res) => res.file);
            }
        });
    },
});
