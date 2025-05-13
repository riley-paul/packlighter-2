import type { ExpandedList } from "@/lib/types";
import React from "react";

type Props = {
  list: ExpandedList;
};

const WeightChart: React.FC<Props> = ({ list }) => {
  return <div className="size-40 rounded-full bg-red-8" />;
};

export default WeightChart;
