import { zItemInsert } from "@/lib/types";
import { z } from "zod";

const itemInputs = {
  getAll: z.any(),
  create: zItemInsert.omit({ userId: true }),
  duplicate: z.object({ itemId: z.string() }),
  remove: z.object({ itemId: z.string() }),
  update: zItemInsert.partial().omit({ userId: true }).required({ id: true }),
  getListsIncluded: z.object({ itemId: z.string() }),
};
export default itemInputs;

export type ItemUpdateInput = z.infer<typeof itemInputs.update>;
export type ItemCreateInput = z.infer<typeof itemInputs.create>;
