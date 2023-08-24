import type { ReactNode } from "react";



export interface MultiCaseProps<T> {
    value: T[];

    empty?: React.ReactNode;
    single?: React.ReactNode | ((value: T) => ReactNode);
    multiple?: React.ReactNode | ((values: T[]) => ReactNode);
}

export function MultiCase<T>({
    value,

    empty,
    single,
    multiple
}: MultiCaseProps<T>) {
    if(value.length === 0) { return empty; }
    if(value.length === 1) {
        return typeof single === "function" ? single(value[0]) : single;
    } else {
        return typeof multiple === "function" ? multiple(value) : multiple;
    }
}
