/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */

import type * as prisma from "./node_modules/.prisma/client/index"
import type { Context } from "./src/graphql/context"




declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  FileEntryWhereInput: { // input type
    id?: NexusGenInputs['IdNullableFilterInput'] | null; // IdNullableFilterInput
    name?: NexusGenInputs['StringNullableFilterInput'] | null; // StringNullableFilterInput
    parentId?: NexusGenInputs['IdNullableFilterInput'] | null; // IdNullableFilterInput
    tags?: NexusGenInputs['StringNullableArrayFilterInput'] | null; // StringNullableArrayFilterInput
    type?: NexusGenInputs['StringNullableFilterInput'] | null; // StringNullableFilterInput
    url?: NexusGenInputs['StringNullableFilterInput'] | null; // StringNullableFilterInput
  }
  FileMetadataCreateLocationInput: { // input type
    connect?: NexusGenInputs['IdWhereUniqueInput'] | null; // IdWhereUniqueInput
    create?: NexusGenInputs['LatLngCreateInput'] | null; // LatLngCreateInput
  }
  FileMetadataUpdateInput: { // input type
    location?: NexusGenInputs['FileMetadataCreateLocationInput'] | null; // FileMetadataCreateLocationInput
  }
  FilesForPersonCreateInput: { // input type
    connect?: NexusGenInputs['IdWhereUniqueInput'][] | null; // [IdWhereUniqueInput!]
  }
  FilesForPersonUpdateInput: { // input type
    connect?: NexusGenInputs['IdWhereUniqueInput'][] | null; // [IdWhereUniqueInput!]
    disconnect?: NexusGenInputs['IdWhereUniqueInput'][] | null; // [IdWhereUniqueInput!]
  }
  IdNullableFilterInput: { // input type
    equals?: string | null; // String
    in?: string[] | null; // [String!]
    not?: NexusGenInputs['NestedIdNullableFilterInput'] | null; // NestedIdNullableFilterInput
    notIn?: string[] | null; // [String!]
  }
  IdWhereUniqueInput: { // input type
    id: string; // ID!
  }
  LatLngCreateInput: { // input type
    latitude: number; // Float!
    longitude: number; // Float!
  }
  NestedIdNullableFilterInput: { // input type
    equals?: string | null; // String
    in?: string[] | null; // [String!]
    not?: NexusGenInputs['NestedIdNullableFilterInput'] | null; // NestedIdNullableFilterInput
    notIn?: string[] | null; // [String!]
  }
  NestedStringNullableFilterInput: { // input type
    contains?: string | null; // String
    endsWith?: string | null; // String
    equals?: string | null; // String
    gt?: string | null; // String
    gte?: string | null; // String
    in?: string[] | null; // [String!]
    lt?: string | null; // String
    lte?: string | null; // String
    not?: NexusGenInputs['NestedStringNullableFilterInput'] | null; // NestedStringNullableFilterInput
    notIn?: string[] | null; // [String!]
    startsWith?: string | null; // String
  }
  PersonCreateInput: { // input type
    files?: NexusGenInputs['FilesForPersonCreateInput'] | null; // FilesForPersonCreateInput
    name: string; // String!
    parentId?: string | null; // String
    villages?: NexusGenInputs['PersonInVillageRelationCreateInput'] | null; // PersonInVillageRelationCreateInput
  }
  PersonIdVillageIdInput: { // input type
    personId: string; // ID!
    villageId: string; // ID!
  }
  PersonInVillageCreateInput: { // input type
    description?: string | null; // String
    villageId: string; // ID!
  }
  PersonInVillageRelationCreateInput: { // input type
    connect?: NexusGenInputs['PersonInVillageUniqueWhereInput'] | null; // PersonInVillageUniqueWhereInput
    create?: NexusGenInputs['PersonInVillageCreateInput'] | null; // PersonInVillageCreateInput
  }
  PersonInVillageRelationUpdateInput: { // input type
    connect?: NexusGenInputs['PersonInVillageUniqueWhereInput'] | null; // PersonInVillageUniqueWhereInput
    create?: NexusGenInputs['PersonInVillageCreateInput'] | null; // PersonInVillageCreateInput
    delete?: NexusGenInputs['PersonInVillageUniqueWhereInput'] | null; // PersonInVillageUniqueWhereInput
  }
  PersonInVillageUniqueWhereInput: { // input type
    personId_villageId: NexusGenInputs['PersonIdVillageIdInput']; // PersonIdVillageIdInput!
  }
  PersonInVillageWhereInput: { // input type
    AND?: NexusGenInputs['PersonInVillageWhereInput'][] | null; // [PersonInVillageWhereInput!]
    NOT?: NexusGenInputs['PersonInVillageWhereInput'][] | null; // [PersonInVillageWhereInput!]
    OR?: NexusGenInputs['PersonInVillageWhereInput'][] | null; // [PersonInVillageWhereInput!]
    description?: NexusGenInputs['StringNullableFilterInput'] | null; // StringNullableFilterInput
    person?: NexusGenInputs['PersonWhereInput'] | null; // PersonWhereInput
    personId?: NexusGenInputs['IdNullableFilterInput'] | null; // IdNullableFilterInput
    village?: NexusGenInputs['VillageWhereInput'] | null; // VillageWhereInput
    villageId?: NexusGenInputs['IdNullableFilterInput'] | null; // IdNullableFilterInput
  }
  PersonInVillageWhereManyInput: { // input type
    every?: NexusGenInputs['PersonInVillageWhereInput'] | null; // PersonInVillageWhereInput
    none?: NexusGenInputs['PersonInVillageWhereInput'] | null; // PersonInVillageWhereInput
    some?: NexusGenInputs['PersonInVillageWhereInput'] | null; // PersonInVillageWhereInput
  }
  PersonOrderByInput: { // input type
    name?: NexusGenEnums['OrderDirection'] | null; // OrderDirection
  }
  PersonUpdateInput: { // input type
    files?: NexusGenInputs['FilesForPersonUpdateInput'] | null; // FilesForPersonUpdateInput
    name?: string | null; // String
    parentId?: string | null; // String
    villages?: NexusGenInputs['PersonInVillageRelationUpdateInput'] | null; // PersonInVillageRelationUpdateInput
  }
  PersonWhereInput: { // input type
    AND?: NexusGenInputs['PersonWhereInput'][] | null; // [PersonWhereInput!]
    NOT?: NexusGenInputs['PersonWhereInput'][] | null; // [PersonWhereInput!]
    OR?: NexusGenInputs['PersonWhereInput'][] | null; // [PersonWhereInput!]
    children?: NexusGenInputs['PersonWhereManyInput'] | null; // PersonWhereManyInput
    id?: NexusGenInputs['IdNullableFilterInput'] | null; // IdNullableFilterInput
    name?: NexusGenInputs['StringNullableFilterInput'] | null; // StringNullableFilterInput
    parent?: NexusGenInputs['PersonWhereInput'] | null; // PersonWhereInput
    parentId?: NexusGenInputs['IdNullableFilterInput'] | null; // IdNullableFilterInput
    villages?: NexusGenInputs['PersonInVillageWhereManyInput'] | null; // PersonInVillageWhereManyInput
  }
  PersonWhereManyInput: { // input type
    every?: NexusGenInputs['PersonWhereInput'] | null; // PersonWhereInput
    none?: NexusGenInputs['PersonWhereInput'] | null; // PersonWhereInput
    some?: NexusGenInputs['PersonWhereInput'] | null; // PersonWhereInput
  }
  StringNullableArrayFilterInput: { // input type
    every?: NexusGenInputs['StringNullableFilterInput'] | null; // StringNullableFilterInput
    none?: NexusGenInputs['StringNullableFilterInput'] | null; // StringNullableFilterInput
    some?: NexusGenInputs['StringNullableFilterInput'] | null; // StringNullableFilterInput
  }
  StringNullableFilterInput: { // input type
    contains?: string | null; // String
    endsWith?: string | null; // String
    equals?: string | null; // String
    gt?: string | null; // String
    gte?: string | null; // String
    in?: string[] | null; // [String!]
    lt?: string | null; // String
    lte?: string | null; // String
    not?: NexusGenInputs['NestedStringNullableFilterInput'] | null; // NestedStringNullableFilterInput
    notIn?: string[] | null; // [String!]
    startsWith?: string | null; // String
  }
  VillageCreateInput: { // input type
    location: NexusGenInputs['VillageCreateLocationInput']; // VillageCreateLocationInput!
    name: string; // String!
  }
  VillageCreateLocationInput: { // input type
    connect?: NexusGenInputs['IdWhereUniqueInput'] | null; // IdWhereUniqueInput
    create?: NexusGenInputs['LatLngCreateInput'] | null; // LatLngCreateInput
  }
  VillageWhereInput: { // input type
    id?: NexusGenInputs['IdNullableFilterInput'] | null; // IdNullableFilterInput
    name?: NexusGenInputs['StringNullableFilterInput'] | null; // StringNullableFilterInput
  }
}

