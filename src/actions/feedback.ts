import { isAuthorized } from "@/actions/helpers";
import { defineAction } from "astro:actions";
import db from "@/db";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { AppFeedback } from "@/db/schema";

export const create = defineAction({
  input: z.object({
    feedback: z.string(),
  }),
  handler: async ({ feedback }, c) => {
    const userId = isAuthorized(c).id;
    return await db
      .insert(AppFeedback)
      .values({ id: uuid(), feedback, userId })
      .returning()
      .then((rows) => rows[0]);
  },
});
