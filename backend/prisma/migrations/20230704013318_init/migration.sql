-- CreateTable
CREATE TABLE "FileType" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "FileEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "type" TEXT NOT NULL,
    "parentId" TEXT,
    CONSTRAINT "FileEntry_type_fkey" FOREIGN KEY ("type") REFERENCES "FileType" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FileEntry_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FileEntry" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
