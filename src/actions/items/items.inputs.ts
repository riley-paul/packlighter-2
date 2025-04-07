import { zItemInsert } from "@/lib/types";
import { z } from "zod";

const itemInputs = {
  getAll: z.any(),
  create: zItemInsert,
  update: zItemInsert.partial().required({ id: true }),
  duplicate: z.object({ itemId: z.string() }),
  remove: z.object({ itemId: z.string() }),
  getListsIncluded: z.object({ itemId: z.string() }),
};
export default itemInputs;

export type ItemUpdateInput = z.infer<typeof itemInputs.update>;
export type ItemCreateInput = z.infer<typeof itemInputs.create>;
