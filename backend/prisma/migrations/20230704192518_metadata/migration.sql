-- CreateTable
CREATE TABLE "FileMetadata" (
    "fileId" TEXT NOT NULL PRIMARY KEY,
    "locationId" TEXT,
    CONSTRAINT "FileMetadata_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileEntry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FileMetadata_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "LatLng" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TagOnFile" (
    "tagName" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,

    PRIMARY KEY ("tagName", "fileId"),
    CONSTRAINT "TagOnFile_tagName_fkey" FOREIGN KEY ("tagName") REFERENCES "Tag" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TagOnFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileEntry" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "LatLng" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL
);
