import { defineAction } from "astro:actions";
import db from "@/db";
import { User } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUser, isAuthorized } from "@/actions/helpers";

export const getMe = defineAction({
  handler: async (_, c) => {
    const user = c.locals.user;
    if (!user) return null;
    return await getUser(user.id);
  },
});

export const remove = defineAction({
  handler: async (_, c) => {
    const userId = isAuthorized(c).id;
    await db.delete(User).where(eq(User.id, userId));
    return true;
  },
});
