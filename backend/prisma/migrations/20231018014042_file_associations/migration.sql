-- CreateTable
CREATE TABLE "FileAssociations" (
    "file1Id" TEXT NOT NULL,
    "file2Id" TEXT NOT NULL,

    PRIMARY KEY ("file1Id", "file2Id"),
    CONSTRAINT "FileAssociations_file1Id_fkey" FOREIGN KEY ("file1Id") REFERENCES "FileEntry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FileAssociations_file2Id_fkey" FOREIGN KEY ("file2Id") REFERENCES "FileEntry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
