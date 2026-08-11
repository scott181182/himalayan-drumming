import path from "path";

import type { GenerateSchemaPlugin } from "./generator";
import type { FileMetadataUpdateInput } from "@/generated/graphql";
import type { SchemaType } from "@/generated/zenstack/schema";
import { executeFullScan } from "@/lib/server/scan";
import { unnullifyObject } from "@/utils/object";

export const filesPlugin: GenerateSchemaPlugin<SchemaType> = {
  objects: {
    FileEntry: {
      omit: ["associatedFiles1", "associatedFiles2", "withTags"],
      extraFields: (t) => ({
        tags: t.stringList({
          nullable: false,
          select: {
            withTags: {
              select: { tagName: true },
            },
          },
          resolve: (src) => src.withTags.map((tag) => tag.tagName),
        }),
        associatedFiles: t.field({
          // oxlint-disable-next-line typescript/no-unsafe-type-assertion
          type: ["FileEntry"] as never,
          nullable: false,
          select: {
            associatedFiles1: { select: { file2: true } },
            associatedFiles2: { select: { file1: true } },
          },
          resolve: (src) => [
            ...src.associatedFiles1.map((af) => af.file2),
            ...src.associatedFiles2.map((af) => af.file1),
          ],
        }),
      }),
    },
  },
  build: (builder) => {
    builder.inputType("CreateFileReferenceInput", {
      fields: (t) => ({
        name: t.string({ required: true }),
        parentId: t.id({ required: true }),
        url: t.string({ required: true }),
      }),
    });
  },
  query: {
    extra: (t) => ({
      rootFileEntry: t.prismaField({
        type: "FileEntry",
        nullable: false,
        resolve: (query, _root, _args, ctx) =>
          ctx.db.fileEntry.findFirstOrThrow({
            ...query,
            where: {
              parentId: null,
            },
          }),
      }),
    }),
  },
  // oxlint-disable-next-line max-lines-per-function
  mutation: (t) => ({
    fullscan: t.prismaField({
      type: "FileEntry",
      description:
        "Perform a full scan of OneDrive and other file sources. Creates, updates, and deletes entries as necessary.",
      async resolve(query, _, _args, ctx) {
        const root = await executeFullScan(ctx.db, ctx.storage);
        return ctx.db.fileEntry.findUniqueOrThrow({
          ...query,
          where: { id: root.id },
        });
      },
    }),
    createDirectory: t.prismaField({
      type: "FileEntry",
      args: {
        parentId: t.arg.id({ required: true }),
        name: t.arg.string({ required: true }),
      },
      async resolve(query, _src, { parentId, name }, ctx) {
        const parent = await ctx.db.fileEntry.findUniqueOrThrow({
          where: { id: parentId },
        });

        const vPath = path.join(parent.path, name);
        await ctx.storage.createDirectory(vPath);

        return ctx.db.fileEntry.create({
          ...query,
          data: {
            name,
            parentId,
            path: vPath,
            url: await ctx.storage.publicUrl(vPath),
            type: "directory",
          },
        });
      },
    }),
    createFileReference: t.prismaField({
      type: "FileEntry",
      args: {
        // oxlint-disable-next-line typescript/no-unsafe-type-assertion
        data: t.arg({ type: "CreateFileReferenceInput" as never, required: true }),
      },
      async resolve(
        query,
        _src,
        { data }: Readonly<{ data: { name: string; parentId: string; url: string } }>,
        ctx,
      ) {
        const parent = await ctx.db.fileEntry.findUniqueOrThrow({
          where: { id: data.parentId },
        });

        const vPath = path.join(parent.path, data.name);

        return ctx.db.fileEntry.create({
          ...query,
          data: {
            ...data,
            path: vPath,
            type: "reference",
          },
        });
      },
    }),
    tagFile: t.prismaField({
      type: "FileEntry",
      args: {
        fileId: t.arg.id({ required: true }),
        tag: t.arg.string({ required: true }),
      },
      resolve(query, _src, args, ctx) {
        const onFiles = {
          create: {
            fileId: args.fileId,
          },
        };
        return ctx.db.tag
          .upsert({
            where: { name: args.tag },
            create: {
              name: args.tag,
              onFiles,
            },
            update: { onFiles },
            include: {
              onFiles: {
                where: { fileId: { equals: args.fileId } },
                include: {
                  file: {
                    ...query,
                  },
                },
              },
            },
          })
          .then((res) => res.onFiles[0].file);
      },
    }),
    untagFile: t.prismaField({
      type: "FileEntry",
      args: {
        fileId: t.arg.id({ required: true }),
        tag: t.arg.string({ required: true }),
      },
      resolve(query, _src, args, ctx) {
        return ctx.db.tagOnFile
          .delete({
            where: {
              tagName_fileId: {
                fileId: args.fileId,
                tagName: args.tag,
              },
            },
            include: {
              file: query,
            },
          })
          .then((res) => res.file);
      },
    }),
    associateFiles: t.prismaField({
      type: ["FileEntry"],
      args: {
        file1Id: t.arg.id({ required: true }),
        file2Id: t.arg.id({ required: true }),
      },
      resolve(query, _src, { file1Id, file2Id }, ctx) {
        if (file1Id === file2Id) {
          return [];
        }

        return ctx.db.fileAssociations
          .create({
            data: {
              file1Id,
              file2Id,
            },
            include: {
              file1: query,
              file2: query,
            },
            // oxlint-disable-next-line typescript/no-unsafe-assignment typescript/no-unsafe-type-assertion
          })
          .then((res) => [res.file1, res.file2]);
      },
    }),
    disassociateFiles: t.prismaField({
      type: ["FileEntry"],
      args: {
        file1Id: t.arg.id({ required: true }),
        file2Id: t.arg.id({ required: true }),
      },
      resolve(query, _src, { file1Id, file2Id }, ctx) {
        if (file1Id === file2Id) {
          return [];
        }

        return ctx.db.fileAssociations
          .deleteMany({
            where: {
              OR: [
                { file1Id: { equals: file1Id }, file2Id: { equals: file2Id } },
                { file1Id: { equals: file2Id }, file2Id: { equals: file1Id } },
              ],
            },
          })
          .then(() =>
            ctx.db.fileEntry.findMany({
              ...query,
              where: {
                id: { in: [file1Id, file2Id] },
              },
            }),
          );
      },
    }),
    updateMetadata: t.prismaField({
      type: "FileEntry",
      args: {
        fileId: t.arg.id({ required: true }),
        // oxlint-disable-next-line typescript/no-unsafe-type-assertion
        data: t.arg({ type: "FileMetadataUpdateInput" as never, required: true }),
      },
      resolve(query, _src, args, ctx) {
        const updateInput = args.data as FileMetadataUpdateInput;
        return ctx.db.fileMetadata
          .upsert({
            where: { fileId: args.fileId },
            // oxlint-disable-next-line typescript/no-unsafe-assignment
            create: {
              file: { connect: { id: args.fileId } },
              // oxlint-disable-next-line typescript/no-unsafe-type-assertion
              ...(unnullifyObject(updateInput) as any),
            },
            // oxlint-disable-next-line typescript/no-unsafe-assignment typescript/no-unsafe-type-assertion
            update: unnullifyObject(updateInput) as any,
            select: { file: query },
          })
          .then((res) => res.file);
      },
    }),
  }),
};
