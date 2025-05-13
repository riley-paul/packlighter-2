import type { ExpandedList } from "@/lib/types";
import React from "react";
import WeightChart from "./weight-chart";
import WeightTable from "./weight-table";

type Props = {
  list: ExpandedList;
};

const WeightPanel: React.FC<Props> = ({ list }) => {
  if (!list.showWeights) return null;
  return (
    <div className="flex w-full items-center justify-center gap-8">
      <WeightChart list={list} />
      <WeightTable list={list} />
    </div>
  );
};

export default WeightPanel;
