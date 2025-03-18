import { type ActionHandler } from "astro:actions";
import db from "@/db";
import { User } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUser, isAuthorized } from "@/actions/helpers";
import type userInputs from "./users.inputs";
import type { UserSelect } from "@/lib/types";

const getMe: ActionHandler<typeof userInputs.getMe, UserSelect | null> = async (
  _,
  c,
) => {
  const user = c.locals.user;
  if (!user) return null;
  return await getUser(user.id);
};

const remove: ActionHandler<typeof userInputs.remove, null> = async (_, c) => {
  const userId = isAuthorized(c).id;
  await db.delete(User).where(eq(User.id, userId));
  return null;
};

const userHandlers = {
  getMe,
  remove,
};
export default userHandlers;
