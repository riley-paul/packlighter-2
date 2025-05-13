import type { ExpandedList } from "@/lib/types";
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
  const colorPalette = chroma.scale("Viridis").colors(list.categories.length);
  return list.categories.map((category, index1) => ({
    id: category.id,
    label: category.name,
    value: category.items.reduce(
      (acc, val) =>
        acc +
        WeightConvertible.convert(
          val.itemData.weight,
          val.itemData.weightUnit,
          list.weightUnit,
        ),
      0,
    ),
    color: colorPalette[index1],
    children: category.items.map((item, index2) => {
      const colorScale = getMonochromaticScale(
        colorPalette[index1],
        category.items.length,
      );
      return {
        id: item.id,
        label: item.itemData.name,
        value: WeightConvertible.convert(
          item.itemData.weight,
          item.itemData.weightUnit,
          list.weightUnit,
        ),
        color: colorScale[index2],
      };
    }),
  }));
};
