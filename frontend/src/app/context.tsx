import { useQuery } from "@apollo/client";
import type { Reducer} from "react";
import { createContext, useContext, useMemo, useReducer } from "react";

import { AsyncData } from "@/components/AsyncData";
import { GetAllFileEntriesDocument, type FileEntryBasicFragment, type LocationCompleteFragment } from "@/generated/graphql";
import { FileTree } from "@/utils/tree";



export interface DashboardContextValue {
    fileTree: FileTree;
    selectedFiles: FileEntryBasicFragment[];
    selectedLocation?: LocationCompleteFragment;
}
export type DashboardDispatchAction = {
    type: "setSelectedFiles",
    payload: FileEntryBasicFragment[]
} | {
    type: "setVirtualLocation",
    payload: Pick<LocationCompleteFragment, "latitude" | "longitude">
} | {
    type: "setFileTree",
    payload: FileTree
} | {
    type: "selectLocation",
    payload: LocationCompleteFragment,
}

export type DashboardDispatchFunctions = {
    setSelectedFiles: (files: FileEntryBasicFragment[]) => void;
    setVirtualLocation: (location: Pick<LocationCompleteFragment, "latitude" | "longitude">) => void;
    setFileTree: (fileTree: FileTree) => void;
    selectLocation: (location: LocationCompleteFragment) => void;
}



export const dashboardReducer: Reducer<DashboardContextValue, DashboardDispatchAction> = (state, action) => {
    switch(action.type) {
        case "setSelectedFiles":
            return {
                ...state,
                selectedFiles: action.payload
            };
        case "setVirtualLocation":
            return {
                ...state,
                selectedLocation: {
                    ...action.payload,
                    id: ""
                }
            };
        case "selectLocation":
            return {
                ...state,
                selectedLocation: action.payload,
                selectedFiles: state.fileTree.getFilesAtLocation(action.payload.id)
            };
        case "setFileTree":
            return {
                ...state,
                fileTree: action.payload
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
    const [state, dispatch] = useReducer(dashboardReducer, {
        // Unsafe code, but the `<AsyncData>` component is guaranteeing that this will be defined prior to access.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fileTree: null as any,
        selectedFiles: [],
        selectedLocation: undefined
    });

    const { loading, error } = useQuery(GetAllFileEntriesDocument, {
        onCompleted(data) {
            dispatch({ type: "setFileTree", payload: FileTree.fromEntries(data.fileEntries) });
        },
    });

    const functions: DashboardDispatchFunctions = useMemo(() => ({
        setSelectedFiles: (files: FileEntryBasicFragment[]) =>
            dispatch({ type: "setSelectedFiles", payload: files }),
        setVirtualLocation: (location: Pick<LocationCompleteFragment, "latitude" | "longitude">) =>
            dispatch({ type: "setVirtualLocation", payload: location }),
        setFileTree: (fileTree: FileTree) =>
            dispatch({ type: "setFileTree", payload: fileTree }),
        selectLocation: (location: LocationCompleteFragment) =>
            dispatch({ type: "selectLocation", payload: location })
    }), [dispatch]);

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
