-- CreateTable
CREATE TABLE "_FileMetadataToPerson" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_FileMetadataToPerson_A_fkey" FOREIGN KEY ("A") REFERENCES "FileMetadata" ("fileId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FileMetadataToPerson_B_fkey" FOREIGN KEY ("B") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_FileMetadataToPerson_AB_unique" ON "_FileMetadataToPerson"("A", "B");

-- CreateIndex
CREATE INDEX "_FileMetadataToPerson_B_index" ON "_FileMetadataToPerson"("B");
