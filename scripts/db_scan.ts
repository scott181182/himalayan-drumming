import { fatal } from "./util";
import { db } from "@/lib/db";
import { executeFullScan } from "@/lib/server/scan";
import { storage } from "@/lib/server/storage";

async function main() {
  await executeFullScan(db, storage);
}

// oxlint-disable-next-line unicorn/prefer-top-level-await
main()
  .then(() => {
    console.log("Done");
  })
  .catch((error) => {
    fatal(error);
  });
