"use client";

import { useApolloClient, useQuery } from "@apollo/client";
import { App } from "antd";
import type { Reducer} from "react";
import { createContext, useContext, useMemo, useReducer } from "react";

import { AsyncData } from "@/components/AsyncData";
import type { FileEntryBasicFragment, LocationCompleteFragment, VillageInContextFragment, PersonInContextFragment } from "@/generated/graphql";
import { GetFullContextDocument, GetPersonDocument, GetVillageDocument} from "@/generated/graphql";
import { FileTree } from "@/utils/tree";



export interface DashboardContextValue {
    fileTree: FileTree;
    filePredicate?: (file: FileEntryBasicFragment) => boolean;
    selectedFiles: FileEntryBasicFragment[];
    selectedLocation?: LocationCompleteFragment;
    selectedVillage?: VillageInContextFragment;

    people: PersonInContextFragment[];
    villages: VillageInContextFragment[];
}
export type DashboardDispatchAction = {
    type: "setSelectedFiles",
    payload: FileEntryBasicFragment[]
} | {
    type: "setSelectedFilesById",
    payload: string[]
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
    payload: FileEntryBasicFragment
} | {
    type: "filterFiles",
    payload?: (file: FileEntryBasicFragment) => boolean
}

export type DashboardDispatchFunctions = {
    setSelectedFiles: (files: FileEntryBasicFragment[]) => void;
    setSelectedFilesById: (fileIds: string[]) => void;
    setVirtualLocation: (location: Pick<LocationCompleteFragment, "latitude" | "longitude">) => void;
    setFileTree: (fileTree: FileTree) => void;
    selectLocation: (location: LocationCompleteFragment) => void;
    updatePerson: (person: PersonInContextFragment) => void;
    updateFile: (file: FileEntryBasicFragment) => void;
    filterFiles: (filterFn?: (file: FileEntryBasicFragment) => boolean) => void;

    // Async Operators
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
        case "setVirtualLocation":
            return {
                ...state,
                selectedLocation: {
                    ...action.payload,
                    id: ""
                },
                selectedVillage: undefined,
            };
        case "selectLocation":
            return {
                ...state,
                selectedLocation: action.payload,
                selectedFiles: state.fileTree.getFilesAtLocation(action.payload.id),
                selectedVillage: state.villages.find((v) => v.location.id === action.payload.id)
            };
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
        setSelectedFiles: (files: FileEntryBasicFragment[]) =>
            dispatch({ type: "setSelectedFiles", payload: files }),
        setSelectedFilesById: (fileIds: string[]) =>
            dispatch({ type: "setSelectedFilesById", payload: fileIds }),
        setVirtualLocation: (location: Pick<LocationCompleteFragment, "latitude" | "longitude">) =>
            dispatch({ type: "setVirtualLocation", payload: location }),
        setFileTree: (fileTree: FileTree) =>
            dispatch({ type: "setFileTree", payload: fileTree }),
        selectLocation: (location: LocationCompleteFragment) =>
            dispatch({ type: "selectLocation", payload: location }),
        updatePerson: (person: PersonInContextFragment) =>
            dispatch({ type: "updatePerson", payload: person }),
        updateFile: (file: FileEntryBasicFragment) =>
            dispatch({ type: "updateFile", payload: file }),
        filterFiles: (filterFn?: (file: FileEntryBasicFragment) => boolean) =>
            dispatch({ type: "filterFiles", payload: filterFn }),

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
