import { Category, CategoryItem, Item, List, and, db, eq } from "astro:db";
import { idAndUserIdFilter } from "@/lib/validators.ts";
import { ActionError, defineAction } from "astro:actions";
import { isAuthorized } from "@/lib/helpers";

import { v4 as uuid } from "uuid";
import { z } from "zod";

const itemUpdateSchema = z.custom<Partial<typeof Item.$inferInsert>>();

export const create = defineAction({
  input: z.object({
    data: itemUpdateSchema.optional(),
  }),
  handler: async ({ data }, c) => {
    const userId = isAuthorized(c).id;
    const newItem = await db
      .insert(Item)
      .values({ ...data, userId, id: uuid() })
      .returning()
      .then((rows) => rows[0]);
    return newItem;
  },
});

export const duplicate = defineAction({
  input: z.object({ itemId: z.string() }),
  handler: async ({ itemId }, c) => {
    const userId = isAuthorized(c).id;
    const item = await db
      .select()
      .from(Item)
      .where(idAndUserIdFilter(Item, { userId, id: itemId }))
      .then((rows) => rows[0]);

    if (!item) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Item not found",
      });
    }

    const newItem = await db
      .insert(Item)
      .values({ ...item, id: uuid() })
      .returning()
      .then((rows) => rows[0]);

    return newItem;
  },
});

export const remove = defineAction({
  input: z.object({ itemId: z.string() }),
  handler: async ({ itemId }, c) => {
    const userId = isAuthorized(c).id;
    await db.delete(CategoryItem).where(eq(CategoryItem.itemId, itemId));
    await db
      .delete(Item)
      .where(idAndUserIdFilter(Item, { userId, id: itemId }));
    return { success: true };
  },
});

export const update = defineAction({
  input: z.object({
    itemId: z.string(),
    data: itemUpdateSchema,
  }),
  handler: async ({ itemId, data }, c) => {
    const userId = isAuthorized(c).id;
    const updated = await db
      .update(Item)
      .set(data)
      .where(idAndUserIdFilter(Item, { userId, id: itemId }))
      .returning()
      .then((rows) => rows[0]);
    return updated;
  },
});

export const getListsIncluded = defineAction({
  input: z.object({
    itemId: z.string(),
  }),
  handler: async ({ itemId }, c) => {
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
  },
});
