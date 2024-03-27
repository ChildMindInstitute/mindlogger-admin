import { ChartDataset, ScriptableTooltipContext } from 'chart.js';

import { Version } from 'api';
import { locales } from 'shared/consts';
import { ItemResponseType } from 'shared/consts';
import {
  Answer,
  ItemOption,
  SimpleAnswerValue,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';

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
  options: ItemOption[];
  responseType: ItemResponseType;
  answers: Answer<SimpleAnswerValue>[];
  versions: Version[];
  'data-testid'?: string;
};

export type OptionsProps = {
  lang: keyof typeof locales;
  options: ItemOption[];
  responseType: ItemResponseType;
  minY: number;
  maxY: number;
  minDate: Date;
  maxDate: Date;
  tooltipHandler: (context: ScriptableTooltipContext<'scatter'>) => void;
};

export type DataProps = {
  maxY: number;
  answers: Answer<SimpleAnswerValue>[];
  versions: Version[];
  color: string;
};
