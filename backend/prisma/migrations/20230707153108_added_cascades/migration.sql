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
CREATE TABLE "new_FileMetadata" (
    "fileId" TEXT NOT NULL PRIMARY KEY,
    "locationId" TEXT,
    CONSTRAINT "FileMetadata_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FileMetadata_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "LatLng" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FileMetadata" ("fileId", "locationId") SELECT "fileId", "locationId" FROM "FileMetadata";
DROP TABLE "FileMetadata";
ALTER TABLE "new_FileMetadata" RENAME TO "FileMetadata";
CREATE TABLE "new_TagOnFile" (
    "tagName" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,

    PRIMARY KEY ("tagName", "fileId"),
    CONSTRAINT "TagOnFile_tagName_fkey" FOREIGN KEY ("tagName") REFERENCES "Tag" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TagOnFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TagOnFile" ("fileId", "tagName") SELECT "fileId", "tagName" FROM "TagOnFile";
DROP TABLE "TagOnFile";
ALTER TABLE "new_TagOnFile" RENAME TO "TagOnFile";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
