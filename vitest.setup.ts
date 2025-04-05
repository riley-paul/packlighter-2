import { beforeAll } from "vitest";
import { execSync } from "child_process";
import { deleteAllData } from "@/db/scripts";
import { seedTestData } from "@/tests/fixtures";

beforeAll(async () => {
  execSync("npm run db:push:test");
  await deleteAllData();
  await seedTestData();
});
