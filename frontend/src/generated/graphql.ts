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
  children?: Maybe<Array<FileEntry>>;
  id: Scalars['ID']['output'];
  metadata?: Maybe<FileMetadata>;
  name: Scalars['String']['output'];
  parent?: Maybe<FileEntry>;
  parentId?: Maybe<Scalars['ID']['output']>;
  tags: Array<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
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
  /** Perform a full scan of OneDrive and other file sources. Creates, updates, and deletes entries as necessary. */
  fullscan?: Maybe<FileEntry>;
  tagFile: FileEntry;
  untagFile: FileEntry;
  updateMetadata: FileMetadata;
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

export type Query = {
  __typename?: 'Query';
  fileEntries: Array<FileEntry>;
  fileEntry?: Maybe<FileEntry>;
  rootFileEntry: FileEntry;
  tags: Array<Scalars['String']['output']>;
};


export type QueryFileEntryArgs = {
  id: Scalars['String']['input'];
};

export type LocationCompleteFragment = { __typename?: 'LatLng', id: string, latitude: number, longitude: number };

export type MetadataBasicFragment = { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null };

export type FileEntryBasicFragment = { __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null };

export type FileEntryWithChildrenFragment = { __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, children?: Array<{ __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null }> | null, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null };

export type GetRootFileEntryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRootFileEntryQuery = { __typename?: 'Query', rootFileEntry: { __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, children?: Array<{ __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null }> | null, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null } };

export type GetFileEntryQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetFileEntryQuery = { __typename?: 'Query', fileEntry?: { __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, children?: Array<{ __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null }> | null, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null } | null };

export type GetAllFileEntriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllFileEntriesQuery = { __typename?: 'Query', fileEntries: Array<{ __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null }> };

export type AssignFileMetadataMutationVariables = Exact<{
  fileId: Scalars['ID']['input'];
  data: FileMetadataUpdateInput;
}>;


export type AssignFileMetadataMutation = { __typename?: 'Mutation', updateMetadata: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } };

export type StartFullScanMutationVariables = Exact<{ [key: string]: never; }>;


export type StartFullScanMutation = { __typename?: 'Mutation', fullscan?: { __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, children?: Array<{ __typename?: 'FileEntry', id: string, name: string, url?: string | null, type: string, parentId?: string | null, tags: Array<string>, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null }> | null, metadata?: { __typename?: 'FileMetadata', location?: { __typename?: 'LatLng', id: string, latitude: number, longitude: number } | null } | null } | null };

export const LocationCompleteFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]} as unknown as DocumentNode<LocationCompleteFragment, unknown>;
export const MetadataBasicFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]} as unknown as DocumentNode<MetadataBasicFragment, unknown>;
export const FileEntryBasicFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MetadataBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}}]} as unknown as DocumentNode<FileEntryBasicFragment, unknown>;
export const FileEntryWithChildrenFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryWithChildren"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MetadataBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]} as unknown as DocumentNode<FileEntryWithChildrenFragment, unknown>;
export const GetRootFileEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRootFileEntry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rootFileEntry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryWithChildren"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MetadataBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryWithChildren"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}}]}}]}}]} as unknown as DocumentNode<GetRootFileEntryQuery, GetRootFileEntryQueryVariables>;
export const GetFileEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFileEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fileEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryWithChildren"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MetadataBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryWithChildren"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}}]}}]}}]} as unknown as DocumentNode<GetFileEntryQuery, GetFileEntryQueryVariables>;
export const GetAllFileEntriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllFileEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fileEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MetadataBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]} as unknown as DocumentNode<GetAllFileEntriesQuery, GetAllFileEntriesQueryVariables>;
export const AssignFileMetadataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignFileMetadata"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadataUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMetadata"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fileId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MetadataBasic"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}}]} as unknown as DocumentNode<AssignFileMetadataMutation, AssignFileMetadataMutationVariables>;
export const StartFullScanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartFullScan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullscan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryWithChildren"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LocationComplete"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LatLng"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MetadataBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LocationComplete"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MetadataBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryWithChildren"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}}]}}]}}]} as unknown as DocumentNode<StartFullScanMutation, StartFullScanMutationVariables>;