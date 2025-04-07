import { z } from "zod";
import { zListInsert } from "@/lib/types";

const listInputs = {
  getAll: z.any(),
  getOne: z.object({
    listId: z.string(),
  }),
  create: z.object({
    data: zListInsert.partial().optional(),
  }),
  update: z.object({
    listId: z.string(),
    data: zListInsert
      .omit({
        id: true,
        userId: true,
      })
      .partial(),
  }),
  remove: z.object({ listId: z.string() }),
  unpack: z.object({ listId: z.string() }),
  duplicate: z.object({ listId: z.string() }),
};

export default listInputs;
