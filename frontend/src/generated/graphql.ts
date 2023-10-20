import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type FileEntry = {
  __typename?: 'FileEntry';
  associatedFiles: Array<FileEntry>;
  children?: Maybe<Array<FileEntry>>;
  id: Scalars['ID']['output'];
  metadata?: Maybe<FileMetadata>;
  name: Scalars['String']['output'];
  parent?: Maybe<FileEntry>;
  parentId?: Maybe<Scalars['ID']['output']>;
  people: Array<Person>;
  tags: Array<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type FileEntryWhereInput = {
  id?: InputMaybe<IdNullableFilterInput>;
  name?: InputMaybe<StringNullableFilterInput>;
  parentId?: InputMaybe<IdNullableFilterInput>;
  tags?: InputMaybe<StringNullableArrayFilterInput>;
  type?: InputMaybe<StringNullableFilterInput>;
  url?: InputMaybe<StringNullableFilterInput>;
};

export type FileMetadata = {
  __typename?: 'FileMetadata';
  file: FileEntry;
  fileId: Scalars['ID']['output'];
  location?: Maybe<LatLng>;
  locationId?: Maybe<Scalars['ID']['output']>;
};

export type FileMetadataCreateLocationInput = {
  connect?: InputMaybe<IdWhereUniqueInput>;
  create?: InputMaybe<LatLngCreateInput>;
};

export type FileMetadataUpdateInput = {
  location?: InputMaybe<FileMetadataCreateLocationInput>;
};

export type FilesForPersonCreateInput = {
  connect?: InputMaybe<Array<IdWhereUniqueInput>>;
};

export type FilesForPersonUpdateInput = {
  connect?: InputMaybe<Array<IdWhereUniqueInput>>;
  disconnect?: InputMaybe<Array<IdWhereUniqueInput>>;
};

export type IdNullableFilterInput = {
  equals?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  not?: InputMaybe<NestedIdNullableFilterInput>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type IdWhereUniqueInput = {
  id: Scalars['ID']['input'];
};

export type LatLng = {
  __typename?: 'LatLng';
  id: Scalars['ID']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type LatLngCreateInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  associateFiles?: Maybe<Array<FileEntry>>;
  createDirectory?: Maybe<FileEntry>;
  createPerson: Person;
  createVillage: Village;
  disassociateFiles?: Maybe<Array<FileEntry>>;
  /** Perform a full scan of OneDrive and other file sources. Creates, updates, and deletes entries as necessary. */
  fullscan?: Maybe<FileEntry>;
  tagFile: FileEntry;
  untagFile: FileEntry;
  updateMetadata: FileEntry;
  updatePerson: Person;
};


export type MutationAssociateFilesArgs = {
  file1Id: Scalars['ID']['input'];
  file2Id: Scalars['ID']['input'];
};


export type MutationCreateDirectoryArgs = {
  name: Scalars['String']['input'];
  parentId: Scalars['ID']['input'];
};


export type MutationCreatePersonArgs = {
  data: PersonCreateInput;
};


export type MutationCreateVillageArgs = {
  data: VillageCreateInput;
};


export type MutationDisassociateFilesArgs = {
  file1Id: Scalars['ID']['input'];
  file2Id: Scalars['ID']['input'];
};


export type MutationTagFileArgs = {
  fileId: Scalars['ID']['input'];
  tag: Scalars['String']['input'];
};


export type MutationUntagFileArgs = {
  fileId: Scalars['ID']['input'];
  tag: Scalars['String']['input'];
};


export type MutationUpdateMetadataArgs = {
  data: FileMetadataUpdateInput;
  fileId: Scalars['ID']['input'];
};


export type MutationUpdatePersonArgs = {
  data: PersonUpdateInput;
  id: Scalars['ID']['input'];
};

export type NestedIdNullableFilterInput = {
  equals?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  not?: InputMaybe<NestedIdNullableFilterInput>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type NestedStringNullableFilterInput = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringNullableFilterInput>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Person = {
  __typename?: 'Person';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  children: Array<Person>;
  files: Array<FileEntry>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  parent?: Maybe<Person>;
  parentId?: Maybe<Scalars['String']['output']>;
  villages: Array<PersonInVillage>;
};

export type PersonCreateInput = {
  files?: InputMaybe<FilesForPersonCreateInput>;
  name: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['String']['input']>;
  villages?: InputMaybe<PersonInVillageRelationCreateInput>;
};

export type PersonIdVillageIdInput = {
  personId: Scalars['ID']['input'];
  villageId: Scalars['ID']['input'];
};

export type PersonInVillage = {
  __typename?: 'PersonInVillage';
  description?: Maybe<Scalars['String']['output']>;
  person: Person;
  personId: Scalars['ID']['output'];
  village: Village;
  villageId: Scalars['ID']['output'];
};

export type PersonInVillageCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  villageId: Scalars['ID']['input'];
};

export type PersonInVillageRelationCreateInput = {
  connect?: InputMaybe<PersonInVillageUniqueWhereInput>;
  create?: InputMaybe<PersonInVillageCreateInput>;
};

export type PersonInVillageRelationUpdateInput = {
  connect?: InputMaybe<PersonInVillageUniqueWhereInput>;
  create?: InputMaybe<PersonInVillageCreateInput>;
  delete?: InputMaybe<PersonInVillageUniqueWhereInput>;
};

export type PersonInVillageUniqueWhereInput = {
  personId_villageId: PersonIdVillageIdInput;
};

export type PersonInVillageWhereInput = {
  AND?: InputMaybe<Array<PersonInVillageWhereInput>>;
  NOT?: InputMaybe<Array<PersonInVillageWhereInput>>;
  OR?: InputMaybe<Array<PersonInVillageWhereInput>>;
  description?: InputMaybe<StringNullableFilterInput>;
  person?: InputMaybe<PersonWhereInput>;
  personId?: InputMaybe<IdNullableFilterInput>;
  village?: InputMaybe<VillageWhereInput>;
  villageId?: InputMaybe<IdNullableFilterInput>;
};

export type PersonInVillageWhereManyInput = {
  every?: InputMaybe<PersonInVillageWhereInput>;
  none?: InputMaybe<PersonInVillageWhereInput>;
  some?: InputMaybe<PersonInVillageWhereInput>;
};

export type PersonOrderByInput = {
  name?: InputMaybe<OrderDirection>;
};

export type PersonUpdateInput = {
  files?: InputMaybe<FilesForPersonUpdateInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['String']['input']>;
  villages?: InputMaybe<PersonInVillageRelationUpdateInput>;
};

export type PersonWhereInput = {
  AND?: InputMaybe<Array<PersonWhereInput>>;
  NOT?: InputMaybe<Array<PersonWhereInput>>;
  OR?: InputMaybe<Array<PersonWhereInput>>;
  children?: InputMaybe<PersonWhereManyInput>;
  id?: InputMaybe<IdNullableFilterInput>;
  name?: InputMaybe<StringNullableFilterInput>;
  parent?: InputMaybe<PersonWhereInput>;
  parentId?: InputMaybe<IdNullableFilterInput>;
  villages?: InputMaybe<PersonInVillageWhereManyInput>;
};

export type PersonWhereManyInput = {
  every?: InputMaybe<PersonWhereInput>;
  none?: InputMaybe<PersonWhereInput>;
  some?: InputMaybe<PersonWhereInput>;
};

export type Query = {
  __typename?: 'Query';
  fileEntries: Array<FileEntry>;
  fileEntry?: Maybe<FileEntry>;
  people: Array<Person>;
  person?: Maybe<Person>;
  rootFileEntry: FileEntry;
  tags: Array<Scalars['String']['output']>;
  village?: Maybe<Village>;
  villages: Array<Village>;
};


export type QueryFileEntriesArgs = {
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FileEntryWhereInput>;
};


export type QueryFileEntryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPeopleArgs = {
  orderBy?: InputMaybe<PersonOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
  where?: InputMaybe<PersonWhereInput>;
};


export type QueryPersonArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVillageArgs = {
  id: Scalars['ID']['input'];
};

export type StringNullableArrayFilterInput = {
  every?: InputMaybe<StringNullableFilterInput>;
  none?: InputMaybe<StringNullableFilterInput>;
  some?: InputMaybe<StringNullableFilterInput>;
};

export type StringNullableFilterInput = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringNullableFilterInput>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export enum StringQueryModeEnum {
  Default = 'default',
  Insensitive = 'insensitive'
}

export type Village = {
  __typename?: 'Village';
  id: Scalars['ID']['output'];
  location: LatLng;
  locationId: Scalars['String']['output'];
  name: Scalars['String']['output'];
  people: Array<PersonInVillage>;
};

export type VillageCreateInput = {
  location: VillageCreateLocationInput;
  name: Scalars['String']['input'];
};

export type VillageCreateLocationInput = {
  connect?: InputMaybe<IdWhereUniqueInput>;
  create?: InputMaybe<LatLngCreateInput>;
};

export type VillageWhereInput = {
  id?: InputMaybe<IdNullableFilterInput>;
  name?: InputMaybe<StringNullableFilterInput>;
};

export type PersonInContextFragment = { __typename?: 'Person', id: string, name: string, avatarUrl?: string | null, files: Array<{ __typename?: 'FileEntry', id: string }>, parent?: { __typename?: 'Person', id: string, name: string } | null };

export type VillageInContextFragment = { __typename?: 'Village', id: string, name: string, location: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } };

export type GetFullContextQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFullContextQuery = { __typename?: 'Query', fileEntries: Array<{ __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null, associatedFiles: Array<{ __typename?: 'FileEntry', id: string, name: string }> }>, people: Array<{ __typename?: 'Person', id: string, name: string, avatarUrl?: string | null, files: Array<{ __typename?: 'FileEntry', id: string }>, parent?: { __typename?: 'Person', id: string, name: string } | null }>, villages: Array<{ __typename?: 'Village', id: string, name: string, location: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } }> };

