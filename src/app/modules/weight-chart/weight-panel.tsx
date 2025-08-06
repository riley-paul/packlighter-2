import type { ExpandedList } from "@/lib/types";
import React from "react";
import WeightChart from "./weight-chart";
import WeightTable from "./weight-table";
import { getListColorMap } from "./weight-chart.utils";

type Props = {
  list: ExpandedList;
};

const WeightPanel: React.FC<Props> = ({ list }) => {
  const colorMap = getListColorMap(list);
  if (!list.showWeights || list.categories.length === 0) return null;
  return (
    <div className="flex w-full items-center justify-center gap-8">
      <WeightChart list={list} listColorMap={colorMap} />
      <WeightTable list={list} listColorMap={colorMap} />
    </div>
  );
};

export default WeightPanel;
