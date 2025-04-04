import {
  AppFeedback,
  Category,
  CategoryItem,
  Item,
  List,
  User,
} from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export type Unit = {
  symbol: string;
  multiplier: number;
  name: string;
};

export type IncludedList = {
  listId: string;
  listName: string;
  categoryName: string | null;
};

export type OtherCategory = {
  id: string;
  name: string;
  listName: string;
  listId: string;
};

export const zUserSelect = createSelectSchema(User);
export const zUserInsert = createInsertSchema(User);
export type UserSelect = z.infer<typeof zUserSelect>;
export type UserInsert = z.infer<typeof zUserInsert>;

export type UserSessionInfo = {
  id: string;
  userId: string;
  expiresAt: Date;
};

export const zItemSelect = createSelectSchema(Item);
export const zItemInsert = createInsertSchema(Item);
export const zItemInsertWithFile = zItemInsert.extend({
  imageFile: z.instanceof(File).nullish(),
});
export type ItemSelect = z.infer<typeof zItemSelect>;
export type ItemInsert = z.infer<typeof zItemInsert>;
export type ItemInsertWithFile = z.infer<typeof zItemInsertWithFile>;

export const zListSelect = createSelectSchema(List);
export const zListInsert = createInsertSchema(List);
export type ListSelect = z.infer<typeof zListSelect>;
export type ListInsert = z.infer<typeof zListInsert>;

export const zCategorySelect = createSelectSchema(Category);
export const zCategoryInsert = createInsertSchema(Category);
export type CategorySelect = z.infer<typeof zCategorySelect>;
export type CategoryInsert = z.infer<typeof zCategoryInsert>;

export const zCategoryItemSelect = createSelectSchema(CategoryItem);
export const zCategoryItemInsert = createInsertSchema(CategoryItem);
export type CategoryItemSelect = z.infer<typeof zCategoryItemSelect>;
export type CategoryItemInsert = z.infer<typeof zCategoryItemInsert>;

export const zAppFeedbackSelect = createSelectSchema(AppFeedback);
export const zAppFeedbackInsert = createInsertSchema(AppFeedback);
export type AppFeedbackSelect = z.infer<typeof zAppFeedbackSelect>;
export type AppFeedbackInsert = z.infer<typeof zAppFeedbackInsert>;

export const zExpandedCategoryItem = zCategoryItemSelect.extend({
  itemData: zItemSelect,
});
export type ExpandedCategoryItem = z.infer<typeof zExpandedCategoryItem>;

export const zExpandedCategory = zCategorySelect.extend({
  items: z.array(zExpandedCategoryItem),
  packed: z.boolean(),
});
export type ExpandedCategory = z.infer<typeof zExpandedCategory>;

export const zExpandedList = zListSelect.extend({
  categories: z.array(zExpandedCategory),
});
export type ExpandedList = z.infer<typeof zExpandedList>;

export type UserFileUpload = {
  type: string;
  dataUrl: string;
  file: File;
  name: string;
  size: number;
};
