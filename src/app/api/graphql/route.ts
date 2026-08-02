import { GraphQLError } from "graphql";
import type { YogaInitialContext } from "graphql-yoga";
import { createYoga } from "graphql-yoga";

import type { Context } from "./context";
import { createSchema } from "./schema";
import type { BetterAuthUser } from "@/lib/auth";
import { auth, getAuthDbClient } from "@/lib/auth";
import { db } from "@/lib/db";
import { storage } from "@/lib/server/storage";

interface NextContext {
  params: Promise<Record<string, string>>;
}

const IS_DEVMODE = true;

async function getContextUser(
  initialCtx: Readonly<YogaInitialContext & NextContext>,
): Promise<BetterAuthUser> {
  if (IS_DEVMODE) {
    return db.user.findFirstOrThrow();
  }

  const session = await auth.api.getSession({ headers: initialCtx.request.headers });

  if (!session) {
    throw new GraphQLError("Unauthorized Request", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }

  return session.user;
}

async function makeContext(
  initialCtx: Readonly<YogaInitialContext & NextContext>,
): Promise<Context> {
  const user = await getContextUser(initialCtx);
  const authedDb = getAuthDbClient(user.id);

  return { db: authedDb, user, storage };
}

const { handleRequest } = createYoga<NextContext>({
  schema: createSchema(),
  context: makeContext,
  // While using Next.js file convention for routing, we need to configure Yoga to use the correct endpoint
  graphqlEndpoint: "/api/graphql",

  // Yoga needs to know how to create a valid Next response
  fetchAPI: { Response },
});

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS };
