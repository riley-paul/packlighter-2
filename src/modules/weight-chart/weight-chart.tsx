import { ResponsivePie, type PieTooltipProps } from "@nivo/pie";
import { Strong, Text } from "@radix-ui/themes";
import React from "react";
import type { ChartData, ChartDataNested } from "./weight-chart.types";
import { formatWeight } from "@/lib/client/utils";
import { useAtom } from "jotai";
import {
  activeCategoryIdAtom,
  selectedCategoryIdAtom,
} from "./weight-chart.store";

const ACTIVE_OUTER_RADIUS_OFFSET = 4;
const CORNER_RADIUS = 3;
const BORDER_WIDTH = 1;

type Props = {
  list: ChartDataNested[];
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

const WeightChart: React.FC<Props> = ({ list }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useAtom(selectedCategoryIdAtom);
  const [activeId, setActiveId] = useAtom(activeCategoryIdAtom);

  const selectedCategory = list.find((c) => c.id === selectedId);

  return (
    <div
      ref={containerRef}
      className="relative size-48 rounded-full"
      onClick={() => {
        setSelectedId(null);
      }}
    >
      <div id="category-container" className="absolute inset-0">
        <ResponsivePie
          data={selectedCategory ? selectedCategory.children : []}
          onClick={(_, e) => {
            e.stopPropagation();
          }}
          margin={generateMargin(10)}
          innerRadius={0.75}
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
      <div id="list-container" className="absolute inset-0">
        <ResponsivePie
          data={list}
          onClick={({ id }, e) => {
            setSelectedId(id as string);
            e.stopPropagation();
          }}
          activeId={activeId}
          onActiveIdChange={setActiveId}
          margin={selectedCategory ? generateMargin(40) : generateMargin(10)}
          innerRadius={0.5}
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
