import { inputObjectType } from "nexus";

import type { NexusGenInputNames } from "../../../nexus-typegen";



export function makeRelationCreateInput(name: string, whereInput: NexusGenInputNames, createInput: NexusGenInputNames) {
    return inputObjectType({
        name: name,
        definition(t) {
            t.field("create", {
                type: createInput
            });
            t.field("connect", {
                type: whereInput
            });
        },
    });
}

export type Unnullified<T> =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends Record<any, any> ? { [K in keyof T]: Unnullified<T[K]> } :
    T extends null ? undefined :
    T;

export function unnullifyObject<T>(obj: T): Unnullified<T> {
    if(obj === null) { return undefined as Unnullified<T>; }
    if(typeof obj === "object") {
        const newObj = { ...obj };
        for(const k in obj) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            newObj[k] = unnullifyObject(obj[k]) as any;
        }
    }
    return obj as Unnullified<T>;
}
