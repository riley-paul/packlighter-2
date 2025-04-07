import { zCategoryInsert } from "@/lib/types";
import { z } from "zod";

const categoryInputs = {
  getFromOtherLists: z.object({ listId: z.string() }),
  copyToList: z.object({
    categoryId: z.string(),
    listId: z.string(),
  }),
  create: z.object({
    listId: z.string(),
    data: zCategoryInsert.partial().optional(),
  }),
  remove: z.object({ categoryId: z.string() }),
  update: z.object({
    categoryId: z.string(),
    data: zCategoryInsert
      .omit({ userId: true, listId: true, id: true })
      .partial(),
  }),
  togglePacked: z.object({ categoryId: z.string() }),
};
export default categoryInputs;
