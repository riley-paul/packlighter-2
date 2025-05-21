import { ResponsivePie, type PieTooltipProps } from "@nivo/pie";
import { Strong, Text } from "@radix-ui/themes";
import React from "react";
import { cn, formatWeight } from "@/lib/client/utils";
import { useAtom } from "jotai";
import {
  activeCategoryIdAtom,
  selectedCategoryIdAtom,
} from "./weight-chart.store";
import invariant from "tiny-invariant";
import type { ExpandedList } from "@/lib/types";
import { getCategoryWeight, getItemWeight } from "./weight-chart.utils";

const ACTIVE_OUTER_RADIUS_OFFSET = 4;
const CORNER_RADIUS = 3;
const BORDER_WIDTH = 1;
const OUTER_RADIUS = 120;
const RADIUS_RATIO = 0.75;
const INNER_RADIUS = OUTER_RADIUS * RADIUS_RATIO;
const BASE_MARGIN = 10;

export type ChartData = {
  id: string;
  label: string;
  value: number;
  unit: string;
  color: string | undefined;
};

const generateMargin = (width: number) => ({
  top: width,
  left: width,
  right: width,
  bottom: width,
});

const ChartTooltip: React.FC<PieTooltipProps<ChartData>> = ({ datum }) => {
  return (
    <div className="flex items-center gap-2 rounded-2 bg-gray-2 px-2 py-1 shadow-2">
      <div
        className="size-3 rounded-full"
        style={{ backgroundColor: datum.color }}
      />
      <Text size="1">
        <Strong>{datum.label}</Strong>: {formatWeight(datum.value)}{" "}
        {datum.data.unit}
      </Text>
    </div>
  );
};

type Props = {
  list: ExpandedList;
  listColorMap: Map<string, string>;
};

const WeightChart: React.FC<Props> = ({ list, listColorMap }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [selectedId, setSelectedId] = useAtom(selectedCategoryIdAtom);
  const [activeId, setActiveId] = useAtom(activeCategoryIdAtom);

  const [withinInnerRadius, setWithinInnerRadius] = React.useState(false);

  const selectedCategory = list.categories.find((c) => c.id === selectedId);

  return (
    <div
      ref={containerRef}
      className="relative shrink-0 rounded-full"
      style={{
        width: OUTER_RADIUS * 2,
        height: OUTER_RADIUS * 2,
      }}
      onClick={() => {
        setSelectedId(null);
      }}
      onMouseMove={(e) => {
        if (!selectedId) return;

        const container = containerRef.current;
        invariant(container);

        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        setWithinInnerRadius(distance < INNER_RADIUS - BASE_MARGIN);
      }}
    >
      <div id="category-container" className="absolute inset-0 rounded-full">
        <ResponsivePie
          data={
            selectedCategory
              ? [...selectedCategory.items]
                  .sort((a, b) => {
                    const aWeight = getItemWeight(a, list.weightUnit);
                    const bWeight = getItemWeight(b, list.weightUnit);
                    return bWeight - aWeight;
                  })
                  .map(
                    (i): ChartData => ({
                      id: i.id,
                      label: i.itemData.name,
                      value: getItemWeight(i, list.weightUnit),
                      unit: i.itemData.weightUnit,
                      color: listColorMap.get(i.id),
                    }),
                  )
                  .filter((i) => i.value > 0)
              : []
          }
          onClick={(data, e) => {
            console.log("data", data);
            e.stopPropagation();
          }}
          margin={generateMargin(BASE_MARGIN)}
          innerRadius={RADIUS_RATIO}
          padAngle={1}
          cornerRadius={CORNER_RADIUS}
          activeOuterRadiusOffset={ACTIVE_OUTER_RADIUS_OFFSET}
          borderWidth={BORDER_WIDTH}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          enableArcLabels={false}
          enableArcLinkLabels={false}
          tooltip={ChartTooltip}
          colors={{ datum: "data.color" }}
        />
      </div>
      <div
        id="list-container"
        className={cn(
          "absolute inset-0 rounded-full",
          !withinInnerRadius && selectedId && "pointer-events-none",
        )}
      >
        <ResponsivePie
          data={list.categories
            .map(
              (c): ChartData => ({
                id: c.id,
                label: c.name,
                value: getCategoryWeight(c, list.weightUnit),
                unit: list.weightUnit,
                color: listColorMap.get(c.id),
              }),
            )
            .filter((i) => i.value > 0)}
          onClick={({ id, arc }, e) => {
            console.log("arc", arc);
            setSelectedId(id as string);
            e.stopPropagation();
          }}
          activeId={activeId}
          onActiveIdChange={setActiveId}
          margin={
            selectedCategory
              ? generateMargin(BASE_MARGIN + (OUTER_RADIUS - INNER_RADIUS) + 4)
              : generateMargin(BASE_MARGIN)
          }
          innerRadius={0.6}
          padAngle={selectedCategory ? 1.5 : 1}
          cornerRadius={CORNER_RADIUS}
          activeOuterRadiusOffset={ACTIVE_OUTER_RADIUS_OFFSET}
          borderWidth={BORDER_WIDTH}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          enableArcLabels={false}
          enableArcLinkLabels={false}
          tooltip={ChartTooltip}
          colors={{ datum: "data.color" }}
        />
      </div>
    </div>
  );
};

export default WeightChart;
