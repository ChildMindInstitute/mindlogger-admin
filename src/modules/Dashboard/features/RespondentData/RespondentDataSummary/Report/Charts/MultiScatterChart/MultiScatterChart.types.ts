import { ChartDataset } from 'chart.js';

import { locales } from 'shared/consts';
import { ItemResponseType } from 'shared/consts';

import { FormattedItemAnswer, Version } from '../../Report.types';
import { MultiScatterResponseValues } from '../../ResponseOptions/ResponseOptions.types';

export type ExtendedChartDataset = ChartDataset & {
  labels: string[];
};

export type MultiScatterChartProps = {
  minDate: string | Date;
  maxDate: string | Date;
  minY?: number;
  maxY: number;
  height: number;
  responseValues: MultiScatterResponseValues;
  responseType: ItemResponseType;
  answers: FormattedItemAnswer[];
  versions: Version[];
};

export type OptionsProps = {
  lang: keyof typeof locales;
  responseValues: MultiScatterResponseValues;
  responseType: ItemResponseType;
  minY: number;
  maxY: number;
  minDate: string | Date;
  maxDate: string | Date;
};

export type DataProps = {
  maxY: number;
  responseValues: MultiScatterResponseValues;
  responseType: ItemResponseType;
  answers: FormattedItemAnswer[];
  versions: Version[];
};
