-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TagOnFile" (
    "tagName" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,

    PRIMARY KEY ("tagName", "fileId"),
    CONSTRAINT "TagOnFile_tagName_fkey" FOREIGN KEY ("tagName") REFERENCES "Tag" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TagOnFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileEntry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TagOnFile" ("fileId", "tagName") SELECT "fileId", "tagName" FROM "TagOnFile";
DROP TABLE "TagOnFile";
ALTER TABLE "new_TagOnFile" RENAME TO "TagOnFile";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
