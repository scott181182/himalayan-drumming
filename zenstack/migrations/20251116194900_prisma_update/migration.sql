-- AlterTable
ALTER TABLE "_FileEntryToPerson" ADD CONSTRAINT "_FileEntryToPerson_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_FileEntryToPerson_AB_unique";
