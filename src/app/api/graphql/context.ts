import type { FileStorage } from "@flystorage/file-storage";

import type { BetterAuthUser } from "@/lib/auth";
import type { DbClient } from "@/lib/db";

export interface Context {
  db: DbClient;
  user: BetterAuthUser;
  storage: FileStorage;
}
