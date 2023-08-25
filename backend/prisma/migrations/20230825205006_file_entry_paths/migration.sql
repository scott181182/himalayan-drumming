/*
  Warnings:

  - Added the required column `path` to the `FileEntry` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FileEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "type" TEXT NOT NULL,
    "parentId" TEXT,
    CONSTRAINT "FileEntry_type_fkey" FOREIGN KEY ("type") REFERENCES "FileType" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FileEntry_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FileEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FileEntry" ("id", "path", "name", "parentId", "type", "url") SELECT "id", "id", "name", "parentId", "type", "url" FROM "FileEntry";
DROP TABLE "FileEntry";
ALTER TABLE "new_FileEntry" RENAME TO "FileEntry";
CREATE UNIQUE INDEX "FileEntry_path_key" ON "FileEntry"("path");
CREATE INDEX "FileEntry_parentId_idx" ON "FileEntry"("parentId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
