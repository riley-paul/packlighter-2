import { WeightConvertible } from "@/lib/convertible";
import type { ExpandedList } from "@/lib/types";
import { ResponsivePie } from "@nivo/pie";
import React from "react";
import { useOnClickOutside } from "usehooks-ts";

const ACTIVE_OUTER_RADIUS_OFFSET = 4;
const CORNER_RADIUS = 3;
const BORDER_WIDTH = 1;

type Data = {
  id: string;
  label: string;
  value: number;
}

type Props = {
  list: ExpandedList;
};

const getCategoryData = (
  list: ExpandedList,
  activeCategoryId: string | null,
): Data[] => {
  const category = list.categories.find((c) => c.id === activeCategoryId);
  if (!category) return [];

  return category.items.map((item) => ({
    id: item.id,
    label: item.itemData.name,
    value: WeightConvertible.convert(
      item.itemData.weight,
      item.itemData.weightUnit,
      list.weightUnit,
    ),
  }));
};

const getListData = (list: ExpandedList): Data[] => {
  return list.categories.map((category) => ({
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
  }));
};

const generateMargin = (width: number) => ({
  top: width,
  left: width,
  right: width,
  bottom: width,
});

const WeightChart: React.FC<Props> = ({ list }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [activeCategoryId, setActiveCategoryId] = React.useState<string | null>(
    null,
  );

  return (
    <div
      ref={containerRef}
      className="relative size-48"
      onClick={() => {
        setActiveCategoryId(null);
      }}
    >
      <div id="category-container" className="absolute inset-0">
        <ResponsivePie
          data={getCategoryData(list, activeCategoryId)}
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
          tooltip={({ datum }) => (
            <div
              style={{
                background: "white",
                padding: "8px 12px",
                color: "black",
                borderRadius: "4px",
                boxShadow: "0 0 6px rgba(0,0,0,0.15)",
              }}
            >
              <strong>{datum.label}</strong>: {datum.value}
            </div>
          )}
        />
      </div>
      <div id="list-container" className="absolute inset-0">
        <ResponsivePie
          data={getListData(list)}
          onClick={({ id }, e) => {
            setActiveCategoryId(id as string);
            e.stopPropagation();
          }}
          margin={activeCategoryId ? generateMargin(40) : generateMargin(10)}
          innerRadius={0.5}
          padAngle={activeCategoryId ? 1.5 : 1}
          cornerRadius={CORNER_RADIUS}
          activeOuterRadiusOffset={ACTIVE_OUTER_RADIUS_OFFSET}
          borderWidth={BORDER_WIDTH}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          enableArcLabels={false}
          enableArcLinkLabels={false}
        />
      </div>
    </div>
  );
};

export default WeightChart;
