import { Chart, ChartDataset, ChartTypeRegistry, LegendElement } from 'chart.js';

export type ActivityCompletion = {
  date: Date;
  score: number;
};

export type Subscale = {
  name: string;
  activityCompletions: ActivityCompletion[];
};

export type Version = {
  date: Date;
  version: string;
};

export type SubscaleChartData = {
  subscales: Subscale[];
  versions: Version[];
};

export type CustomLegend = LegendElement<keyof ChartTypeRegistry> & {
  fit: () => void;
};

export type ExtendedChartDataset = ChartDataset & {
  labels: string[];
};

export type Tick = { index: number; chart: Chart };

export type LineChartProps = {
  data: SubscaleChartData;
};
