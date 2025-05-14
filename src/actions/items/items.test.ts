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

  test("returns no items if user has no items", async () => {
    const items = await itemHandlers.getAll(
      null,
      mockApiContext(crypto.randomUUID()),
    );
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBe(0);
  });
});

describe("update item", () => {
  test("updates the item with the given id", async () => {
    const itemId = ITEM_IDS[0];
    const updatedItem = await itemHandlers.update(
      { id: itemId, name: "Updated Item" },
      mockApiContext(USER_ID),
    );
    expect(updatedItem).toBeDefined();
    expect(updatedItem.id).toBe(itemId);
    expect(updatedItem.name).toBe("Updated Item");
  });
});
