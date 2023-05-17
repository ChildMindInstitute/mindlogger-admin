import { ChartDataset } from 'chart.js';

import { ItemAnswer, Version } from '../../Report.types';
import { MultiScatterResponseValues } from '../../ResponseOptions/ResponseOptions.types';

export type ExtendedChartDataset = ChartDataset & {
  labels: string[];
};

export type MultiScatterChartProps = {
  minDate: string | Date;
  maxDate: string | Date;
  responseValues: MultiScatterResponseValues;
  answers: ItemAnswer[];
  versions: Version[];
};
