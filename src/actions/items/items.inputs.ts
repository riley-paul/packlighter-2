import { zItemInsert } from "@/lib/types";
import { z } from "zod";

const itemInputs = {
  getAll: z.any(),
  create: zItemInsert.omit({ userId: true }),
  update: zItemInsert.omit({ userId: true }).partial().required({ id: true }),
  duplicate: z.object({ itemId: z.string() }),
  remove: z.object({ itemId: z.string() }),
  getListsIncluded: z.object({ itemId: z.string() }),
  imageUpload: z.object({
    itemId: z.string(),
    imageFile: z.instanceof(File).optional(),
    removeImageFile: z.boolean().optional(),
  }),
};
export default itemInputs;
