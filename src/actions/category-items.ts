import { z } from "zod";
import { idAndUserIdFilter } from "@/lib/validators.ts";
import { ActionError, defineAction } from "astro:actions";
import { getListItemIds, isAuthorized } from "@/lib/helpers";
import db from "@/db";
import {
  CategoryItem,
  Item,
  Category,
  zItemInsert,
  zCategoryItemInsert,
} from "@/db/schema";
import { and, eq, max } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export const create = defineAction({
  input: z.object({
    itemId: z.string(),
    categoryId: z.string(),
    reorderIds: z.array(z.string()).optional(),
    data: zCategoryItemInsert.optional(),
  }),
  handler: async ({ itemId, categoryId, reorderIds, data }, c) => {
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
  },
});

export const createAndAddToCategory = defineAction({
  input: z.object({
    categoryId: z.string(),
    itemData: zItemInsert.optional(),
    data: zCategoryItemInsert.optional(),
  }),
  handler: async ({ categoryId, itemData, data }, c) => {
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
        ...data,
        userId,
      })
      .returning()
      .then((rows) => rows[0]);

    return created;
  },
});

export const reorder = defineAction({
  input: z.object({ ids: z.string().array(), categoryId: z.string() }),
  handler: async ({ ids, categoryId }, c) => {
    const userId = isAuthorized(c).id;
    await Promise.all(
      ids.map((id, index) =>
        db
          .update(CategoryItem)
          .set({ sortOrder: index + 1, categoryId })
          .where(idAndUserIdFilter(CategoryItem, { userId, id })),
      ),
    );
    return true;
  },
});

export const update = defineAction({
  input: z.object({
    categoryItemId: z.string(),
    data: zCategoryItemInsert,
  }),
  handler: async ({ categoryItemId, data }, c) => {
    const userId = isAuthorized(c).id;
    const updated = await db
      .update(CategoryItem)
      .set(data)
      .where(idAndUserIdFilter(CategoryItem, { userId, id: categoryItemId }))
      .returning()
      .then((rows) => rows[0]);
    return updated;
  },
});

export const remove = defineAction({
  input: z.object({ categoryItemId: z.string() }),
  handler: async ({ categoryItemId }, c) => {
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

    return true;
  },
});
