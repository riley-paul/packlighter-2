import { Category, CategoryItem, Item, List } from "@/db/schema";
import { createDb } from "@/db";
import { and, eq } from "drizzle-orm";

import { idAndUserIdFilter } from "@/actions/filters";
import { ActionError, type ActionHandler } from "astro:actions";
import { isAuthorized } from "@/actions/helpers";

import { v4 as uuid } from "uuid";
import type itemInputs from "./items.inputs";
import type { IncludedList, ItemSelect } from "@/lib/types";

const getAll: ActionHandler<typeof itemInputs.getAll, ItemSelect[]> = async (
  _,
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const items = await db.select().from(Item).where(eq(Item.userId, userId));
  return items;
};

const create: ActionHandler<typeof itemInputs.create, ItemSelect> = async (
  data,
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const [newItem] = await db
    .insert(Item)
    .values({ ...data, userId, id: uuid() })
    .returning();
  return newItem;
};

const duplicate: ActionHandler<
  typeof itemInputs.duplicate,
  ItemSelect
> = async ({ itemId }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const [item] = await db
    .select()
    .from(Item)
    .where(idAndUserIdFilter(Item, { userId, id: itemId }));

  if (!item) {
    throw new ActionError({
      code: "NOT_FOUND",
      message: "Item not found",
    });
  }

  const [newItem] = await db
    .insert(Item)
    .values({ ...item, id: uuid() })
    .returning();

  return newItem;
};

const remove: ActionHandler<typeof itemInputs.remove, null> = async (
  { itemId },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const [item] = await db
    .select()
    .from(Item)
    .where(idAndUserIdFilter(Item, { userId, id: itemId }));

  if (!item) {
    throw new ActionError({
      code: "NOT_FOUND",
      message: "Item not found",
    });
  }

  if (item.imageR2Key) {
    await c.locals.runtime.env.R2_BUCKET.delete(item.imageR2Key);
  }

  await db.delete(CategoryItem).where(eq(CategoryItem.itemId, itemId));
  await db.delete(Item).where(idAndUserIdFilter(Item, { userId, id: itemId }));
  return null;
};

const update: ActionHandler<typeof itemInputs.update, ItemSelect> = async (
  data,
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const { id: itemId } = data;

  const [item] = await db
    .select()
    .from(Item)
    .where(idAndUserIdFilter(Item, { userId, id: itemId }));

  if (!item) {
    throw new ActionError({
      code: "NOT_FOUND",
      message: "Item not found",
    });
  }

  const [updated] = await db
    .update(Item)
    .set(data)
    .where(idAndUserIdFilter(Item, { userId, id: itemId }))
    .returning();
  return updated;
};

const getListsIncluded: ActionHandler<
  typeof itemInputs.getListsIncluded,
  IncludedList[]
> = async ({ itemId }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const result = await db
    .select({
      listId: List.id,
      listName: List.name,
      categoryName: Category.name,
    })
    .from(CategoryItem)
    .rightJoin(Category, eq(Category.id, CategoryItem.categoryId))
    .rightJoin(List, eq(List.id, Category.listId))
    .where(and(eq(List.userId, userId), eq(CategoryItem.itemId, itemId)));
  return result;
};

const imageUpload: ActionHandler<typeof itemInputs.imageUpload, null> = async (
  { itemId, imageFile, remove },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const [item] = await db
    .select({ id: Item.id, userId: Item.userId, imageKey: Item.imageR2Key })
    .from(Item)
    .where(idAndUserIdFilter(Item, { userId, id: itemId }));

  if (!item) {
    throw new ActionError({
      code: "NOT_FOUND",
      message: "Item not found",
    });
  }

  if (item.userId !== userId) {
    throw new ActionError({
      code: "UNAUTHORIZED",
      message: "You are not authorized to update this item",
    });
  }

  if (imageFile && imageFile.size > 0) {
    const key = crypto.randomUUID();
    await c.locals.runtime.env.R2_BUCKET.put(key, imageFile);
    await db
      .update(Item)
      .set({ imageR2Key: key, imageType: "file" })
      .where(eq(Item.id, itemId));
  }

  if (remove && item.imageKey) {
    await c.locals.runtime.env.R2_BUCKET.delete(item.imageKey);
    await db.update(Item).set({ imageR2Key: null }).where(eq(Item.id, itemId));
  }

  return null;
};

const itemHandlers = {
  getAll,
  create,
  duplicate,
  remove,
  update,
  getListsIncluded,
  imageUpload,
};

export default itemHandlers;
