import type { ExpandedList } from "@/lib/types";
import { Card } from "@radix-ui/themes";
import React from "react";

type Props = {
  list: ExpandedList;
};

const WeightChart: React.FC<Props> = ({ list }) => {
  if (!list.showWeights) return null;

  return <Card>weight card</Card>;
};

export default WeightChart;