export type GetAllTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTagsQuery = { __typename?: 'Query', tags: Array<string> };

export type LocationCompleteFragment = { __typename?: 'LatLng', id: string, latitude: number, longitude: number };

export type MetadataBasicFragment = { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null };

export type FileEntryBasicFragment = { __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null, associatedFiles: Array<{ __typename?: 'FileEntry', id: string, name: string }> };

export type FileEntryWithChildrenFragment = { __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, children?: Array<{ __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null, associatedFiles: Array<{ __typename?: 'FileEntry', id: string, name: string }> }> | null, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null, associatedFiles: Array<{ __typename?: 'FileEntry', id: string, name: string }> };

export type GetRootFileEntryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRootFileEntryQuery = { __typename?: 'Query', rootFileEntry: { __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, children?: Array<{ __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null, associatedFiles: Array<{ __typename?: 'FileEntry', id: string, name: string }> }> | null, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null, associatedFiles: Array<{ __typename?: 'FileEntry', id: string, name: string }> } };

export type GetFileEntryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFileEntryQuery = { __typename?: 'Query', fileEntry?: { __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, children?: Array<{ __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null, associatedFiles: Array<{ __typename?: 'FileEntry', id: string, name: string }> }> | null, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null, associatedFiles: Array<{ __typename?: 'FileEntry', id: string, name: string }> } | null };

