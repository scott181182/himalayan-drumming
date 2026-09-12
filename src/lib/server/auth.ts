import { zenstackAdapter } from "@zenstackhq/better-auth";
import { betterAuth } from "better-auth";

import { getEnvVarFlag } from "./env";
import type { DbClient } from "@/lib/server/db";
import { db } from "@/lib/server/db";

function makeAuth() {
  return betterAuth({
    database: zenstackAdapter(db, {
      provider: "postgresql",
    }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: !getEnvVarFlag("ENABLE_SIGNUP", false),
    },
  });
}

export const auth = makeAuth();

export function getAuthDbClient(userId: string): DbClient {
  return db.$setAuth({ id: userId });
}

export type BetterAuthUser = NonNullable<
  Awaited<ReturnType<(typeof auth)["api"]["getSession"]>>
>["user"];
