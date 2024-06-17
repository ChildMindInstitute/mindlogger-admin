import { ReactNode } from 'react';

import { ConditionType } from 'shared/consts';

import {
  ConditionItem,
  ConditionProps,
  NumberSelectionConditionItem,
  ScoreConditionItem,
  SliderConditionItem,
  SliderRowsConditionItem,
} from '../Condition.types';

export type SwitchConditionProps = {
  selectedItem?: ConditionItem;
  dataTestid: ConditionProps['data-testid'];
  children: ReactNode;
} & Pick<ConditionProps, 'payloadName' | 'state' | 'valueOptions'>;

export type GetConditionMinMaxRangeValuesProps = {
  item?:
    | SliderConditionItem
    | NumberSelectionConditionItem
    | SliderRowsConditionItem
    | ScoreConditionItem;
  minValue: number;
  maxValue: number;
  rowIndex?: string;
};

export type GetConditionMinMaxValuesProps = {
  item?:
    | SliderConditionItem
    | NumberSelectionConditionItem
    | SliderRowsConditionItem
    | ScoreConditionItem;
  state: ConditionType;
  rowIndex?: string;
};
