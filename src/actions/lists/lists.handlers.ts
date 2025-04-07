import { createDb } from "@/db";
import { List, Category, CategoryItem } from "@/db/schema";
import { and, eq, inArray, max } from "drizzle-orm";
import { idAndUserIdFilter } from "@/actions/filters";
import { ActionError, type ActionHandler } from "astro:actions";
import { getExpandedList, isAuthorized } from "@/actions/helpers";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";

import { v4 as uuid } from "uuid";
import type listInputs from "./lists.inputs";
import type { ExpandedList, ListSelect } from "@/lib/types";

const getAll: ActionHandler<typeof listInputs.getAll, ListSelect[]> = async (
  _,
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const lists = await db
    .select()
    .from(List)
    .where(eq(List.userId, userId))
    .orderBy(List.sortOrder);
  return lists;
};

const getOne: ActionHandler<typeof listInputs.getOne, ExpandedList> = async (
  { listId },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const list = await db
    .select({ id: List.id })
    .from(List)
    .where(idAndUserIdFilter(List, { userId, id: listId }))
    .then((rows) => rows[0]);

  if (!list) {
    throw new ActionError({
      code: "NOT_FOUND",
      message: "List not found",
    });
  }

  return await getExpandedList(c, listId);
};

const create: ActionHandler<typeof listInputs.create, ListSelect> = async (
  { data },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const { max: maxSortOrder } = await db
    .select({ max: max(List.sortOrder) })
    .from(List)
    .where(eq(List.userId, userId))
    .then((rows) => rows[0]);

  const newList = await db
    .insert(List)
    .values({
      id: uuid(),
      sortOrder: maxSortOrder ? maxSortOrder + 1 : undefined,
      ...data,
      userId,
    })
    .returning()
    .then((rows) => rows[0]);
  return newList;
};

const update: ActionHandler<typeof listInputs.update, ListSelect> = async (
  { listId, data },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const { sortOrder } = data;

  const [updated] = await db
    .update(List)
    .set({ ...data })
    .where(idAndUserIdFilter(List, { userId, id: listId }))
    .returning();

  if (sortOrder !== undefined) {
    const listsFromDb = await db
      .select({ sortOrder: List.sortOrder, id: List.id })
      .from(List)
      .where(and(eq(List.userId, userId)))
      .orderBy(List.sortOrder);

    const listIds = listsFromDb.map((l) => l.id);
    const indexOfList = listIds.indexOf(listId);

    const reordered = reorder({
      list: listIds,
      startIndex: indexOfList,
      finishIndex: sortOrder,
    });

    await Promise.all(
      reordered.map((listId, idx) => {
        return db
          .update(List)
          .set({ sortOrder: idx })
          .where(idAndUserIdFilter(List, { userId, id: listId }))
          .returning();
      }),
    );
  }

  return updated;
};

const remove: ActionHandler<typeof listInputs.remove, null> = async (
  { listId },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const listCategories = await db
    .select()
    .from(Category)
    .where(and(eq(Category.listId, listId), eq(Category.userId, userId)));

  if (listCategories.length) {
    await db.delete(CategoryItem).where(
      inArray(
        CategoryItem.categoryId,
        listCategories.map((c) => c.id),
      ),
    );
  }
  await db.delete(Category).where(eq(Category.listId, listId));
  await db
    .delete(List)
    .where(idAndUserIdFilter(List, { userId, id: listId }))
    .returning()
    .then((rows) => rows[0]);
  return null;
};

const unpack: ActionHandler<typeof listInputs.unpack, null> = async (
  { listId },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const categoryItems = await db
    .select({ id: CategoryItem.id })
    .from(CategoryItem)
    .leftJoin(Category, eq(Category.id, CategoryItem.categoryId))
    .where(and(eq(Category.listId, listId), eq(Category.userId, userId)));
  const ids = categoryItems.filter((i) => i !== null).map((ci) => ci.id!);
  await db
    .update(CategoryItem)
    .set({ packed: false })
    .where(inArray(CategoryItem.id, ids));
  return null;
};

const duplicate: ActionHandler<
  typeof listInputs.duplicate,
  { listId: string }
> = async ({ listId }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const list = await db
    .select()
    .from(List)
    .where(idAndUserIdFilter(List, { userId, id: listId }))
    .then((rows) => rows[0]);

  const categories = await db
    .select()
    .from(Category)
    .where(eq(Category.listId, listId))
    .orderBy(Category.sortOrder);

  const categoryItems = await db
    .select()
    .from(CategoryItem)
    .leftJoin(Category, eq(CategoryItem.categoryId, Category.id))
    .where(eq(Category.listId, listId));

  const { id: newListId } = await db
    .insert(List)
    .values({
      ...list,
      id: uuid(),
      name: `${list.name} (Copy)`,
    })
    .returning()
    .then((rows) => rows[0]);

  await Promise.all(
    categories.map(async (category) => {
      const newCategory = await db
        .insert(Category)
        .values({
          ...category,
          id: uuid(),
          listId: newListId,
        })
        .returning()
        .then((rows) => rows[0]);

      const newCategoryItems = categoryItems
        .filter((ci) => ci.categoryItem.categoryId === category.id)
        .map((ci) => ({
          ...ci.categoryItem,
          id: uuid(),
          categoryId: newCategory.id,
        }));

      await db.insert(CategoryItem).values(newCategoryItems);
      return newCategory;
    }),
  );

  return { listId: newListId };
};

const listHandlers = {
  getAll,
  getOne,
  create,
  update,
  remove,
  unpack,
  duplicate,
};
export default listHandlers;
