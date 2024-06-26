import { CartesianScaleTypeRegistry, ChartDataset, ScriptableTooltipContext } from 'chart.js';

import { Version } from 'api';
import { locales } from 'shared/consts';
import { ItemResponseType } from 'shared/consts';
import {
  ItemOption,
  NumberSelectionAnswer,
  SingleMultiSelectionSliderAnswer,
  TextAnswer,
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
  answers: (SingleMultiSelectionSliderAnswer | NumberSelectionAnswer | TextAnswer)[];
  versions: Version[];
  useCategory?: boolean;
  'data-testid'?: string;
  isStaticActive?: boolean;
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
  useCategory: boolean;
};

export type DataProps = {
  maxY: number;
  answers: (SingleMultiSelectionSliderAnswer | NumberSelectionAnswer | TextAnswer)[];
  versions: Version[];
  color: string;
  useCategory: boolean;
};

export type ScalesType = keyof CartesianScaleTypeRegistry;