export type GetAllFileEntriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllFileEntriesQuery = { __typename?: 'Query', fileEntries: Array<{ __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null, associatedFiles: Array<{ __typename?: 'FileEntry', id: string, name: string }> }> };

export type GetFileEntriesQueryVariables = Exact<{
  where?: InputMaybe<FileEntryWhereInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetFileEntriesQuery = { __typename?: 'Query', fileEntries: Array<{ __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null, associatedFiles: Array<{ __typename?: 'FileEntry', id: string, name: string }> }> };

export type CreateFolderMutationVariables = Exact<{
  parentId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
}>;


export type CreateFolderMutation = { __typename?: 'Mutation', createDirectory?: { __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null, associatedFiles: Array<{ __typename?: 'FileEntry', id: string, name: string }> } | null };

export type AssignFileMetadataMutationVariables = Exact<{
  fileId: Scalars['ID']['input'];
  data: FileMetadataUpdateInput;
}>;


export type AssignFileMetadataMutation = { __typename?: 'Mutation', updateMetadata: { __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null, associatedFiles: Array<{ __typename?: 'FileEntry', id: string, name: string }> } };

export type TagFileMutationVariables = Exact<{
  fileId: Scalars['ID']['input'];
  tag: Scalars['String']['input'];
}>;


export type TagFileMutation = { __typename?: 'Mutation', tagFile: { __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null, associatedFiles: Array<{ __typename?: 'FileEntry', id: string, name: string }> } };

export type UntagFileMutationVariables = Exact<{
  fileId: Scalars['ID']['input'];
  tag: Scalars['String']['input'];
}>;


export type UntagFileMutation = { __typename?: 'Mutation', untagFile: { __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null, associatedFiles: Array<{ __typename?: 'FileEntry', id: string, name: string }> } };

export type AssociateFilesMutationVariables = Exact<{
  file1Id: Scalars['ID']['input'];
  file2Id: Scalars['ID']['input'];
}>;


export type AssociateFilesMutation = { __typename?: 'Mutation', associateFiles?: Array<{ __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null, associatedFiles: Array<{ __typename?: 'FileEntry', id: string, name: string }> }> | null };

export type DisassociateFilesMutationVariables = Exact<{
  file1Id: Scalars['ID']['input'];
  file2Id: Scalars['ID']['input'];
}>;


export type DisassociateFilesMutation = { __typename?: 'Mutation', disassociateFiles?: Array<{ __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null, associatedFiles: Array<{ __typename?: 'FileEntry', id: string, name: string }> }> | null };

export type StartFullScanMutationVariables = Exact<{ [key: string]: never; }>;


export type StartFullScanMutation = { __typename?: 'Mutation', fullscan?: { __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, children?: Array<{ __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null, associatedFiles: Array<{ __typename?: 'FileEntry', id: string, name: string }> }> | null, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null, associatedFiles: Array<{ __typename?: 'FileEntry', id: string, name: string }> } | null };

export type SimplePersonFragment = { __typename?: 'Person', id: string, name: string, avatarUrl?: string | null };

export type PersonAndParentFragment = { __typename?: 'Person', id: string, name: string, avatarUrl?: string | null, parent?: { __typename?: 'Person', id: string, name: string, avatarUrl?: string | null } | null };

export type PersonForTableFragment = { __typename?: 'Person', id: string, name: string, avatarUrl?: string | null, parent?: { __typename?: 'Person', id: string, name: string, avatarUrl?: string | null } | null, children: Array<{ __typename?: 'Person', id: string, name: string, avatarUrl?: string | null }>, villages: Array<{ __typename?: 'PersonInVillage', description?: string | null, village: { __typename?: 'Village', id: string, name: string } }> };

export type GetAllPeopleQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllPeopleQuery = { __typename?: 'Query', people: Array<{ __typename?: 'Person', id: string, name: string, avatarUrl?: string | null, parent?: { __typename?: 'Person', id: string, name: string, avatarUrl?: string | null } | null }> };

export type GetPeopleQueryVariables = Exact<{
  where?: InputMaybe<PersonWhereInput>;
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PersonOrderByInput>;
}>;


export type GetPeopleQuery = { __typename?: 'Query', people: Array<{ __typename?: 'Person', id: string, name: string, avatarUrl?: string | null, parent?: { __typename?: 'Person', id: string, name: string, avatarUrl?: string | null } | null, children: Array<{ __typename?: 'Person', id: string, name: string, avatarUrl?: string | null }>, villages: Array<{ __typename?: 'PersonInVillage', description?: string | null, village: { __typename?: 'Village', id: string, name: string } }> }> };

export type GetPersonQueryVariables = Exact<{
  personId: Scalars['ID']['input'];
}>;


export type GetPersonQuery = { __typename?: 'Query', person?: { __typename?: 'Person', id: string, name: string, avatarUrl?: string | null, files: Array<{ __typename?: 'FileEntry', id: string }>, parent?: { __typename?: 'Person', id: string, name: string } | null } | null };

export type CreatePersonMutationVariables = Exact<{
  data: PersonCreateInput;
}>;


export type CreatePersonMutation = { __typename?: 'Mutation', createPerson: { __typename?: 'Person', id: string, name: string, avatarUrl?: string | null, parent?: { __typename?: 'Person', id: string, name: string, avatarUrl?: string | null } | null } };

export type UpdatePersonMutationVariables = Exact<{
  personId: Scalars['ID']['input'];
  data: PersonUpdateInput;
}>;


export type UpdatePersonMutation = { __typename?: 'Mutation', updatePerson: { __typename?: 'Person', id: string, name: string, avatarUrl?: string | null, files: Array<{ __typename?: 'FileEntry', id: string }>, parent?: { __typename?: 'Person', id: string, name: string } | null } };

export type SimpleVillageFragment = { __typename?: 'Village', id: string, name: string, location: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } };

