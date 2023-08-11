-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    CONSTRAINT "Person_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Person" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Village" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    CONSTRAINT "Village_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "LatLng" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PersonInVillage" (
    "description" TEXT,
    "personId" TEXT NOT NULL,
    "villageId" TEXT NOT NULL,

    PRIMARY KEY ("personId", "villageId"),
    CONSTRAINT "PersonInVillage_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PersonInVillage_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Village" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
