import { Chart } from 'chart.js';

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

export type Tick = { index: number; chart: Chart };

export type SubscaleLineChartProps = {
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

export type SubscaleLineDataPointRaw = {
  x: Date;
  y: number;
  optionText: string;
};
