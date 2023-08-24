-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PersonInVillage" (
    "description" TEXT,
    "personId" TEXT NOT NULL,
    "villageId" TEXT NOT NULL,

    PRIMARY KEY ("personId", "villageId"),
    CONSTRAINT "PersonInVillage_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PersonInVillage_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "Village" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PersonInVillage" ("description", "personId", "villageId") SELECT "description", "personId", "villageId" FROM "PersonInVillage";
DROP TABLE "PersonInVillage";
ALTER TABLE "new_PersonInVillage" RENAME TO "PersonInVillage";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
