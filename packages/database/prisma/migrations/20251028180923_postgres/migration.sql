-- CreateTable
CREATE TABLE "FileType" (
    "name" TEXT NOT NULL,

    CONSTRAINT "FileType_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Caste" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Caste_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Gender" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Gender_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "FileEntry" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "type" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "FileEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileAssociations" (
    "file1Id" TEXT NOT NULL,
    "file2Id" TEXT NOT NULL,

    CONSTRAINT "FileAssociations_pkey" PRIMARY KEY ("file1Id","file2Id")
);

-- CreateTable
CREATE TABLE "FileMetadata" (
    "fileId" TEXT NOT NULL,
    "locationId" TEXT,

    CONSTRAINT "FileMetadata_pkey" PRIMARY KEY ("fileId")
);

-- CreateTable
CREATE TABLE "TagOnFile" (
    "tagName" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,

    CONSTRAINT "TagOnFile_pkey" PRIMARY KEY ("tagName","fileId")
);

-- CreateTable
CREATE TABLE "Tag" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "LatLng" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "LatLng_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "birthdate" TIMESTAMP(3),
    "education" TEXT,
    "notes" TEXT,
    "parentId" TEXT,
    "gender" TEXT,
    "caste" TEXT,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Village" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "temples" TEXT,
    "divinities" TEXT,
    "rituals" TEXT,
    "notes" TEXT,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "Village_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonInVillage" (
    "description" TEXT,
    "personId" TEXT NOT NULL,
    "villageId" TEXT NOT NULL,

    CONSTRAINT "PersonInVillage_pkey" PRIMARY KEY ("personId","villageId")
);

-- CreateTable
CREATE TABLE "_FileEntryToPerson" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "FileEntry_path_key" ON "FileEntry"("path");

-- CreateIndex
CREATE INDEX "FileEntry_parentId_idx" ON "FileEntry"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "_FileEntryToPerson_AB_unique" ON "_FileEntryToPerson"("A", "B");

-- CreateIndex
CREATE INDEX "_FileEntryToPerson_B_index" ON "_FileEntryToPerson"("B");

-- AddForeignKey
ALTER TABLE "FileEntry" ADD CONSTRAINT "FileEntry_type_fkey" FOREIGN KEY ("type") REFERENCES "FileType"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileEntry" ADD CONSTRAINT "FileEntry_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FileEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAssociations" ADD CONSTRAINT "FileAssociations_file1Id_fkey" FOREIGN KEY ("file1Id") REFERENCES "FileEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAssociations" ADD CONSTRAINT "FileAssociations_file2Id_fkey" FOREIGN KEY ("file2Id") REFERENCES "FileEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileMetadata" ADD CONSTRAINT "FileMetadata_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileMetadata" ADD CONSTRAINT "FileMetadata_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "LatLng"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnFile" ADD CONSTRAINT "TagOnFile_tagName_fkey" FOREIGN KEY ("tagName") REFERENCES "Tag"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnFile" ADD CONSTRAINT "TagOnFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_gender_fkey" FOREIGN KEY ("gender") REFERENCES "Gender"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_caste_fkey" FOREIGN KEY ("caste") REFERENCES "Caste"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Village" ADD CONSTRAINT "Village_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "LatLng"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonInVillage" ADD CONSTRAINT "PersonInVillage_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonInVillage" ADD CONSTRAINT "PersonInVillage_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "Village"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileEntryToPerson" ADD CONSTRAINT "_FileEntryToPerson_A_fkey" FOREIGN KEY ("A") REFERENCES "FileEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileEntryToPerson" ADD CONSTRAINT "_FileEntryToPerson_B_fkey" FOREIGN KEY ("B") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
