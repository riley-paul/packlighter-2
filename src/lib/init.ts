import type {
  ExpandedCategory,
  ExpandedCategoryItem,
  ItemSelect,
} from "@/db/schema";
import { v4 as uuid } from "uuid";

const MOCK_USER_ID = "mock-user-id";
const currentTime = () => new Date().toISOString();

export const initItem = (data?: Partial<ItemSelect>): ItemSelect => ({
  id: uuid(),
  userId: MOCK_USER_ID,
  name: "",
  description: "",
  weight: 0,
  createdAt: currentTime(),
  updatedAt: currentTime(),
  weightUnit: "g",
  image: "",
  ...data,
});

export const initCategoryItem = (
  data?: Partial<ExpandedCategoryItem>,
): ExpandedCategoryItem => ({
  id: uuid(),
  userId: MOCK_USER_ID,
  categoryId: uuid(),
  itemData: initItem(),
  createdAt: currentTime(),
  updatedAt: currentTime(),
  quantity: 1,
  sortOrder: 1,
  itemId: uuid(),
  packed: false,
  wornWeight: false,
  consumableWeight: false,
  ...data,
});

export const initCategory = (
  data?: Partial<ExpandedCategory>,
): ExpandedCategory => ({
  id: uuid(),
  userId: MOCK_USER_ID,
  name: "",
  sortOrder: 1,
  items: [],
  createdAt: currentTime(),
  updatedAt: currentTime(),
  listId: uuid(),
  packed: false,
  ...data,
});
