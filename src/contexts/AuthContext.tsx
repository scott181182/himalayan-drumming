"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext } from "react";

import type { BetterAuthUser } from "@/lib/server/auth";

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

export function GuardedAuthContextProvider({
  value,
  children,
}: Readonly<PropsWithChildren<{ value: GuardedAuthContextValue }>>) {
  return <GuardedAuthContext.Provider value={value}>{children}</GuardedAuthContext.Provider>;
}
