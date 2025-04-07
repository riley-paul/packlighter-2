import type { weightUnits } from "@/db/schema";
import type { Unit } from "../types";

export const NAVBAR_HEIGHT = "4rem";

export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;

export const DND_TYPE_KEY = "__entityType";
export enum DndEntityType {
  Category = "category",
  CategoryPlaceholder = "category-placeholder",
  CategoryItem = "category-item",
  Item = "item",
  List = "list",
}

export const isDndEntityType = (
  data: Record<string, unknown>,
  type: DndEntityType,
): boolean => {
  return data[DND_TYPE_KEY] === type;
};

export const ACCENT_COLOR = "green" as const;

export type WeightUnit = (typeof weightUnits)[number];
export const weightUnitsInfo: Unit[] = [
  { symbol: "g", multiplier: 1, name: "grams" },
  { symbol: "kg", multiplier: 1000, name: "kilograms" },
  { symbol: "oz", multiplier: 28.3495, name: "ounces" },
  { symbol: "lb", multiplier: 453.592, name: "pounds" },
];
