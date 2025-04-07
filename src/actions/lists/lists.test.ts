import { test, describe, expect } from "vitest";
import listHandlers from "./lists.handlers";
import mockApiContext from "@/tests/mock-api-context";
import { CATEGORY_IDS, LIST_ID, USER_ID } from "@/tests/fixtures";
import { ActionError } from "astro:actions";

describe("get all lists", () => {
  test("returns all of the users lists", async () => {
    const lists = await listHandlers.getAll(null, mockApiContext(USER_ID));
    expect(Array.isArray(lists)).toBe(true);
    expect(lists.length).toBe(1);
  });

  test("returns no lists if user has no lists", async () => {
    const lists = await listHandlers.getAll(
      null,
      mockApiContext(crypto.randomUUID()),
    );
    expect(Array.isArray(lists)).toBe(true);
    expect(lists.length).toBe(0);
  });
});

describe("get list by id", () => {
  test("returns the list with the given id", async () => {
    const list = await listHandlers.getOne(
      { listId: LIST_ID },
      mockApiContext(USER_ID),
    );
    expect(list).toBeDefined();
    expect(list.id).toBe(LIST_ID);
  });

  test("throws an error if the list does not exist", async () => {
    const error = new ActionError({
      code: "NOT_FOUND",
      message: "List not found",
    });
    await expect(() =>
      listHandlers.getOne({ listId: "nonexistent" }, mockApiContext(USER_ID)),
    ).rejects.toThrow(error);
  });

  test("categories are sorted by order", async () => {
    const list = await listHandlers.getOne(
      { listId: LIST_ID },
      mockApiContext(USER_ID),
    );
    list.categories.forEach((category, index) => {
      expect(category.id).toEqual(CATEGORY_IDS[index]);
      expect(category.sortOrder).toEqual(index + 1);
    });
  });
});
