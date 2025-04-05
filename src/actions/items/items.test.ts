import { expect, test, describe } from "vitest";
import mockApiContext from "@/tests/mock-api-context";
import itemHandlers from "./items.handlers";
import { USER_ID } from "@/tests/fixtures";

describe("get all items", () => {
  test("returns all of the users items", async () => {
    const todos = await itemHandlers.getAll(null, mockApiContext(USER_ID));
    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBe(0);
  });
});
