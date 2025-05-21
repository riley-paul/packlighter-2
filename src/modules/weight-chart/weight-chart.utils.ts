import type {
  ExpandedCategory,
  ExpandedCategoryItem,
  ExpandedList,
  WeightUnit,
} from "@/lib/types";
import { WeightConvertible } from "@/lib/convertible";
import chroma from "chroma-js";

const getMonochromaticScale = (baseColor: string, steps = 5) => {
  return chroma
    .scale([
      chroma(baseColor).brighten(1.5),
      baseColor,
      chroma(baseColor).darken(2),
    ])
    .mode("lab")
    .colors(steps);
};

export const getItemWeight = (
  item: ExpandedCategoryItem,
  weightUnit: WeightUnit,
) =>
  WeightConvertible.convert(
    item.itemData.weight,
    item.itemData.weightUnit,
    weightUnit,
  ) * item.quantity;

export const getCategoryWeight = (
  category: ExpandedCategory,
  weightUnit: WeightUnit,
) =>
  category.items.reduce((acc, val) => acc + getItemWeight(val, weightUnit), 0);

export const getListColorMap = (list: ExpandedList) => {
  const colorPalette = chroma.scale("Spectral").colors(list.categories.length);
  const colorMap = new Map<string, string>();

  list.categories.forEach((category, index1) => {
    colorMap.set(category.id, colorPalette[index1]);
    const colorScale = getMonochromaticScale(
      colorPalette[index1],
      category.items.length,
    );
    category.items.forEach((item, index2) => {
      colorMap.set(item.id, colorScale[index2]);
    });
  });
  return colorMap;
};
