import { isAuthorized } from "@/lib/helpers";
import { defineAction } from "astro:actions";
import db from "@/db";
import { Item, List } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getAllItems = defineAction({
  handler: async (_, c) => {
    const userId = isAuthorized(c).id;
    const items = await db.select().from(Item).where(eq(Item.userId, userId));
    return items;
  },
});

export const getAllLists = defineAction({
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
