/*
  Warnings:

  - You are about to drop the `_FileMetadataToPerson` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_FileMetadataToPerson";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_FileEntryToPerson" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_FileEntryToPerson_A_fkey" FOREIGN KEY ("A") REFERENCES "FileEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FileEntryToPerson_B_fkey" FOREIGN KEY ("B") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_FileEntryToPerson_AB_unique" ON "_FileEntryToPerson"("A", "B");

-- CreateIndex
CREATE INDEX "_FileEntryToPerson_B_index" ON "_FileEntryToPerson"("B");
