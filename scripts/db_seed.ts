import { fatal } from "./util";
import { db } from "@/lib/server/db";

const FILE_TYPES = ["directory", "file", "reference"];

const CASTES = [
  "Brahmin",
  "Thakur/Rajput",
  "Scheduled Caste (Drumming)",
  "Scheduled Caste (Non-drumming)",
  "Scheduled Tribe",
];
const GENDERS = ["male", "female", "other"];

type BaseEnumType = { name: string };
interface EnumDelegate {
  findMany: () => Promise<BaseEnumType[]>;
  delete: (params: { where: BaseEnumType }) => Promise<unknown>;
  create: (params: { data: BaseEnumType }) => Promise<unknown>;
}

async function seedEnum(values: string[], model: EnumDelegate) {
  // Check for seed data already present
  const currentValues = await model.findMany();
  const unseenValues = new Set(values);
  for (const ft of currentValues) {
    if (unseenValues.has(ft.name)) {
      // Database already has this type, nice!
      unseenValues.delete(ft.name);
    } else {
      // This is an unexpected type, time to delete.
      await model.delete({ where: { name: ft.name } });
    }
  }
  for (const unseenValue of unseenValues) {
    // Add any file types not present in database.
    await model.create({
      data: { name: unseenValue },
    });
  }
}

async function main() {
  await seedEnum(FILE_TYPES, db.fileType);
  await seedEnum(CASTES, db.caste);
  await seedEnum(GENDERS, db.gender);
}

// oxlint-disable-next-line unicorn/prefer-top-level-await
main()
  .then(() => {
    console.log("Done");
  })
  .catch((error) => {
    fatal(error);
  });
