import { test, describe, expect } from "vitest";
import listHandlers from "./lists.handlers";
import mockApiContext from "@/tests/mock-api-context";
import { CATEGORY_IDS, LIST_ID, LIST_IDS, USER_ID } from "@/tests/fixtures";
import { ActionError } from "astro:actions";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";

describe("get all lists", () => {
  test("returns all of the users lists", async () => {
    const lists = await listHandlers.getAll(null, mockApiContext(USER_ID));
    expect(Array.isArray(lists)).toBe(true);
    expect(lists.length).toBe(LIST_IDS.length + 1);
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

describe("lists are sorted by sortOrder", () => {
  test("lists are sorted by sortOrder", async () => {
    const lists = await listHandlers.getAll(null, mockApiContext(USER_ID));
    lists.forEach((list, index) => {
      expect(list.sortOrder).toEqual(index + 1);
    });
  });

  test("moving list down updates the sort order", async () => {
    const originalLists = await listHandlers.getAll(
      null,
      mockApiContext(USER_ID),
    );

    originalLists.forEach((list, index) => {
      expect(list.sortOrder).toEqual(index + 1);
    });

    const listToMove = originalLists[0];
    const newSortOrder = 3;

    await listHandlers.update(
      { listId: listToMove.id, data: { sortOrder: newSortOrder } },
      mockApiContext(USER_ID),
    );

    const originalListIds = originalLists.map((list) => list.id);
    const expectedUpdatedListIds = reorder({
      list: originalListIds,
      startIndex: 0,
      finishIndex: newSortOrder,
    });

    const updatedLists = await listHandlers.getAll(
      null,
      mockApiContext(USER_ID),
    );

    expect(updatedLists.map(({ id }) => id)).toEqual(expectedUpdatedListIds);
  });

  test.todo("moving list up updates the sort order");
  test.todo("creating a list assigns the next sort order");
  test.todo("deleting a list updates the sort order");
  test.todo("duplicate list updates the sort order");
});
