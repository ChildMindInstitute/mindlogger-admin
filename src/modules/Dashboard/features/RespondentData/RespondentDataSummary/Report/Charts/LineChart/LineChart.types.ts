import { Chart, ChartDataset, ChartTypeRegistry, LegendElement } from 'chart.js';

import { Version } from 'api';

export type ActivityCompletion = {
  date: Date;
  score: number;
  optionText?: string;
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

export type TooltipData = {
  date: Date;
  backgroundColor: string;
  label: string;
  value: number;
  optionText: string;
};

export type DataPointRaw = {
  x: Date;
  y: number;
  optionText: string;
};
