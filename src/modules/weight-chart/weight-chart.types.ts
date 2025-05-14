export type ChartData = {
  id: string;
  label: string;
  value: number;
  unit: string;
  color: string;
};

export type ChartDataNested = ChartData & {
  children: ChartData[];
};
