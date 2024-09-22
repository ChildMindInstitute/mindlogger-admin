import { Chart, ChartType, TooltipItem } from 'chart.js';

import { Version } from 'api';
import { TScoreSeverity } from 'modules/Builder/features/ActivitySettings/SubscalesConfiguration/LookupTable';

export type ActivityCompletion = {
  date: Date;
  score: number;
  optionText?: string;
  severity?: TScoreSeverity | null;
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
  severity: TScoreSeverity | null;
};

export type SubscaleLineDataPointRaw = {
  x: Date;
  y: number;
  optionText: string;
  severity: TScoreSeverity | null;
};

export type TooltipItemWithRawData<TType extends ChartType, RawDataType> = Omit<
  TooltipItem<TType>,
  'raw'
> & {
  raw: RawDataType;
};
