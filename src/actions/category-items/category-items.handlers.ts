import { idAndUserIdFilter } from "@/actions/filters";
import { ActionError, type ActionHandler } from "astro:actions";
import { getListItemIds, isAuthorized } from "@/actions/helpers";
import db from "@/db";
import { CategoryItem, Item, Category } from "@/db/schema";
import { and, eq, max } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import type { CategoryItemInsert } from "@/lib/types";
import type categoryItemInputs from "./category-items.inputs";

const create: ActionHandler<
  typeof categoryItemInputs.create,
  CategoryItemInsert
> = async ({ itemId, categoryId, reorderIds, data }, c) => {
  const userId = isAuthorized(c).id;

  const { listId } = await db
    .select({ listId: Category.listId })
    .from(Category)
    .where(and(eq(Category.id, categoryId), eq(Category.userId, userId)))
    .then((rows) => rows[0]);

  if (!listId) {
    throw new ActionError({
      code: "NOT_FOUND",
      message: "Category not found",
    });
  }

  const listItemIds = await getListItemIds(listId);

  if (listItemIds.has(itemId)) {
    throw new ActionError({
      code: "CONFLICT",
      message: "Item already exists in the list",
    });
  }

  const { max: maxSortOrder } = await db
    .select({ max: max(CategoryItem.sortOrder) })
    .from(CategoryItem)
    .where(eq(CategoryItem.categoryId, categoryId))
    .then((rows) => rows[0]);

  const created = await db
    .insert(CategoryItem)
    .values({
      id: uuid(),
      ...data,
      sortOrder: maxSortOrder ?? 1,
      categoryId,
      itemId,
      userId,
    })
    .returning()
    .then((rows) => rows[0]);

  if (reorderIds) {
    await Promise.all(
      reorderIds.map((id, index) =>
        db
          .update(CategoryItem)
          .set({ sortOrder: index + 1, categoryId })
          .where(idAndUserIdFilter(CategoryItem, { userId, id })),
      ),
    );
  }

  return created;
};

const createAndAddToCategory: ActionHandler<
  typeof categoryItemInputs.createAndAddToCategory,
  CategoryItemInsert
> = async ({ categoryId, itemData, categoryItemData }, c) => {
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

  const created = await db
    .insert(CategoryItem)
    .values({
      id: uuid(),
      sortOrder: maxSortOrder ?? 1,
      categoryId,
      itemId: newItem.id,
      ...categoryItemData,
      userId,
    })
    .returning()
    .then((rows) => rows[0]);

  return created;
};

const reorder: ActionHandler<typeof categoryItemInputs.reorder, null> = async (
  { ids, categoryId },
  c,
) => {
  const userId = isAuthorized(c).id;
  await Promise.all(
    ids.map((id, index) =>
      db
        .update(CategoryItem)
        .set({ sortOrder: index + 1, categoryId })
        .where(idAndUserIdFilter(CategoryItem, { userId, id })),
    ),
  );
  return null;
};

const update: ActionHandler<
  typeof categoryItemInputs.update,
  CategoryItemInsert
> = async ({ categoryItemId, data }, c) => {
  const userId = isAuthorized(c).id;
  const updated = await db
    .update(CategoryItem)
    .set(data)
    .where(idAndUserIdFilter(CategoryItem, { userId, id: categoryItemId }))
    .returning()
    .then((rows) => rows[0]);
  return updated;
};

const remove: ActionHandler<typeof categoryItemInputs.remove, null> = async (
  { categoryItemId },
  c,
) => {
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
