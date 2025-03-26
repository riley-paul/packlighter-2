import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const weightUnits = ["g", "kg", "oz", "lb"] as const;

const id = text("id")
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID());

const userId = text()
  .notNull()
  .references(() => User.id, { onDelete: "cascade" });

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

export const UserSession = sqliteTable("userSession", {
  id,
  userId,
  expiresAt: integer({ mode: "timestamp_ms" }).notNull(),
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
  imageUploaded: text(),
  imageType: text({ enum: ["url", "file"] })
    .notNull()
    .default("url"),
  ...timeStamps,
});

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
  consWeight: integer({ mode: "boolean" }).notNull().default(false),
  ...timeStamps,
});

export const AppFeedback = sqliteTable("appFeedback", {
  id,
  userId,
  feedback: text().notNull(),
  ...timeStamps,
});

export type AllTables =
  | typeof Item
  | typeof List
  | typeof Category
  | typeof CategoryItem
  | typeof AppFeedback;
