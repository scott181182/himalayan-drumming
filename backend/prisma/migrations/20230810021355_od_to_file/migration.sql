/*
  Warnings:

  - You are about to drop the column `contentUrl` on the `FileEntry` table. All the data in the column will be lost.
  - You are about to drop the column `webDavUrl` on the `FileEntry` table. All the data in the column will be lost.
  - You are about to drop the column `webUrl` on the `FileEntry` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FileEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "type" TEXT NOT NULL,
    "parentId" TEXT,
    CONSTRAINT "FileEntry_type_fkey" FOREIGN KEY ("type") REFERENCES "FileType" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FileEntry_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FileEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FileEntry" ("id", "name", "parentId", "type", "url") SELECT "id", "name", "parentId", "type", "url" FROM "FileEntry";
DROP TABLE "FileEntry";
ALTER TABLE "new_FileEntry" RENAME TO "FileEntry";
CREATE INDEX "FileEntry_parentId_idx" ON "FileEntry"("parentId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
