-- CreateTable
CREATE TABLE "Caste" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Gender" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "birthdate" DATETIME,
    "education" TEXT,
    "notes" TEXT,
    "parentId" TEXT,
    "gender" TEXT,
    "caste" TEXT,
    CONSTRAINT "Person_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Person" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Person_gender_fkey" FOREIGN KEY ("gender") REFERENCES "Gender" ("name") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Person_caste_fkey" FOREIGN KEY ("caste") REFERENCES "Caste" ("name") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Person" ("avatarUrl", "id", "name", "parentId") SELECT "avatarUrl", "id", "name", "parentId" FROM "Person";
DROP TABLE "Person";
ALTER TABLE "new_Person" RENAME TO "Person";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
