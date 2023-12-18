/*
  Warnings:

  - You are about to drop the `FileMetadata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FileEntryToPerson` table. If the table is not empty, all the data it contains will be lost.

*/

-- CreateTable
CREATE TABLE "PersonOnFile" (
    "instrument" TEXT,
    "notes" TEXT,
    "personId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,

    PRIMARY KEY ("personId", "fileId"),
    CONSTRAINT "PersonOnFile_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PersonOnFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileEntry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "PersonOnFile" ("fileId", "personId") SELECT "A", "B" FROM "_FileEntryToPerson";

-- DropIndex
DROP INDEX "_FileEntryToPerson_B_index";

-- DropIndex
DROP INDEX "_FileEntryToPerson_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_FileEntryToPerson";
PRAGMA foreign_keys=on;



-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FileEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "type" TEXT NOT NULL,
    "parentId" TEXT,
    "notes" TEXT,
    "timestamp" DATETIME,
    "locationId" TEXT,
    CONSTRAINT "FileEntry_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "LatLng" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "FileEntry_type_fkey" FOREIGN KEY ("type") REFERENCES "FileType" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FileEntry_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FileEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FileEntry" ("id", "name", "parentId", "path", "type", "url", "locationId")
SELECT f."id", f."name", f."parentId", f."path", f."type", f."url", fm."locationId"
  FROM "FileEntry" f
LEFT JOIN "FileMetadata" fm
  ON fm.fileId = f.id;

DROP TABLE "FileEntry";
ALTER TABLE "new_FileEntry" RENAME TO "FileEntry";
CREATE UNIQUE INDEX "FileEntry_path_key" ON "FileEntry"("path");
CREATE INDEX "FileEntry_parentId_idx" ON "FileEntry"("parentId");
PRAGMA foreign_key_check;

DROP TABLE "FileMetadata";
PRAGMA foreign_keys=ON;
