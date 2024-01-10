import { ChartDataset, ScriptableTooltipContext } from 'chart.js';

import { Version } from 'api';
import { locales } from 'shared/consts';
import { ItemResponseType } from 'shared/consts';

import { Answer, ItemResponseValues } from '../../Report.types';

export type ExtendedChartDataset = ChartDataset & {
  labels: string[];
};

export type MultiScatterChartProps = {
  color: string;
  minDate: Date;
  maxDate: Date;
  minY: number;
  maxY: number;
  height: number;
  responseValues: ItemResponseValues;
  responseType: ItemResponseType;
  answers: Answer[];
  versions: Version[];
  'data-testid'?: string;
};

export type OptionsProps = {
  lang: keyof typeof locales;
  responseValues: ItemResponseValues;
  responseType: ItemResponseType;
  minY: number;
  maxY: number;
  minDate: Date;
  maxDate: Date;
  tooltipHandler: (context: ScriptableTooltipContext<'scatter'>) => void;
};

export type DataProps = {
  maxY: number;
  answers: Answer[];
  versions: Version[];
  color: string;
};
