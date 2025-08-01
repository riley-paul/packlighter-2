import { idAndUserIdFilter } from "@/actions/filters";
import { ActionError, type ActionHandler } from "astro:actions";
import {
  getExpandedCategoryItem,
  getListItemIds,
  isAuthorized,
} from "@/actions/helpers";
import { CategoryItem, Item, Category } from "@/db/schema";
import { and, eq, max } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import type { CategoryItemSelect, ExpandedCategoryItem } from "@/lib/types";
import type categoryItemInputs from "./category-items.inputs";
import { createDb } from "@/db";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";

const create: ActionHandler<
  typeof categoryItemInputs.create,
  ExpandedCategoryItem
> = async ({ data }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  console.log("create category item", data);

  const [category] = await db
    .select({ listId: Category.listId, userId: Category.userId })
    .from(Category)
    .where(and(eq(Category.id, data.categoryId), eq(Category.userId, userId)));

  if (!category.listId) {
    throw new ActionError({
      code: "NOT_FOUND",
      message: "Category not found",
    });
  }

  if (category.userId !== userId) {
    throw new ActionError({
      code: "FORBIDDEN",
      message: "You do not have permission to access this category",
    });
  }

  const listItemIds = await getListItemIds(c, category.listId);

  if (listItemIds.has(data.itemId)) {
    throw new ActionError({
      code: "CONFLICT",
      message: "Item already exists in the list",
    });
  }

  const [{ max: maxSortOrder }] = await db
    .select({ max: max(CategoryItem.sortOrder) })
    .from(CategoryItem)
    .where(eq(CategoryItem.categoryId, data.categoryId));

  const [created] = await db
    .insert(CategoryItem)
    .values({
      id: uuid(),
      ...data,
      sortOrder: maxSortOrder ?? 0,
      userId,
    })
    .returning();

  if (data.sortOrder !== undefined) {
    const categoryItems = await db
      .select()
      .from(CategoryItem)
      .where(
        and(
          eq(CategoryItem.categoryId, data.categoryId),
          eq(CategoryItem.userId, userId),
        ),
      )
      .orderBy(CategoryItem.sortOrder);

    const categoryItemIds = categoryItems.map((i) => i.id);
    const indexOfCategoryItem = categoryItemIds.indexOf(created.id);

    const reordered = reorder({
      list: categoryItemIds,
      startIndex: indexOfCategoryItem,
      finishIndex: data.sortOrder,
    });

    await Promise.all(
      reordered.map((id, index) =>
        db
          .update(CategoryItem)
          .set({ sortOrder: index })
          .where(idAndUserIdFilter(CategoryItem, { userId, id })),
      ),
    );
  }

  return getExpandedCategoryItem(c, created.id);
};

const createAndAddToCategory: ActionHandler<
  typeof categoryItemInputs.createAndAddToCategory,
  CategoryItemSelect
> = async ({ categoryId, itemData, categoryItemData }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const newItem = await db
    .insert(Item)
    .values({ id: uuid(), ...itemData, userId })
    .returning()
    .then((rows) => rows[0]);

  const { max: maxSortOrder } = await db
    .select({ max: max(CategoryItem.sortOrder) })
    .from(CategoryItem)
    .where(eq(CategoryItem.categoryId, categoryId))
    .then((rows) => rows[0]);

  const [created] = await db
    .insert(CategoryItem)
    .values({
      id: uuid(),
      sortOrder: maxSortOrder ?? 1,
      categoryId,
      itemId: newItem.id,
      ...categoryItemData,
      userId,
    })
    .returning();

  return created;
};

const update: ActionHandler<
  typeof categoryItemInputs.update,
  CategoryItemSelect
> = async ({ categoryItemId, data }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const [updated] = await db
    .update(CategoryItem)
    .set(data)
    .where(idAndUserIdFilter(CategoryItem, { userId, id: categoryItemId }))
    .returning();

  const { categoryId, sortOrder } = data;

  if (sortOrder !== undefined) {
    const categoryItems = await db
      .select()
      .from(CategoryItem)
      .where(
        and(
          eq(CategoryItem.categoryId, categoryId || updated.categoryId),
          eq(CategoryItem.userId, userId),
        ),
      )
      .orderBy(CategoryItem.sortOrder);

    const categoryItemIds = categoryItems.map((i) => i.id);
    const indexOfCategoryItem = categoryItemIds.indexOf(categoryItemId);

    const reordered = reorder({
      list: categoryItemIds,
      startIndex: indexOfCategoryItem,
      finishIndex: sortOrder,
    });

    await Promise.all(
      reordered.map((id, index) =>
        db
          .update(CategoryItem)
          .set({ sortOrder: index })
          .where(idAndUserIdFilter(CategoryItem, { userId, id })),
      ),
    );
  }

  return updated;
};

const remove: ActionHandler<typeof categoryItemInputs.remove, null> = async (
  { categoryItemId },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const deleted = await db
    .delete(CategoryItem)
    .where(idAndUserIdFilter(CategoryItem, { userId, id: categoryItemId }))
    .returning()
    .then((rows) => rows[0]);

  // delete item if it has no name, description, and weight
  const item = await db
    .select()
    .from(Item)
    .where(eq(Item.id, deleted.itemId))
    .then((rows) => rows[0]);
  if (item.name === "" && item.description === "" && item.weight === 0) {
    await db.delete(Item).where(eq(Item.id, deleted.itemId));
  }

  return null;
};

const categoryItemHandlers = {
  create,
  createAndAddToCategory,
  reorder,
  update,
  remove,
};
export default categoryItemHandlers;
