export type ChartData = {
  id: string;
  label: string;
  value: number;
  color: string;
};

export type ChartDataNested = ChartData & {
  children: ChartData[];
};
