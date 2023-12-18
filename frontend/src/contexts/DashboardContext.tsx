"use client";

import { useApolloClient, useQuery } from "@apollo/client";
import { App } from "antd";
import type { Reducer} from "react";
import { createContext, useContext, useMemo, useReducer } from "react";

import { AsyncData } from "@/components/AsyncData";
import type { FileEntryInContextFragment, LocationCompleteFragment, VillageInContextFragment, PersonInContextFragment } from "@/generated/graphql";
import { GetFullContextDocument, GetPartialContextDocument, GetPersonDocument, GetVillageDocument} from "@/generated/graphql";
import { FileTree } from "@/utils/tree";



export interface RefetchOptions {
    personIds?: string[];
    villageIds?: string[];
    fileIds?: string[];
}
export interface VillageBrowserSelection {
    type: "village";
    villageId?: string;
}
export interface PersonBrowserSelection {
    type: "person";
    personId?: string;
}
export type RelationBrowserSelection = VillageBrowserSelection | PersonBrowserSelection;

export interface DashboardContextValue {
    fileTree: FileTree;
    filePredicate?: (file: FileEntryInContextFragment) => boolean;
    selectedFiles: FileEntryInContextFragment[];
    selectedLocation?: LocationCompleteFragment;

    people: PersonInContextFragment[];
    villages: VillageInContextFragment[];
    selectedRelation?: RelationBrowserSelection;
}
export type DashboardDispatchAction = {
    type: "setSelectedFiles",
    payload: FileEntryInContextFragment[]
} | {
    type: "setSelectedFilesById",
    payload: string[]
} | {
    type: "setSelectedRelation",
    payload: RelationBrowserSelection | undefined
} | {
    type: "setVirtualLocation",
    payload: Pick<LocationCompleteFragment, "latitude" | "longitude">
} | {
    type: "selectLocation",
    payload: LocationCompleteFragment,
} | {
    type: "setFileTree",
    payload: FileTree
} | {
    type: "setVillages",
    payload: VillageInContextFragment[]
} | {
    type: "updateVillage",
    payload: VillageInContextFragment
} | {
    type: "setPeople",
    payload: PersonInContextFragment[]
} | {
    type: "updatePerson",
    payload: PersonInContextFragment
} | {
    type: "updateFile",
    payload: FileEntryInContextFragment
} | {
    type: "filterFiles",
    payload?: (file: FileEntryInContextFragment) => boolean
}

export type DashboardDispatchFunctions = {
    setSelectedFiles: (files: FileEntryInContextFragment[]) => void;
    setSelectedFilesById: (fileIds: string[]) => void;
    setSelectedRelation: (selection: RelationBrowserSelection | undefined) => void;
    setVirtualLocation: (location: Pick<LocationCompleteFragment, "latitude" | "longitude">) => void;
    setFileTree: (fileTree: FileTree) => void;
    selectLocation: (location: LocationCompleteFragment) => void;
    updatePerson: (person: PersonInContextFragment) => void;
    updateVillage: (village: VillageInContextFragment) => void;
    updateFile: (file: FileEntryInContextFragment) => void;
    filterFiles: (filterFn?: (file: FileEntryInContextFragment) => boolean) => void;

    // Async Operators
    refetchResources: (options: RefetchOptions) => Promise<void>;
    refetchPerson: (personId: string) => Promise<void>;
    refetchVillage: (villageId: string) => Promise<void>;
    refetchDashboard: () => void;
}



export const dashboardReducer: Reducer<DashboardContextValue, DashboardDispatchAction> = (state, action) => {
    switch(action.type) {
        case "setSelectedFiles":
            return {
                ...state,
                selectedFiles: action.payload
            };
        case "setSelectedFilesById":
            return {
                ...state,
                selectedFiles: action.payload.map((id) => state.fileTree.getFileById(id))
            };
        case "setSelectedRelation":
            return {
                ...state,
                selectedRelation: action.payload
            };
        case "setVirtualLocation":
            return {
                ...state,
                selectedLocation: {
                    ...action.payload,
                    id: ""
                },
            };
        case "selectLocation": {
            const village = state.villages.find((v) => v.location.id === action.payload.id);
            return {
                ...state,
                selectedLocation: action.payload,
                selectedFiles: state.fileTree.getFilesAtLocation(action.payload.id),
                selectedRelation: village ?
                    { type: "village", villageId: village.id } :
                    state.selectedRelation
            };
        }
        case "setFileTree":
            return {
                ...state,
                fileTree: action.payload
            };
        case "setVillages":
            return {
                ...state,
                villages: action.payload
            };
        case "updateVillage": {
            return {
                ...state,
                villages: state.villages.map((p) => p.id === action.payload.id ? action.payload : p)
            };
        }
        case "setPeople":
            return {
                ...state,
                people: action.payload
            };
        case "updatePerson": {
            return {
                ...state,
                people: state.people.map((p) => p.id === action.payload.id ? action.payload : p)
            };
        }

        case "updateFile":
            return {
                ...state,
                fileTree: state.fileTree.updateNode(action.payload),
                selectedFiles: state.selectedFiles.map((sf) => sf.id === action.payload.id ? action.payload : sf),
            };
        case "filterFiles":
            return {
                ...state,
                filePredicate: action.payload
            };
    }
};



