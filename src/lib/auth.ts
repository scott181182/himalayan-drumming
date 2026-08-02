import { zenstackAdapter } from "@zenstackhq/better-auth";
import { betterAuth } from "better-auth";

import type { DbClient } from "@/lib/db";
import { db } from "@/lib/db";

function makeAuth() {
  return betterAuth({
    database: zenstackAdapter(db, {
      provider: "postgresql",
    }),
    emailAndPassword: {
      enabled: true,
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