export interface NexusGenEnums {
  OrderDirection: "asc" | "desc"
  StringQueryModeEnum: "default" | "insensitive"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
}

export interface NexusGenObjects {
  FileEntry: prisma.FileEntry;
  FileMetadata: prisma.FileMetadata;
  LatLng: prisma.LatLng;
  Mutation: {};
  Person: prisma.Person;
  PersonInVillage: prisma.PersonInVillage;
  Query: {};
  Village: prisma.Village;
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  FileEntry: { // field return type
    children: NexusGenRootTypes['FileEntry'][] | null; // [FileEntry!]
    id: string; // ID!
    metadata: NexusGenRootTypes['FileMetadata'] | null; // FileMetadata
    name: string; // String!
    parent: NexusGenRootTypes['FileEntry'] | null; // FileEntry
    parentId: string | null; // ID
    people: NexusGenRootTypes['Person'][]; // [Person!]!
    tags: string[]; // [String!]!
    type: string; // String!
    url: string | null; // String
  }
  FileMetadata: { // field return type
    file: NexusGenRootTypes['FileEntry']; // FileEntry!
    fileId: string; // ID!
    location: NexusGenRootTypes['LatLng'] | null; // LatLng
    locationId: string | null; // ID
  }
  LatLng: { // field return type
    id: string; // ID!
    latitude: number; // Float!
    longitude: number; // Float!
  }
  Mutation: { // field return type
    createPerson: NexusGenRootTypes['Person']; // Person!
    createVillage: NexusGenRootTypes['Village']; // Village!
    fullscan: NexusGenRootTypes['FileEntry'] | null; // FileEntry
    tagFile: NexusGenRootTypes['FileEntry']; // FileEntry!
    untagFile: NexusGenRootTypes['FileEntry']; // FileEntry!
    updateMetadata: NexusGenRootTypes['FileEntry']; // FileEntry!
    updatePerson: NexusGenRootTypes['Person']; // Person!
  }
  Person: { // field return type
    children: NexusGenRootTypes['Person'][]; // [Person!]!
    files: NexusGenRootTypes['FileEntry'][]; // [FileEntry!]!
    id: string; // ID!
    name: string; // String!
    parent: NexusGenRootTypes['Person'] | null; // Person
    parentId: string | null; // String
    villages: NexusGenRootTypes['PersonInVillage'][]; // [PersonInVillage!]!
  }
  PersonInVillage: { // field return type
    description: string | null; // String
    person: NexusGenRootTypes['Person']; // Person!
    personId: string; // ID!
    village: NexusGenRootTypes['Village']; // Village!
    villageId: string; // ID!
  }
  Query: { // field return type
    fileEntries: NexusGenRootTypes['FileEntry'][]; // [FileEntry!]!
    fileEntry: NexusGenRootTypes['FileEntry'] | null; // FileEntry
    people: NexusGenRootTypes['Person'][]; // [Person!]!
    person: NexusGenRootTypes['Person'] | null; // Person
    rootFileEntry: NexusGenRootTypes['FileEntry']; // FileEntry!
    tags: string[]; // [String!]!
    village: NexusGenRootTypes['Village'] | null; // Village
    villages: NexusGenRootTypes['Village'][]; // [Village!]!
  }
  Village: { // field return type
    id: string; // ID!
    location: NexusGenRootTypes['LatLng']; // LatLng!
    locationId: string; // String!
    name: string; // String!
    people: NexusGenRootTypes['PersonInVillage'][]; // [PersonInVillage!]!
  }
}

