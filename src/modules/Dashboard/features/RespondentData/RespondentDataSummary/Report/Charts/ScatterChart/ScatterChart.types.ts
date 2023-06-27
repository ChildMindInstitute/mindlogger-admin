import { ChartDataset } from 'chart.js';

import { DatavizAnswer, Version } from 'api';

export type ScatterChartProps = {
  height?: string;
  minDate: Date;
  maxDate: Date;
  answers: DatavizAnswer[];
  versions: Version[];
};

export type ExtendedChartDataset = ChartDataset & {
  labels: string[];
};
