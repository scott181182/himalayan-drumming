import { inputObjectType } from "nexus";
import type { AllInputTypes, AllNexusInputTypeDefs, InputDefinitionBlock } from "nexus/dist/core";

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

export function makeRelationUpdateInput(name: string, whereInput: NexusGenInputNames, createInput: NexusGenInputNames) {
    return inputObjectType({
        name: name,
        definition(t) {
            t.field("create", {
                type: createInput
            });
            t.field("connect", {
                type: whereInput
            });
            t.field("delete", {
                type: whereInput
            });
        },
    });
}


export function makeListRelationWhereInput(name: string, whereInput: NexusGenInputNames) {
    return inputObjectType({
        name: name,
        definition(t) {
            t.field("every", { type: whereInput });
            t.field("some", { type: whereInput });
            t.field("none", { type: whereInput });
        },
    });
}

export function combinationOperators(t: InputDefinitionBlock<string>, type: AllInputTypes | AllNexusInputTypeDefs) {
    t.list.nonNull.field("OR", { type });
    t.list.nonNull.field("AND", { type });
    t.list.nonNull.field("NOT", { type });
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
