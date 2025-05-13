import type { ExpandedList } from "@/lib/types";
import React from "react";
import WeightChart from "./weight-chart";
import WeightTable from "./weight-table";
import { parseListToChartData } from "./weight-chart.utils";

type Props = {
  list: ExpandedList;
};

const WeightPanel: React.FC<Props> = ({ list }) => {
  const parsedList = parseListToChartData(list);

  if (!list.showWeights) return null;
  return (
    <div className="flex w-full items-center justify-center gap-8">
      <WeightChart list={parsedList} />
      <WeightTable list={parsedList} />
    </div>
  );
};

export default WeightPanel;
