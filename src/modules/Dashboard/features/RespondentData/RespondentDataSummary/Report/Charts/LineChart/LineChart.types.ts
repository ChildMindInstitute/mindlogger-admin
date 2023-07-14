import { Chart, ChartDataset, ChartTypeRegistry, LegendElement } from 'chart.js';

import { Version } from 'api';

export type ActivityCompletion = {
  date: Date;
  score: number;
};

export type Subscale = {
  name: string;
  activityCompletions: ActivityCompletion[];
};

export type SubscaleChartData = {
  subscales: Subscale[];
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
  versions: Version[];
};
