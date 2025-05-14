import type {
  ExpandedCategory,
  ExpandedCategoryItem,
  ExpandedList,
} from "@/lib/types";
import type { ChartDataNested } from "./weight-chart.types";
import { WeightConvertible } from "@/lib/convertible";
import chroma from "chroma-js";

function getMonochromaticScale(baseColor: string, steps = 5) {
  return chroma
    .scale([
      chroma(baseColor).brighten(1.5),
      baseColor,
      chroma(baseColor).darken(2),
    ])
    .mode("lab")
    .colors(steps);
}

export const parseListToChartData = (list: ExpandedList): ChartDataNested[] => {
  const colorPalette = chroma.scale("Spectral").colors(list.categories.length);

  const getItemWeight = (item: ExpandedCategoryItem) =>
    WeightConvertible.convert(
      item.itemData.weight,
      item.itemData.weightUnit,
      list.weightUnit,
    );

  const getCategoryWeight = (category: ExpandedCategory) =>
    category.items.reduce((acc, val) => acc + getItemWeight(val), 0);

  return list.categories.map((category, index1) => ({
    id: category.id,
    label: category.name,
    value: getCategoryWeight(category),
    unit: list.weightUnit,
    color: colorPalette[index1],
    children: category.items
      .sort((a, b) => getItemWeight(a) - getItemWeight(b))
      .map((item, index2) => {
        const colorScale = getMonochromaticScale(
          colorPalette[index1],
          category.items.length,
        );
        return {
          id: item.id,
          label: item.itemData.name,
          value: getItemWeight(item),
          unit: list.weightUnit,
          color: colorScale[index2],
        };
      }),
  }));
};
