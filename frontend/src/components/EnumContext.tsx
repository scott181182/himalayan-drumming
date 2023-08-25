import { useQuery } from "@apollo/client";
import type { LayoutProps } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { createContext, useContext, useState } from "react";

import { AsyncData } from "./AsyncData";
import { GetAllTagsDocument } from "@/generated/graphql";
import { makeOptions } from "@/utils/antd";



export interface EnumContextValue {
    tags: string[];
    tagOptions: DefaultOptionType[];
}

export const EnumContext = createContext<EnumContextValue>({
    tags: [],
    tagOptions: [],
});
export function useEnums() {
    const state = useContext(EnumContext);
    if(!state) { throw new Error("Enum context tried to be accessed before it was initialized!"); }
    return state;
}



export function EnumProvider({
    children
}: LayoutProps) {
    const [state, setState] = useState<EnumContextValue>({
        tags: [],
        tagOptions: [],
    });

    const { loading, error } = useQuery(GetAllTagsDocument, {
        onCompleted(data) {
            setState({
                tags: data.tags,
                tagOptions: makeOptions(data.tags)
            });
        },
    });

    return (
        <EnumContext.Provider value={state}>
            <AsyncData
                data={state}
                loading={loading}
                error={error}
            >
                {children}
            </AsyncData>
        </EnumContext.Provider>
    );
}
