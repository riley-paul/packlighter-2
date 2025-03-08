import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const id = text("id")
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID());

const userId = text()
  .notNull()
  .references(() => User.id, { onDelete: "cascade" });

const weightUnitArray = ["g", "kg", "oz", "lb"] as const;

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
  weightUnit: text({ enum: weightUnitArray }).notNull().default("g"),
  image: text(),
  ...timeStamps,
});
export const zItemSelect = createSelectSchema(Item);
export const zItemInsert = createInsertSchema(Item);

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
  weightUnit: text({ enum: weightUnitArray }).notNull().default("g"),
  isPublic: integer({ mode: "boolean" }).notNull().default(false),
  ...timeStamps,
});
export const zListSelect = createSelectSchema(List);
export const zListInsert = createInsertSchema(List);

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

export const AppFeedback = sqliteTable("appFeedback", {
  id,
  userId,
  feedback: text().notNull(),
  ...timeStamps,
});
export const zAppFeedbackSelect = createSelectSchema(AppFeedback);
export const zAppFeedbackInsert = createInsertSchema(AppFeedback);
