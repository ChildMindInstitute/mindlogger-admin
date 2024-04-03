import { ChartDataset } from 'chart.js';

import { Version } from 'api';
import { ActivityCompletion } from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export type ScatterChartProps = {
  height?: string;
  minDate: Date;
  maxDate: Date;
  answers: ActivityCompletion[];
  versions: Version[];
};

export type ExtendedChartDataset = ChartDataset & {
  labels: string[];
};
