import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

const id = text("id")
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID());

const userId = text()
  .notNull()
  .references(() => User.id, { onDelete: "cascade" });

export type Unit = {
  symbol: string;
  multiplier: number;
  name: string;
};

export const weightUnits = ["g", "kg", "oz", "lb"] as const;
export type WeightUnit = (typeof weightUnits)[number];
export const weightUnitsInfo: Unit[] = [
  { symbol: "g", multiplier: 1, name: "grams" },
  { symbol: "kg", multiplier: 1000, name: "kilograms" },
  { symbol: "oz", multiplier: 28.3495, name: "ounces" },
  { symbol: "lb", multiplier: 453.592, name: "pounds" },
];

const timeStamps = {
  createdAt: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString()),
};

export const User = sqliteTable("user", {
  id,
  email: text().notNull().unique(),
  name: text().notNull(),
  avatarUrl: text(),

  googleId: text().unique(),
  githubId: integer().unique(),
  githubUsername: text().unique(),
  ...timeStamps,
});
export const zUserSelect = createSelectSchema(User);
export const zUserInsert = createInsertSchema(User);
export type UserSelect = z.infer<typeof zUserSelect>;
export type UserInsert = z.infer<typeof zUserInsert>;

export const UserSession = sqliteTable("userSession", {
  id,
  userId,
  expiresAt: text(),
  ...timeStamps,
});

export const Item = sqliteTable("item", {
  id,
  userId,
  name: text().notNull().default(""),
  description: text().notNull().default(""),
  weight: integer().notNull().default(0),
  weightUnit: text({ enum: weightUnits }).notNull().default("g"),
  image: text(),
  ...timeStamps,
});
export const zItemSelect = createSelectSchema(Item);
export const zItemInsert = createInsertSchema(Item);
export type ItemSelect = z.infer<typeof zItemSelect>;
export type ItemInsert = z.infer<typeof zItemInsert>;

export const List = sqliteTable("list", {
  id,
  userId,
  name: text().notNull().default(""),
  description: text().notNull().default(""),

  showImages: integer({ mode: "boolean" }).notNull().default(false),
  showPrices: integer({ mode: "boolean" }).notNull().default(false),
  showPacked: integer({ mode: "boolean" }).notNull().default(false),
  showWeights: integer({ mode: "boolean" }).notNull().default(false),

  sortOrder: integer().notNull().default(0),
  weightUnit: text({ enum: weightUnits }).notNull().default("g"),
  isPublic: integer({ mode: "boolean" }).notNull().default(false),
  ...timeStamps,
});
export const zListSelect = createSelectSchema(List);
export const zListInsert = createInsertSchema(List);
export type ListSelect = z.infer<typeof zListSelect>;
export type ListInsert = z.infer<typeof zListInsert>;

export const Category = sqliteTable("category", {
  id,
  userId,
  listId: text()
    .notNull()
    .references(() => List.id, { onDelete: "cascade" }),
  name: text().notNull().default(""),
  sortOrder: integer().notNull().default(0),
  ...timeStamps,
});
export const zCategorySelect = createSelectSchema(Category);
export const zCategoryInsert = createInsertSchema(Category);
export type CategorySelect = z.infer<typeof zCategorySelect>;
export type CategoryInsert = z.infer<typeof zCategoryInsert>;

export const CategoryItem = sqliteTable("categoryItem", {
  id,
  userId,
  categoryId: text()
    .notNull()
    .references(() => Category.id, { onDelete: "cascade" }),
  itemId: text()
    .notNull()
    .references(() => Item.id, { onDelete: "cascade" }),

  sortOrder: integer().notNull().default(0),
  quantity: integer().notNull().default(1),

  packed: integer({ mode: "boolean" }).notNull().default(false),
  wornWeight: integer({ mode: "boolean" }).notNull().default(false),
  consumableWeight: integer({ mode: "boolean" }).notNull().default(false),
  ...timeStamps,
});
export const zCategoryItemSelect = createSelectSchema(CategoryItem);
export const zCategoryItemInsert = createInsertSchema(CategoryItem);
export type CategoryItemSelect = z.infer<typeof zCategoryItemSelect>;
export type CategoryItemInsert = z.infer<typeof zCategoryItemInsert>;

export const AppFeedback = sqliteTable("appFeedback", {
  id,
  userId,
  feedback: text().notNull(),
  ...timeStamps,
});
export const zAppFeedbackSelect = createSelectSchema(AppFeedback);
export const zAppFeedbackInsert = createInsertSchema(AppFeedback);
export type AppFeedbackSelect = z.infer<typeof zAppFeedbackSelect>;
export type AppFeedbackInsert = z.infer<typeof zAppFeedbackInsert>;
