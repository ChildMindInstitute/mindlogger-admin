import { ChartTypeRegistry, LegendElement } from 'chart.js';

export type CustomLegend = LegendElement<keyof ChartTypeRegistry> & {
  fit: () => void;
};

export type ChartData = {
  label: string;
  score: number;
};

export type BarChartProps = {
  chartData: ChartData[];
};