export interface NexusGenFieldTypeNames {
  FileEntry: { // field return type name
    children: 'FileEntry'
    id: 'ID'
    metadata: 'FileMetadata'
    name: 'String'
    parent: 'FileEntry'
    parentId: 'ID'
    people: 'Person'
    tags: 'String'
    type: 'String'
    url: 'String'
  }
  FileMetadata: { // field return type name
    file: 'FileEntry'
    fileId: 'ID'
    location: 'LatLng'
    locationId: 'ID'
  }
  LatLng: { // field return type name
    id: 'ID'
    latitude: 'Float'
    longitude: 'Float'
  }
  Mutation: { // field return type name
    createPerson: 'Person'
    createVillage: 'Village'
    fullscan: 'FileEntry'
    tagFile: 'FileEntry'
    untagFile: 'FileEntry'
    updateMetadata: 'FileEntry'
    updatePerson: 'Person'
  }
  Person: { // field return type name
    children: 'Person'
    files: 'FileEntry'
    id: 'ID'
    name: 'String'
    parent: 'Person'
    parentId: 'String'
    villages: 'PersonInVillage'
  }
  PersonInVillage: { // field return type name
    description: 'String'
    person: 'Person'
    personId: 'ID'
    village: 'Village'
    villageId: 'ID'
  }
  Query: { // field return type name
    fileEntries: 'FileEntry'
    fileEntry: 'FileEntry'
    people: 'Person'
    person: 'Person'
    rootFileEntry: 'FileEntry'
    tags: 'String'
    village: 'Village'
    villages: 'Village'
  }
  Village: { // field return type name
    id: 'ID'
    location: 'LatLng'
    locationId: 'String'
    name: 'String'
    people: 'PersonInVillage'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createPerson: { // args
      data: NexusGenInputs['PersonCreateInput']; // PersonCreateInput!
    }
    createVillage: { // args
      data: NexusGenInputs['VillageCreateInput']; // VillageCreateInput!
    }
    tagFile: { // args
      fileId: string; // ID!
      tag: string; // String!
    }
    untagFile: { // args
      fileId: string; // ID!
      tag: string; // String!
    }
    updateMetadata: { // args
      data: NexusGenInputs['FileMetadataUpdateInput']; // FileMetadataUpdateInput!
      fileId: string; // ID!
    }
    updatePerson: { // args
      data: NexusGenInputs['PersonUpdateInput']; // PersonUpdateInput!
      id: string; // ID!
    }
  }
  Query: {
    fileEntries: { // args
      where?: NexusGenInputs['FileEntryWhereInput'] | null; // FileEntryWhereInput
    }
    fileEntry: { // args
      id: string; // ID!
    }
    people: { // args
      orderBy?: NexusGenInputs['PersonOrderByInput'] | null; // PersonOrderByInput
      skip: number; // Int!
      take: number; // Int!
      where?: NexusGenInputs['PersonWhereInput'] | null; // PersonWhereInput
    }
    person: { // args
      id: string; // ID!
    }
    village: { // args
      id: string; // ID!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}