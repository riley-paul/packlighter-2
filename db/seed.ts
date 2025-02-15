import { Category, CategoryItem, Item, List, User, db } from "astro:db";
import { randomItemFromArray, randomNumberWithinRange } from "./seeds/utils";
import { categoryNames } from "./seeds/category-names";
import { itemNamesDescs } from "./seeds/item-names-descs";
import { listNamesDescs } from "./seeds/list-names-descs";
import { imageLinks } from "./seeds/image-links";

import { v4 as uuid } from "uuid";
import { weightUnits } from "@/lib/types";

// https://astro.build/db/seed
export default async function seed() {
  const { id: userId } = await db
    .insert(User)
    .values({
      id: uuid(),
      email: "rileypaul96@gmail.com",
      githubId: 71047303,
      githubUsername: "rjp301",
      name: "Riley Paul",
      avatarUrl: "https://avatars.githubusercontent.com/u/71047303?v=4",
    })
    .returning()
    .then((rows) => rows[0]);

  const lists = await db
    .insert(List)
    .values(
      listNamesDescs.map(({ name, description }, idx) => ({
        id: uuid(),
        userId,
        name,
        description,
        sortOrder: idx + 1,
      })),
    )
    .returning();
  console.log(`✅ Seeded ${lists.length} lists`);

  const items = await db
    .insert(Item)
    .values(
      itemNamesDescs.map(({ name, description }) => ({
        id: uuid(),
        userId,
        name,
        description,
        image: randomItemFromArray(imageLinks),
        weight: randomNumberWithinRange(1, 1000),
        weightUnits: randomItemFromArray(Object.values(weightUnits)),
      })),
    )
    .returning();
  console.log(`✅ Seeded ${items.length} items`);

  const categories = await db
    .insert(Category)
    .values(
      new Array(20).fill(0).map((_, index) => ({
        id: uuid(),
        listId: randomItemFromArray(lists).id,
        userId,
        sortOrder: index + 1,
        name: randomItemFromArray(categoryNames),
      })),
    )
    .returning();
  console.log(`✅ Seeded ${categories.length} categories`);

  const categoryItems = await db
    .insert(CategoryItem)
    .values(
      new Array(200).fill(0).map(() => ({
        id: uuid(),
        userId,
        categoryId: randomItemFromArray(categories).id,
        itemId: randomItemFromArray(items).id,
        quantity: randomNumberWithinRange(1, 10),
      })),
    )
    .returning();
  console.log(`✅ Seeded ${categoryItems.length} categoryItems`);
}
