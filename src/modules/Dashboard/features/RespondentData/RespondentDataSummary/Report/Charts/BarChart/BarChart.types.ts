export type ChartData = {
  label: string;
  score: number;
};

export type BarChartProps = {
  chartData: ChartData[];
};

export type TooltipData = {
  backgroundColor: string;
  label: string;
  value: number;
};
