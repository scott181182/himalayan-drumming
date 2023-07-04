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
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  parent?: Maybe<FileEntry>;
  parentId?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Perform a full scan of OneDrive and other file sources. Creates, updates, and deletes entries as necessary. */
  fullscan?: Maybe<FileEntry>;
};

export type Query = {
  __typename?: 'Query';
  fileEntry?: Maybe<FileEntry>;
  rootFileEntry: FileEntry;
};


export type QueryFileEntryArgs = {
  id: Scalars['String']['input'];
};

export type FileEntryBasicFragment = { __typename?: 'FileEntry', id: string, name: string, type: string };

export type GetRootFileEntryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRootFileEntryQuery = { __typename?: 'Query', rootFileEntry: { __typename?: 'FileEntry', id: string, name: string, type: string, children?: Array<{ __typename?: 'FileEntry', id: string, name: string, type: string }> | null } };

export const FileEntryBasicFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<FileEntryBasicFragment, unknown>;
export const GetRootFileEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRootFileEntry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rootFileEntry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileEntryBasic"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileEntryBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<GetRootFileEntryQuery, GetRootFileEntryQueryVariables>;