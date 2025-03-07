import { sqliteTable, text } from "drizzle-orm/sqlite-core";

const id = text("id")
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID());

const timeStamps = {
  createdAt: text().$defaultFn(() => new Date().toISOString()),
  updatedAt: text()
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString()),
};

export const user = sqliteTable("user", {
  id,
  email: text().unique(),

  googleId: text().unique(),
  githubId: text().unique(),
  githubUsername: text().unique(),

  name: text(),
  avatarUrl: text(),
  ...timeStamps,
});
