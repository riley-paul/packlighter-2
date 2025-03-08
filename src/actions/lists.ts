import { z } from "zod";
import db from "@/db";
import { List, Category, CategoryItem } from "@/db/schema";
import { and, eq, inArray, max } from "drizzle-orm";
import { idAndUserIdFilter } from "@/lib/validators.ts";
import { ActionError, defineAction } from "astro:actions";
import { getExpandedList, isAuthorized } from "@/lib/helpers";

import { v4 as uuid } from "uuid";

const listUpdateSchema = z.custom<Partial<typeof List.$inferInsert>>();

export const getAll = defineAction({
  handler: async (_, c) => {
    const userId = isAuthorized(c).id;
    const lists = await db
      .select()
      .from(List)
      .where(eq(List.userId, userId))
      .orderBy(List.sortOrder);
    return lists;
  },
});

export const getOne = defineAction({
  input: z.object({
    listId: z.string(),
  }),
  handler: async ({ listId }, c) => {
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

    return await getExpandedList(listId);
  },
});

export const create = defineAction({
  input: z.object({
    data: listUpdateSchema.optional(),
  }),
  handler: async ({ data }, c) => {
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
  },
});

export const reorder = defineAction({
  input: z.array(z.string()),
  handler: async (ids, c) => {
    const userId = isAuthorized(c).id;
    await Promise.all(
      ids.map((id, idx) =>
        db
          .update(List)
          .set({ sortOrder: idx + 1 })
          .where(idAndUserIdFilter(List, { userId, id })),
      ),
    );
    return ids;
  },
});

export const update = defineAction({
  input: z.object({
    listId: z.string(),
    data: listUpdateSchema,
  }),
  handler: async ({ listId, data }, c) => {
    const userId = isAuthorized(c).id;
    const updated = await db
      .update(List)
      .set({ ...data, userId })
      .where(idAndUserIdFilter(List, { userId, id: listId }))
      .returning()
      .then((rows) => rows[0]);
    return updated;
  },
});

export const remove = defineAction({
  input: z.object({ listId: z.string() }),
  handler: async ({ listId }, c) => {
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
    return true;
  },
});

export const unpack = defineAction({
  input: z.object({ listId: z.string() }),
  handler: async ({ listId }, c) => {
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
    return true;
  },
});

export const duplicate = defineAction({
  input: z.object({ listId: z.string() }),
  handler: async ({ listId }, c) => {
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
  },
});
