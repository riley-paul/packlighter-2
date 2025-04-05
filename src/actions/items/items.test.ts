import { expect, test, describe, beforeAll, afterAll } from "vitest";
import mockApiContext from "../__test__/mock-api-context";
import { execSync } from "child_process";
import { rmSync } from "fs";
import { eq } from "drizzle-orm";
import { deleteAllData } from "@/db/scripts";
import { createDb } from "@/db";
import env from "@/envs-runtime";
import { User } from "@/db/schema";
import itemHandlers from "./items.handlers";

const USER1_ID = crypto.randomUUID();
const USER2_ID = crypto.randomUUID();

const LIST1_ID = crypto.randomUUID();
const LIST2_ID = crypto.randomUUID();
const LIST3_ID = crypto.randomUUID();

const LIST1_LENGTH = 10;
const LIST2_LENGTH = 5;
const LIST3_LENGTH = 17;
const INBOX_LENGTH = 3;

const USER1_LENGTH = LIST1_LENGTH + LIST2_LENGTH + INBOX_LENGTH;

const LIST_SHARE_ID = crypto.randomUUID();

const db = createDb(env);

beforeAll(async () => {
  execSync("npm run db:push:test");
  await deleteAllData();

  await db.insert(User).values([
    {
      id: USER1_ID,
      email: "test_user@example.com",
      name: "Main Test User",
    },
    {
      id: USER2_ID,
      email: "test_user2@example.com",
      name: "Other Test User",
    },
  ]);
});

afterAll(() => {
  rmSync("test.db", { force: true });
});

describe("get all items", () => {
  test("returns all of the users items", async () => {
    const todos = await itemHandlers.getAll(null, mockApiContext(USER1_ID));
    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBe(LIST1_LENGTH);
  });
});
