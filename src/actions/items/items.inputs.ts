import { stringToJSONSchema } from "@/lib/client/utils";
import { zItemInsert } from "@/lib/types";
import { z } from "zod";

const itemInputs = {
  getAll: z.any(),
  create: z.object({ data: zItemInsert.partial().optional() }),
  duplicate: z.object({ itemId: z.string() }),
  remove: z.object({ itemId: z.string() }),
  update: z.object({
    itemId: z.string(),
    itemImageFile: z.instanceof(File).optional(),
    data: stringToJSONSchema.pipe(zItemInsert.partial()),
  }),
  getListsIncluded: z.object({ itemId: z.string() }),
};
export default itemInputs;
