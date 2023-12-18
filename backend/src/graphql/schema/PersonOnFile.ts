import { extendType, idArg, inputObjectType, nonNull, objectType } from "nexus";

import { combinationOperators, makeListRelationWhereInput, makeRelationCreateInput, makeRelationUpdateInput } from "./utils";



export const PersonOnFile = objectType({
    name: "PersonOnFile",
    definition(t) {
        t.string("notes");
        t.string("instrument");

        t.nonNull.id("fileId");
        t.nonNull.field("file", {
            type: "FileEntry",
            resolve: (src, _, ctx) => {
                return ctx.prisma.fileEntry.findUniqueOrThrow({
                    where: { id: src.fileId }
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

export const PersonIdFileIdInput = inputObjectType({
    name: "PersonIdFileIdInput",
    definition(t) {
        t.nonNull.id("personId");
        t.nonNull.id("fileId");
    },
});
export const PersonOnFileUniqueWhereInput = inputObjectType({
    name: "PersonOnFileUniqueWhereInput",
    definition(t) {
        t.nonNull.field("personId_fileId", {
            type: PersonIdFileIdInput
        });
    },
});

export const PersonOnFileWhereInput = inputObjectType({
    name: "PersonOnFileWhereInput",
    definition(t) {
        t.field("notes", { type: "StringNullableFilterInput" });
        t.field("instrument", { type: "StringNullableFilterInput" });

        t.field("fileId", { type: "IdNullableFilterInput" });
        t.field("file", { type: "FileEntryWhereInput" });
        t.field("personId", { type: "IdNullableFilterInput" });
        t.field("person", { type: "PersonWhereInput" });

        combinationOperators(t, "PersonOnFileWhereInput");
    },
});
export const PersonOnFileWhereManyInput = makeListRelationWhereInput("PersonOnFileWhereManyInput", "PersonOnFileWhereInput");



// Inputs for relationships from Person to PersonOnFile.
export const PersonOnFilePersonCreateInput = inputObjectType({
    name: "PersonOnFilePersonCreateInput",
    definition(t) {
        t.nonNull.id("fileId");
        t.string("notes");
        t.string("instrument");
    },
});
export const PersonOnFilePersonRelationCreateInput = makeRelationCreateInput("PersonOnFilePersonRelationCreateInput", "PersonOnFileUniqueWhereInput", "PersonOnFilePersonCreateInput");
export const PersonOnFilePersonRelationUpdateInput = makeRelationUpdateInput("PersonOnFilePersonRelationUpdateInput", "PersonOnFileUniqueWhereInput", "PersonOnFilePersonCreateInput");

// Inputs for relationships from FileEntry to PersonOnFile.
export const PersonOnFileFileCreateInput = inputObjectType({
    name: "PersonOnFileFileCreateInput",
    definition(t) {
        t.nonNull.id("personId");
        t.string("notes");
        t.string("instrument");
    },
});
export const PersonOnFileFileRelationCreateInput = makeRelationCreateInput("PersonOnFileFileRelationCreateInput", "PersonOnFileUniqueWhereInput", "PersonOnFileFileCreateInput");
export const PersonOnFileFileRelationUpdateInput = makeRelationUpdateInput("PersonOnFileFileRelationUpdateInput", "PersonOnFileUniqueWhereInput", "PersonOnFileFileCreateInput");



export const PersonOnFileMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.boolean("removePersonFromFile", {
            args: {
                fileId: nonNull(idArg()),
                personId: nonNull(idArg()),
            },
            resolve(_, { fileId, personId }, ctx) {
                return ctx.prisma.personOnFile.delete({
                    where: {
                        personId_fileId: {
                            personId, fileId
                        }
                    }
                }).then(() => true).catch(() => false);
            }
        });
    },
});
