import {
  zCategoryItemSelect,
  zCategorySelect,
  zItemSelect,
  type ExpandedCategory,
  type ExpandedCategoryItem,
  type ItemSelect,
} from "@/db/schema";
import { v4 as uuid } from "uuid";
import { z } from "zod";

const MOCK_USER_ID = "mock-user-id";
const currentTime = () => new Date().toISOString();

const zItemInit = zItemSelect.extend({
  id: zItemSelect.shape.id.default(uuid),
  userId: zItemSelect.shape.userId.default(MOCK_USER_ID),
  name: zItemSelect.shape.name.default(""),
  description: zItemSelect.shape.description.default(""),
  weight: zItemSelect.shape.weight.default(0),
  weightUnit: zItemSelect.shape.weightUnit.default("g"),
  image: zItemSelect.shape.image.default(""),
  createdAt: zItemSelect.shape.createdAt.default(currentTime),
  updatedAt: zItemSelect.shape.updatedAt.default(currentTime),
});

export const initItem = (data: Partial<ItemSelect> = {}): ItemSelect =>
  zItemInit.parse(data);

const zCategoryItemInit = zCategoryItemSelect.extend({
  id: zCategoryItemSelect.shape.id.default(uuid),
  userId: zCategoryItemSelect.shape.userId.default(MOCK_USER_ID),
  categoryId: zCategoryItemSelect.shape.categoryId.default(uuid),
  itemData: zItemInit,
  quantity: zCategoryItemSelect.shape.quantity.default(1),
  sortOrder: zCategoryItemSelect.shape.sortOrder.default(1),
  itemId: zCategoryItemSelect.shape.itemId.default(uuid),
  packed: zCategoryItemSelect.shape.packed.default(false),
  wornWeight: zCategoryItemSelect.shape.wornWeight.default(false),
  consWeight: zCategoryItemSelect.shape.consWeight.default(false),
  createdAt: zCategoryItemSelect.shape.createdAt.default(currentTime),
  updatedAt: zCategoryItemSelect.shape.updatedAt.default(currentTime),
});

export const initCategoryItem = (
  data: Partial<ExpandedCategoryItem> = {},
): ExpandedCategoryItem => zCategoryItemInit.parse(data);

const zCategoryInit = zCategorySelect.extend({
  id: zCategorySelect.shape.id.default(uuid),
  userId: zCategorySelect.shape.userId.default(MOCK_USER_ID),
  name: zCategorySelect.shape.name.default(""),
  sortOrder: zCategorySelect.shape.sortOrder.default(1),
  items: z.array(zCategoryItemInit).default([]),
  createdAt: zCategorySelect.shape.createdAt.default(currentTime),
  updatedAt: zCategorySelect.shape.updatedAt.default(currentTime),
  listId: zCategorySelect.shape.listId.default(uuid),
  packed: z.boolean().default(false),
});

export const initCategory = (
  data: Partial<ExpandedCategory> = {},
): ExpandedCategory => zCategoryInit.parse(data);
