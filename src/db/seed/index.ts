import {
  Category,
  CategoryItem,
  Item,
  List,
  User,
  weightUnits,
} from "../schema";
import { randomItemFromArray, randomNumberWithinRange } from "./utils";
import { categoryNames } from "./category-names";
import { itemNamesDescs } from "./item-names-descs";
import { listNamesDescs } from "./list-names-descs";
import { imageLinks } from "./image-links";

import env from "@/envs-runtime";
import { createDb } from "..";

export default async function seed() {
  const db = createDb(env);
  await db.delete(User);

  const [{ id: userId }] = await db
    .insert(User)
    .values({
      email: "rileypaul96@gmail.com",
      githubId: 71047303,
      githubUsername: "rjp301",
      name: "Riley Paul",
      avatarUrl: "https://avatars.githubusercontent.com/u/71047303?v=4",
    })
    .returning();

  const lists = await db
    .insert(List)
    .values(
      listNamesDescs.map(({ name, description }, idx) => ({
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
      items.map((item) => ({
        userId,
        categoryId: randomItemFromArray(categories).id,
        itemId: item.id,
        quantity: randomNumberWithinRange(1, 10),
      })),
    )
    .returning();
  console.log(`✅ Seeded ${categoryItems.length} categoryItems`);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