export const DashboardContext = createContext<DashboardContextValue | null>(null);
export const DashboardDispatchContext = createContext<DashboardDispatchFunctions | null>(null);

export function useDashboardState() {
    const state = useContext(DashboardContext);
    if(!state) { throw new Error("Dashboard context tried to be accessed before it was initialized!"); }
    return state;
}
export function useDashboardDispatch() {
    const dispatch = useContext(DashboardDispatchContext);
    if(!dispatch) { throw new Error("Dashboard context tried to be accessed before it was initialized!"); }
    return dispatch;
}



export interface DashboardProviderProps {
    children: React.ReactNode;
}
export function DashboardProvider({
    children
}: DashboardProviderProps) {
    const { message } = App.useApp();
    const apolloClient = useApolloClient();

    const [state, dispatch] = useReducer(dashboardReducer, {
        // Unsafe code, but the `<AsyncData>` component is guaranteeing that this will be defined prior to access.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fileTree: null as any,
        selectedFiles: [],
        selectedLocation: undefined,

        people: [],
        villages: [],
    });


    const { loading, error, refetch } = useQuery(GetFullContextDocument, {
        onCompleted(data) {
            try {
                const payload = FileTree.fromEntries(data.fileEntries);
                dispatch({ type: "setFileTree", payload });
                dispatch({ type: "setPeople", payload: data.people });
                dispatch({ type: "setVillages", payload: data.villages });
            } catch(err) {
                console.error(err);
                message.error("There was a problem loading data from OneDrive");
            }
        },
    });

    const functions: DashboardDispatchFunctions = useMemo(() => ({
        setSelectedFiles: (files: FileEntryInContextFragment[]) =>
            dispatch({ type: "setSelectedFiles", payload: files }),
        setSelectedFilesById: (fileIds: string[]) =>
            dispatch({ type: "setSelectedFilesById", payload: fileIds }),
        setSelectedRelation: (selection: RelationBrowserSelection | undefined) =>
            dispatch({ type: "setSelectedRelation", payload: selection }),
        setVirtualLocation: (location: Pick<LocationCompleteFragment, "latitude" | "longitude">) =>
            dispatch({ type: "setVirtualLocation", payload: location }),
        setFileTree: (fileTree: FileTree) =>
            dispatch({ type: "setFileTree", payload: fileTree }),
        selectLocation: (location: LocationCompleteFragment) =>
            dispatch({ type: "selectLocation", payload: location }),
        updatePerson: (person: PersonInContextFragment) =>
            dispatch({ type: "updatePerson", payload: person }),
        updateVillage: (village: VillageInContextFragment) =>
            dispatch({ type: "updateVillage", payload: village }),
        updateFile: (file: FileEntryInContextFragment) =>
            dispatch({ type: "updateFile", payload: file }),
        filterFiles: (filterFn?: (file: FileEntryInContextFragment) => boolean) =>
            dispatch({ type: "filterFiles", payload: filterFn }),

        refetchResources: (options) => {
            return apolloClient.query({
                query: GetPartialContextDocument,
                variables: {
                    fileIds: [],
                    villageIds: [],
                    personIds: [],
                    ...options
                }
            }).then((res) => {
                if(options.fileIds) {
                    for(const file of res.data.fileEntries) {
                        dispatch({
                            type: "updateFile",
                            payload: file
                        });
                    }
                }
                if(options.villageIds) {
                    for(const village of res.data.villages) {
                        dispatch({
                            type: "updateVillage",
                            payload: village
                        });
                    }
                }
                if(options.personIds) {
                    for(const person of res.data.people) {
                        dispatch({
                            type: "updatePerson",
                            payload: person
                        });
                    }
                }
            });
        },
        refetchPerson: (personId) => {
            return apolloClient.query({
                query: GetPersonDocument,
                variables: { personId }
            }).then((res) => {
                if(res.data.person) {
                    dispatch({
                        type: "updatePerson",
                        payload: res.data.person
                    });
                } else {
                    console.error(`Tried to fetch new data for person ${personId} but failed:`);
                    console.error(JSON.stringify(res.errors, null, 4));
                }
            });
        },
        refetchVillage: (villageId) => {
            return apolloClient.query({
                query: GetVillageDocument,
                variables: { villageId }
            }).then((res) => {
                if(res.data.village) {
                    dispatch({
                        type: "updateVillage",
                        payload: res.data.village
                    });
                } else {
                    console.error(`Tried to fetch new data for village ${villageId} but failed:`);
                    console.error(JSON.stringify(res.errors, null, 4));
                }
            });
        },
        refetchDashboard: () => {
            refetch();
        }
    }), [apolloClient, refetch]);

    return (
        <DashboardContext.Provider value={state}>
            <DashboardDispatchContext.Provider value={functions}>
                <AsyncData
                    data={state.fileTree}
                    loading={loading}
                    error={error}
                >
                    {children}
                </AsyncData>
            </DashboardDispatchContext.Provider>
        </DashboardContext.Provider>
    );
}