export type GetAllVillagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllVillagesQuery = { __typename?: 'Query', villages: Array<{ __typename?: 'Village', id: string, name: string, location: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } }> };

export type CreateVillageMutationVariables = Exact<{
  data: VillageCreateInput;
}>;


export type CreateVillageMutation = { __typename?: 'Mutation', createVillage: { __typename?: 'Village', id: string, name: string, location: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } } };

export const PersonInContextFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonInContext"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Person"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<PersonInContextFragment, unknown>;
export const LocationCompleteFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]} as unknown as DocumentNode<LocationCompleteFragment, unknown>;
export const VillageInContextFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VillageInContext"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Village"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]} as unknown as DocumentNode<VillageInContextFragment, unknown>;
export const MetadataBasicFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]} as unknown as DocumentNode<MetadataBasicFragment, unknown>;
export const FileEntryBasicFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MetadataBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"associatedFiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}}]} as unknown as DocumentNode<FileEntryBasicFragment, unknown>;
export const FileEntryWithChildrenFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryWithChildren"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MetadataBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"associatedFiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]} as unknown as DocumentNode<FileEntryWithChildrenFragment, unknown>;
export const SimplePersonFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimplePerson"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Person"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]} as unknown as DocumentNode<SimplePersonFragment, unknown>;
export const PersonAndParentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonAndParent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Person"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimplePerson"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimplePerson"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimplePerson"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Person"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]} as unknown as DocumentNode<PersonAndParentFragment, unknown>;
export const PersonForTableFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonForTable"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Person"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimplePerson"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimplePerson"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimplePerson"}}]}},{"kind":"Field","name":{"kind":"Name","value":"villages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"village"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimplePerson"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Person"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]} as unknown as DocumentNode<PersonForTableFragment, unknown>;
export const SimpleVillageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleVillage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Village"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]}}]} as unknown as DocumentNode<SimpleVillageFragment, unknown>;
export const GetFullContextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFullContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fileEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"people"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonInContext"}}]}},{"kind":"Field","name":{"kind":"Name","value":"villages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VillageInContext"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MetadataBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"associatedFiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonInContext"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Person"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VillageInContext"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Village"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}}]} as unknown as DocumentNode<GetFullContextQuery, GetFullContextQueryVariables>;
export const GetAllTagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllTags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]} as unknown as DocumentNode<GetAllTagsQuery, GetAllTagsQueryVariables>;
export const GetRootFileEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRootFileEntry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rootFileEntry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryWithChildren"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MetadataBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"associatedFiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryWithChildren"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}}]}}]}}]} as unknown as DocumentNode<GetRootFileEntryQuery, GetRootFileEntryQueryVariables>;
export const GetFileEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFileEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fileEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryWithChildren"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MetadataBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"associatedFiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryWithChildren"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}}]}}]}}]} as unknown as DocumentNode<GetFileEntryQuery, GetFileEntryQueryVariables>;
export const GetAllFileEntriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllFileEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fileEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MetadataBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"associatedFiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]} as unknown as DocumentNode<GetAllFileEntriesQuery, GetAllFileEntriesQueryVariables>;
export const GetFileEntriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFileEntries"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntryWhereInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fileEntries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MetadataBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"associatedFiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]} as unknown as DocumentNode<GetFileEntriesQuery, GetFileEntriesQueryVariables>;
export const CreateFolderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFolder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDirectory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"parentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MetadataBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"associatedFiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]} as unknown as DocumentNode<CreateFolderMutation, CreateFolderMutationVariables>;
export const AssignFileMetadataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignFileMetadata"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadataUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMetadata"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fileId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MetadataBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"associatedFiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]} as unknown as DocumentNode<AssignFileMetadataMutation, AssignFileMetadataMutationVariables>;
export const TagFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TagFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tag"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tagFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fileId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}}},{"kind":"Argument","name":{"kind":"Name","value":"tag"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tag"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MetadataBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"associatedFiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]} as unknown as DocumentNode<TagFileMutation, TagFileMutationVariables>;
export const UntagFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UntagFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tag"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"untagFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fileId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}}},{"kind":"Argument","name":{"kind":"Name","value":"tag"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tag"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MetadataBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"associatedFiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]} as unknown as DocumentNode<UntagFileMutation, UntagFileMutationVariables>;
export const AssociateFilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssociateFiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"file1Id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"file2Id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associateFiles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"file1Id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"file1Id"}}},{"kind":"Argument","name":{"kind":"Name","value":"file2Id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"file2Id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MetadataBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"associatedFiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]} as unknown as DocumentNode<AssociateFilesMutation, AssociateFilesMutationVariables>;
export const DisassociateFilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DisassociateFiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"file1Id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"file2Id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disassociateFiles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"file1Id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"file1Id"}}},{"kind":"Argument","name":{"kind":"Name","value":"file2Id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"file2Id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MetadataBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"associatedFiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]} as unknown as DocumentNode<DisassociateFilesMutation, DisassociateFilesMutationVariables>;
export const StartFullScanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartFullScan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullscan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryWithChildren"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MetadataBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"associatedFiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryWithChildren"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}}]}}]}}]} as unknown as DocumentNode<StartFullScanMutation, StartFullScanMutationVariables>;
export const GetAllPeopleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllPeople"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"people"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonAndParent"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimplePerson"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Person"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonAndParent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Person"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimplePerson"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimplePerson"}}]}}]}}]} as unknown as DocumentNode<GetAllPeopleQuery, GetAllPeopleQueryVariables>;
export const GetPeopleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPeople"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PersonWhereInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PersonOrderByInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"people"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonForTable"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimplePerson"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Person"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonForTable"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Person"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimplePerson"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimplePerson"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimplePerson"}}]}},{"kind":"Field","name":{"kind":"Name","value":"villages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"village"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetPeopleQuery, GetPeopleQueryVariables>;
export const GetPersonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPerson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"personId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"personId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonInContext"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonInContext"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Person"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetPersonQuery, GetPersonQueryVariables>;
export const CreatePersonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePerson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PersonCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonAndParent"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimplePerson"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Person"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonAndParent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Person"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimplePerson"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimplePerson"}}]}}]}}]} as unknown as DocumentNode<CreatePersonMutation, CreatePersonMutationVariables>;
export const UpdatePersonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePerson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"personId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PersonUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"personId"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonInContext"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonInContext"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Person"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdatePersonMutation, UpdatePersonMutationVariables>;
export const GetAllVillagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllVillages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"villages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimpleVillage"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleVillage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Village"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]}}]} as unknown as DocumentNode<GetAllVillagesQuery, GetAllVillagesQueryVariables>;
export const CreateVillageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVillage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VillageCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVillage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimpleVillage"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleVillage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Village"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]}}]} as unknown as DocumentNode<CreateVillageMutation, CreateVillageMutationVariables>;