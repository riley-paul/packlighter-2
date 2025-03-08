import { User, Item, List, CategoryItem, Category } from "@/db/schema";

export type ItemSelect = typeof Item.$inferSelect;
export type ListSelect = typeof List.$inferSelect;
export type UserSelect = typeof User.$inferSelect;

export type ExpandedCategoryItem = typeof CategoryItem.$inferSelect & {
  itemData: typeof Item.$inferSelect;
};

export type ExpandedCategory = typeof Category.$inferSelect & {
  items: ExpandedCategoryItem[];
  packed: boolean;
};

export type ExpandedList = typeof List.$inferSelect & {
  categories: ExpandedCategory[];
};

export type AllTables =
  | typeof List
  | typeof Item
  | typeof Category
  | typeof CategoryItem;
