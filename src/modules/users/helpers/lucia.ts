import { Lucia } from "lucia";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { GitHub, Google } from "arctic";
import db from "@/db";
import { User } from "@/db/schema";

import env from "@/envs";

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NODE_ENV,
  COOLIFY_FQDN,
} = env;

// @ts-ignore
const adapter = new DrizzleSQLiteAdapter(db, UserSession, User);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: NODE_ENV === "production",
    },
  },
  getUserAttributes: async (user) => {
    return user;
  },
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

type DatabaseUserAttributes = Omit<typeof User.$inferSelect, "id">;

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);

const url = COOLIFY_FQDN;

export const google = new Google(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  url + "/login/google/callback",
);
