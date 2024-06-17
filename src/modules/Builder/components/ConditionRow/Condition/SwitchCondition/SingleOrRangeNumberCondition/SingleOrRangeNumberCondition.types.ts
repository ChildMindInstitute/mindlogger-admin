import { ReactNode } from 'react';

import { ConditionType } from 'shared/consts';

import {
  ConditionProps,
  NumberSelectionConditionItem,
  ScoreConditionItem,
  SliderConditionItem,
  SliderRowsConditionItem,
} from '../../Condition.types';

export type SingleOrRangeNumberConditionProps = {
  children: ReactNode;
  selectedItem:
    | SliderConditionItem
    | NumberSelectionConditionItem
    | SliderRowsConditionItem
    | ScoreConditionItem;
  numberValueName: string;
  minValueName: string;
  maxValueName: string;
  state: ConditionType;
  minValue: number;
  maxValue: number;
  isSingleValueShown: boolean;
  isRangeValueShown: boolean;
  dataTestid: ConditionProps['data-testid'];
};

export type GetConditionMinMaxRangeValuesProps = {
  item?: SingleOrRangeNumberConditionProps['selectedItem'];
  minValue: number;
  maxValue: number;
  rowIndex?: string;
};

export type GetConditionMinMaxValuesProps = {
  item?: SingleOrRangeNumberConditionProps['selectedItem'];
  state: ConditionType;
  rowIndex?: string;
};
