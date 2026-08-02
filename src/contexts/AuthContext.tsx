"use client";

import type { BetterAuthUser } from "himalayan-drumming-research-auth";
import type { PropsWithChildren } from "react";
import { createContext, useContext } from "react";

export interface GuardedAuthContextValue {
    user: BetterAuthUser;
}

const GuardedAuthContext = createContext<GuardedAuthContextValue | null>(null);

export function useGuardedAuthContext() {
    const value = useContext(GuardedAuthContext);
    if (!value) {
        throw new Error("Cannot use AuthContext outside of an AuthContextProvider");
    }
    return value;
}

export function GuardedAuthContextProvider({ value, children }: PropsWithChildren<{ value: GuardedAuthContextValue }>) {
    return <GuardedAuthContext.Provider value={value}>{children}</GuardedAuthContext.Provider>;
}
