import type { FileStorage } from "@flystorage/file-storage";

import type { BetterAuthUser } from "@/lib/server/auth";
import type { DbClient } from "@/lib/server/db";

export interface Context {
  db: DbClient;
  user: BetterAuthUser;
  storage: FileStorage;
}
