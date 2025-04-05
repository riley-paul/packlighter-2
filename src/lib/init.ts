import {
  type ExpandedCategory,
  type ExpandedCategoryItem,
  type ItemSelect,
} from "@/lib/types";
import { v4 as uuid } from "uuid";

const MOCK_USER_ID = "mock-user-id";
const currentTime = () => new Date().toISOString();

export const initItem = (data: Partial<ItemSelect> = {}): ItemSelect => ({
  ...data,
  id: data.id ?? uuid(),
  userId: data.userId ?? MOCK_USER_ID,
  name: data.name ?? "",
  description: data.description ?? "",
  weight: data.weight ?? 0,
  weightUnit: data.weightUnit ?? "g",
  image: data.image ?? null,
  createdAt: data.createdAt ?? currentTime(),
  updatedAt: data.updatedAt ?? currentTime(),
});

export const initCategoryItem = (
  data: Partial<ExpandedCategoryItem> = {},
): ExpandedCategoryItem => ({
  ...data,
  id: data.id ?? uuid(),
  userId: data.userId ?? MOCK_USER_ID,
  categoryId: data.categoryId ?? uuid(),
  itemData: initItem(data.itemData),
  quantity: data.quantity ?? 1,
  sortOrder: data.sortOrder ?? 1,
  itemId: data.itemId ?? uuid(),
  packed: data.packed ?? false,
  wornWeight: data.wornWeight ?? false,
  consWeight: data.consWeight ?? false,
  createdAt: data.createdAt ?? currentTime(),
  updatedAt: data.updatedAt ?? currentTime(),
});

export const initCategory = (
  data: Partial<ExpandedCategory> = {},
): ExpandedCategory => ({
  ...data,
  id: data.id ?? uuid(),
  userId: data.userId ?? MOCK_USER_ID,
  name: data.name ?? "",
  sortOrder: data.sortOrder ?? 1,
  items: data.items?.map((item) => initCategoryItem(item)) ?? [],
  createdAt: data.createdAt ?? currentTime(),
  updatedAt: data.updatedAt ?? currentTime(),
  listId: data.listId ?? uuid(),
  packed: data.packed ?? false,
});
