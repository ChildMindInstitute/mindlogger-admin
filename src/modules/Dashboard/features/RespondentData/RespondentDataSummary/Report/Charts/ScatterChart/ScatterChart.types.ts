import { ChartDataset } from 'chart.js';

import { Version } from 'api';

import { Completion } from '../../Report.types';

export type ScatterChartProps = {
  height?: string;
  minDate: Date;
  maxDate: Date;
  completions: Completion[];
  versions: Version[];
  'data-testid'?: string;
};

export type ExtendedChartDataset = ChartDataset & {
  labels: string[];
};
