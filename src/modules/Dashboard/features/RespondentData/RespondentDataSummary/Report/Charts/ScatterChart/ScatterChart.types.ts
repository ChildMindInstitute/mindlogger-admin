import { ChartDataset } from 'chart.js';

import { Version } from 'api';
import { ActivityResponse } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Report.types';

export type ScatterChartProps = {
  height?: string;
  minDate: Date;
  maxDate: Date;
  answers: ActivityResponse[];
  versions: Version[];
};

export type ExtendedChartDataset = ChartDataset & {
  labels: string[];
};
