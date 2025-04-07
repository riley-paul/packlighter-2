import { zCategoryItemInsert, zItemInsert } from "@/lib/types";
import { z } from "zod";

const categoryItemInputs = {
  create: z.object({
    itemId: z.string(),
    categoryId: z.string(),
    reorderIds: z.array(z.string()).optional(),
    data: zCategoryItemInsert.optional(),
  }),
  createAndAddToCategory: z.object({
    categoryId: z.string(),
    itemData: zItemInsert.partial().optional(),
    categoryItemData: zCategoryItemInsert.partial().optional(),
  }),
  update: z.object({
    categoryItemId: z.string(),
    data: zCategoryItemInsert.omit({ userId: true }).partial(),
  }),
  remove: z.object({ categoryItemId: z.string() }),
};
export default categoryItemInputs;
