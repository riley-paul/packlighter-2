import { createDb } from "@/db";
import { Category, CategoryItem, Item, List, User } from "@/db/schema";
import env from "@/envs-runtime";
import type {
  CategoryInsert,
  CategoryItemInsert,
  ItemInsert,
  ListInsert,
} from "@/lib/types";

const getRandomArrayItem = <T>(arr: T[]): T => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

export const USER_ID = crypto.randomUUID();
export const USER_EMAIL = `${crypto.randomUUID()}@example.com`;
export const LIST_ID = crypto.randomUUID();
export const LIST_IDS = new Array(5).fill(0).map(() => crypto.randomUUID());
export const ITEM_IDS = new Array(20).fill(0).map(() => crypto.randomUUID());
export const CATEGORY_IDS = new Array(5).fill(0).map(() => crypto.randomUUID());

export const seedTestData = async () => {
  const db = createDb(env);

  await db.insert(User).values({
    id: USER_ID,
    name: "Test User",
    email: USER_EMAIL,
  });

  await db.insert(Item).values(
    ITEM_IDS.map(
      (itemId): ItemInsert => ({
        id: itemId,
        name: "Test Item",
        description: "This is a test item",
        userId: USER_ID,
      }),
    ),
  );

  await db.insert(List).values(
    [LIST_ID, ...LIST_IDS].map(
      (listId, idx): ListInsert => ({
        id: listId,
        userId: USER_ID,
        name: "Test List",
        sortOrder: idx + 1,
        description: "This is a test list",
      }),
    ),
  );

  await db.insert(Category).values(
    CATEGORY_IDS.map(
      (categoryId, index): CategoryInsert => ({
        id: categoryId,
        name: "Test Category",
        listId: LIST_ID,
        userId: USER_ID,
        sortOrder: index + 1,
      }),
    ),
  );

  await db.insert(CategoryItem).values(
    ITEM_IDS.map(
      (itemId): CategoryItemInsert => ({
        itemId: itemId,
        categoryId: getRandomArrayItem(CATEGORY_IDS),
        userId: USER_ID,
      }),
    ),
  );
};
