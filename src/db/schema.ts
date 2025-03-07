import { sqliteTable, text } from "drizzle-orm/sqlite-core";

const id = text("id")
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID());

const timeStamps = {
  createdAt: text("createdAt").$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updatedAt")
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString()),
};

export const user = sqliteTable("user", {
  id,
  email: text("email").unique(),

  googleId: text("googleId").unique(),
  githubId: text("githubId").unique(),
  githubUsername: text("githubUsername").unique(),

  name: text("name"),
  avatarUrl: text("avatarUrl"),
  ...timeStamps,
});
