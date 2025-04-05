import { expect, test, describe } from "vitest";
import mockApiContext from "@/tests/mock-api-context";
import itemHandlers from "./items.handlers";
import { ITEM_IDS, USER_ID } from "@/tests/fixtures";

describe("get all items", () => {
  test("returns all of the users items", async () => {
    const items = await itemHandlers.getAll(null, mockApiContext(USER_ID));
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBe(ITEM_IDS.length);
  });
});
