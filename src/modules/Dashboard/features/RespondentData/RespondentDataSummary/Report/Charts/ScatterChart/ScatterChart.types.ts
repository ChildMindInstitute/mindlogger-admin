import { ChartDataset } from 'chart.js';

import { Response, Version } from '../../Report.types';

export type ScatterChartProps = {
  height?: string;
  minDate: string | Date;
  maxDate: string | Date;
  responses: Response[];
  versions: Version[];
};

export type ExtendedChartDataset = ChartDataset & {
  labels: string[];
};
