import { Category, CategoryItem, List } from "@/db/schema";
import { eq, max, and, ne, desc, notInArray } from "drizzle-orm";
import { idAndUserIdFilter } from "@/actions/filters";
import { ActionError, type ActionHandler } from "astro:actions";
import { getExpandedCategory, isAuthorized } from "@/actions/helpers";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";

import { v4 as uuid } from "uuid";
import type categoryInputs from "./categories.inputs";
import type { ExpandedCategory, OtherCategory } from "@/lib/types";
import { createDb } from "@/db";

const getFromOtherLists: ActionHandler<
  typeof categoryInputs.getFromOtherLists,
  OtherCategory[]
> = async ({ listId }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const categories = await db
    .select({
      id: Category.id,
      name: Category.name,
      listName: List.name,
      listId: List.id,
    })
    .from(Category)
    .innerJoin(List, eq(Category.listId, List.id))
    .where(and(eq(Category.userId, userId), ne(Category.listId, listId)))
    .orderBy(desc(List.sortOrder), desc(Category.sortOrder));
  return categories;
};

const copyToList: ActionHandler<
  typeof categoryInputs.copyToList,
  ExpandedCategory
> = async ({ categoryId, listId }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const { max: maxSortOrder } = await db
    .select({ max: max(Category.sortOrder) })
    .from(Category)
    .where(eq(Category.listId, listId))
    .then((rows) => rows[0]);

  const category = await db
    .select()
    .from(Category)
    .where(idAndUserIdFilter(Category, { id: categoryId, userId }))
    .then((rows) => rows[0]);

  if (!category) {
    throw new ActionError({
      message: "Category not found",
      code: "NOT_FOUND",
    });
  }

  const list = await db
    .select({ id: List.id })
    .from(List)
    .where(eq(List.id, listId));
  if (list.length < 1) {
    throw new ActionError({
      message: "List not found",
      code: "NOT_FOUND",
    });
  }

  const listItemIds = await db
    .select({ id: CategoryItem.itemId })
    .from(CategoryItem)
    .innerJoin(Category, eq(CategoryItem.categoryId, Category.id))
    .where(eq(Category.listId, listId))
    .then((rows) => rows.map((row) => row.id));

  const categoryItems = await db
    .select()
    .from(CategoryItem)
    .where(
      and(
        eq(CategoryItem.categoryId, categoryId),
        listItemIds.length > 0
          ? notInArray(CategoryItem.itemId, listItemIds)
          : undefined,
      ),
    );

  const newCategory = await db
    .insert(Category)
    .values({
      ...category,
      id: uuid(),
      sortOrder: maxSortOrder ? maxSortOrder + 1 : undefined,
      listId,
      userId,
    })
    .returning()
    .then((rows) => rows[0]);

  await Promise.all(
    categoryItems.map((item) =>
      db.insert(CategoryItem).values({
        ...item,
        id: uuid(),
        packed: false,
        categoryId: newCategory.id,
        userId,
      }),
    ),
  );
  return getExpandedCategory(c, newCategory.id);
};

const create: ActionHandler<
  typeof categoryInputs.create,
  ExpandedCategory
> = async ({ listId, data }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const { max: maxSortOrder } = await db
    .select({ max: max(Category.sortOrder) })
    .from(Category)
    .where(eq(Category.listId, listId))
    .then((rows) => rows[0]);

  const [{ id: categoryId }] = await db
    .insert(Category)
    .values({
      sortOrder: maxSortOrder ? maxSortOrder + 1 : undefined,
      ...data,
      listId,
      userId,
    })
    .returning();

  return getExpandedCategory(c, categoryId);
};

const remove: ActionHandler<typeof categoryInputs.remove, null> = async (
  { categoryId },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  await db.delete(CategoryItem).where(eq(CategoryItem.categoryId, categoryId));
  await db
    .delete(Category)
    .where(idAndUserIdFilter(Category, { id: categoryId, userId }));
  return null;
};

const update: ActionHandler<
  typeof categoryInputs.update,
  ExpandedCategory
> = async ({ categoryId, data }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const [category] = await db
    .select()
    .from(Category)
    .where(eq(Category.id, categoryId));

  if (!category) {
    throw new ActionError({
      message: "Category not found",
      code: "NOT_FOUND",
    });
  }

  if (category.userId !== userId) {
    throw new ActionError({
      message: "Unauthorized",
      code: "UNAUTHORIZED",
    });
  }

  const { listId } = category;
  const { sortOrder } = data;

  await db
    .update(Category)
    .set({ ...data, userId })
    .where(idAndUserIdFilter(Category, { id: categoryId, userId }));

  if (sortOrder !== undefined) {
    const categories = await db
      .select({ id: Category.id })
      .from(Category)
      .where(and(eq(Category.listId, listId)))
      .orderBy(Category.sortOrder);

    const categoryIds = categories.map((l) => l.id);
    const indexOfCategory = categoryIds.indexOf(categoryId);

    const reordered = reorder({
      list: categoryIds,
      startIndex: indexOfCategory,
      finishIndex: sortOrder,
    });

    await Promise.all(
      reordered.map((categoryId, idx) => {
        return db
          .update(Category)
          .set({ sortOrder: idx })
          .where(idAndUserIdFilter(Category, { userId, id: categoryId }))
          .returning();
      }),
    );
  }

  return getExpandedCategory(c, categoryId);
};

const togglePacked: ActionHandler<
  typeof categoryInputs.togglePacked,
  ExpandedCategory
> = async ({ categoryId }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const categoryItems = await db
    .select()
    .from(CategoryItem)
    .where(
      and(
        eq(CategoryItem.categoryId, categoryId),
        eq(CategoryItem.userId, userId),
      ),
    );

  const fullyPacked = categoryItems.every((item) => item.packed);

  await db
    .update(CategoryItem)
    .set({ packed: !fullyPacked })
    .where(
      and(
        eq(CategoryItem.categoryId, categoryId),
        eq(CategoryItem.userId, userId),
      ),
    );

  return getExpandedCategory(c, categoryId);
};

const categoryHandlers = {
  getFromOtherLists,
  copyToList,
  create,
  remove,
  update,
  togglePacked,
};
export default categoryHandlers;
