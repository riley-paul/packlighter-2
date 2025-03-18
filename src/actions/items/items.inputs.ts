import { zItemInsert } from "@/db/schema";
import { z } from "zod";

const itemInputs = {
  getAll: z.any(),
  create: z.object({ data: zItemInsert.partial().optional() }),
  duplicate: z.object({ itemId: z.string() }),
  remove: z.object({ itemId: z.string() }),
  update: z.object({ itemId: z.string(), data: zItemInsert.partial() }),
  getListsIncluded: z.object({ itemId: z.string() }),
};
export default itemInputs;
