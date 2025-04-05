import { expect, test, describe, beforeAll, afterAll } from "vitest";
import mockApiContext from "../__test__/mock-api-context";
import { execSync } from "child_process";
import { rmSync } from "fs";
import { deleteAllData } from "@/db/scripts";
import { createDb } from "@/db";
import env from "@/envs-runtime";
import { User } from "@/db/schema";
import itemHandlers from "./items.handlers";

const USER_ID = crypto.randomUUID();

const db = createDb(env);

beforeAll(async () => {
  execSync("npm run db:push:test");
  await deleteAllData();

  await db.insert(User).values([
    {
      id: USER_ID,
      email: "test_user@example.com",
      name: "Main Test User",
    },
  ]);
});

afterAll(() => {
  rmSync("test.db", { force: true });
});

describe("get all items", () => {
  test("returns all of the users items", async () => {
    const todos = await itemHandlers.getAll(null, mockApiContext(USER_ID));
    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBe(0);
  });
});
