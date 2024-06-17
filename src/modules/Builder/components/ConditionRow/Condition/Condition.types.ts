import { ConditionType } from 'shared/consts';
import { SelectEvent } from 'shared/types';
import { ConditionRowType } from 'modules/Builder/types';
import {
  NumberItemResponseValues,
  SingleAndMultipleSelectItemResponseValues,
  SingleAndMultipleSelectRowsResponseValues,
  SliderItemResponseValues,
  SliderRowsResponseValues,
} from 'shared/state';

import { ConditionItemType } from './Condition.const';

type ConditionItemGeneric<T> = {
  value: string;
  labelKey: string;
} & T;

export type SliderConditionItem = ConditionItemGeneric<{
  type: ConditionItemType.Slider;
  responseValues: SliderItemResponseValues;
}>;
export type SingleSelectionConditionItem = ConditionItemGeneric<{
  type: ConditionItemType.SingleSelection;
  responseValues: SingleAndMultipleSelectItemResponseValues;
}>;
export type MultiSelectionConditionItem = ConditionItemGeneric<{
  type: ConditionItemType.MultiSelection;
  responseValues: SingleAndMultipleSelectItemResponseValues;
}>;
export type DateConditionItem = ConditionItemGeneric<{
  type: ConditionItemType.Date;
}>;
export type NumberSelectionConditionItem = ConditionItemGeneric<{
  type: ConditionItemType.NumberSelection;
  responseValues: NumberItemResponseValues;
}>;
export type TimeConditionItem = ConditionItemGeneric<{
  type: ConditionItemType.Time;
}>;
export type TimeRangeConditionItem = ConditionItemGeneric<{
  type: ConditionItemType.TimeRange;
}>;
export type SingleSelectionPerRowConditionItem = ConditionItemGeneric<{
  type: ConditionItemType.SingleSelectionPerRow;
  responseValues: SingleAndMultipleSelectRowsResponseValues;
}>;
export type MultipleSelectionPerRowConditionItem = ConditionItemGeneric<{
  type: ConditionItemType.MultipleSelectionPerRow;
  responseValues: SingleAndMultipleSelectRowsResponseValues;
}>;
export type SliderRowsConditionItem = ConditionItemGeneric<{
  type: ConditionItemType.SliderRows;
  responseValues: SliderRowsResponseValues;
}>;
export type ScoreConditionItem = ConditionItemGeneric<{
  type: ConditionItemType.Score;
}>;
export type ScoreConditionConditionItem = ConditionItemGeneric<{
  type: ConditionItemType.ScoreCondition;
}>;

export type ConditionItem =
  | SliderConditionItem
  | SingleSelectionConditionItem
  | MultiSelectionConditionItem
  | DateConditionItem
  | NumberSelectionConditionItem
  | TimeConditionItem
  | TimeRangeConditionItem
  | SingleSelectionPerRowConditionItem
  | MultipleSelectionPerRowConditionItem
  | SliderRowsConditionItem
  | ScoreConditionItem
  | ScoreConditionConditionItem;

export type ConditionProps = {
  itemName: string;
  stateName: string;
  payloadName: string;
  itemOptions: ConditionItem[];
  valueOptions: { value: string; labelKey: string }[];
  item: string;
  state: ConditionType;
  isRemoveVisible?: boolean;
  onItemChange: (e: SelectEvent) => void;
  onStateChange: (e: SelectEvent) => void;
  onRemove: () => void;
  type: ConditionRowType;
  'data-testid'?: string;
};
