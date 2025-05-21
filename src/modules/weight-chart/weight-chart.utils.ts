import type {
  ExpandedCategory,
  ExpandedCategoryItem,
  ExpandedList,
  WeightType,
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
  weightType?: WeightType,
) => {
  if (weightType && item.weightType !== weightType) return 0;
  return (
    WeightConvertible.convert(
      item.itemData.weight,
      item.itemData.weightUnit,
      weightUnit,
    ) * item.quantity
  );
};

export const getCategoryWeight = (
  category: ExpandedCategory,
  weightUnit: WeightUnit,
  weightType?: WeightType,
) =>
  category.items.reduce(
    (acc, val) => acc + getItemWeight(val, weightUnit, weightType),
    0,
  );

export const getListWeight = (
  list: ExpandedList,
  weightUnit: WeightUnit,
  weightType?: WeightType,
) =>
  list.categories.reduce(
    (acc, val) => acc + getCategoryWeight(val, weightUnit, weightType),
    0,
  );

export const getListColorMap = (list: ExpandedList) => {
  const colorPalette = chroma.scale("Spectral").colors(list.categories.length);
  const colorMap = new Map<string, string>();

  list.categories.forEach((category, index1) => {
    colorMap.set(category.id, colorPalette[index1]);
    const colorScale = getMonochromaticScale(
      colorPalette[index1],
      category.items.length,
    );
    [...category.items]
      .sort((a, b) => {
        const aWeight = getItemWeight(a, list.weightUnit);
        const bWeight = getItemWeight(b, list.weightUnit);
        return aWeight - bWeight;
      })
      .forEach((item, index2) => {
        colorMap.set(item.id, colorScale[index2]);
      });
  });
  return colorMap;
};
