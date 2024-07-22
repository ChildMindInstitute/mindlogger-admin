import { ItemFormValues } from 'modules/Builder/types';
import { ConditionType, ItemResponseType } from 'shared/consts';
import {
  ConditionalLogic,
  Condition,
  ResponseValues,
  SingleValueCondition,
  RangeValueCondition,
  TimeRangeValueCondition,
  SliderRowsCondition,
  TimeRangeConditionType,
  SliderRowsItemResponseValues,
} from 'shared/state/Applet';

export type SummaryRowProps = {
  name: string;
  activityName?: string;
  'data-testid'?: string;
};

export type GetMatchOptionsProps = {
  items: ItemFormValues[];
  conditions: ConditionalLogic['conditions'];
};

export type GetItemsOptionsProps = {
  items: ItemFormValues[];
  itemsInUsage: Set<unknown>;
  conditions: ConditionalLogic['conditions'];
};

export type GetItemsInUsageProps = {
  conditionalLogic?: ConditionalLogic[];
  itemKey: string;
};

export type ConditionWithResponseType = Condition & {
  responseType: ItemResponseType;
  responseValues: ResponseValues;
};
export type GroupedConditionsByRow = Record<string, Condition[]>;

export type CheckIfSelectionPerRowHasIntersectionProps = {
  sameOptionValue: ConditionType.EqualToOption | ConditionType.IncludesOption;
  inverseOptionValue: ConditionType.NotEqualToOption | ConditionType.NotIncludesOption;
};

export type CheckIfSelectionsIntersectionProps = CheckIfSelectionPerRowHasIntersectionProps & {
  conditions: Condition[];
};

export type Range = {
  min: number;
  max: number;
};

export type ConditionWithSetType =
  | SingleValueCondition
  | SingleValueCondition<string>
  | SingleValueCondition<Date>
  | RangeValueCondition
  | RangeValueCondition<Date>
  | RangeValueCondition<string>
  | TimeRangeValueCondition
  | SliderRowsCondition
  | SliderRowsCondition<RangeValueCondition>;

export type ResponseTypeForSetType =
  | ItemResponseType.Slider
  | ItemResponseType.Date
  | ItemResponseType.NumberSelection
  | ItemResponseType.Time
  | ItemResponseType.TimeRange
  | ItemResponseType.SliderRows;

export type EqualValueType<T = number> = {
  value: Array<T>;
};
export type SingleValueType<T = number> = {
  value: T;
};
export type RangeType<T = number> = {
  range: [T, T] | [];
};
export type TimeRangeFlagType = {
  isTimeRange: boolean;
};
export type TimeEqualValueType<T> = TimeRangeFlagType & {
  [k in TimeRangeConditionType]?: EqualValueType<T>;
};
export type TimeSingleValueType<T> = TimeRangeFlagType & {
  [k in TimeRangeConditionType]?: SingleValueType<T>;
};
export type TimeRangeType<T> = TimeRangeFlagType & {
  [k in TimeRangeConditionType]?: RangeType<T>;
};
export type SliderRowsEqualValueType<T = number> = SliderRowsFlagType & {
  [k in number]?: EqualValueType<T>;
};
export type SliderRowsSingleValueType<T = number> = SliderRowsFlagType & {
  [k in number]?: SingleValueType<T>;
};
export type SliderRowsRangeType<T = number> = SliderRowsFlagType & {
  [k in number]?: RangeType<T>;
};
export type SliderRowsFlagType = {
  isSliderRows: boolean;
};
export type CombinedConditionType<T = unknown> =
  | RangeType<T>
  | TimeRangeType<T>
  | SliderRowsRangeType<T>
  | SingleValueType<T>
  | TimeSingleValueType<T>
  | SliderRowsSingleValueType<T>;

export type CheckAllNumericContradictions = {
  lessThanValue?: number;
  greaterThanValue?: number;
  equalSetUnion?: number[];
  notEqualSetUnion?: number[];
  betweenUnion?: number[];
  outsideOfUnion?: number[];
  minValue: number;
  maxValue: number;
};

export type GetCombinedConditionsByType = {
  responseType: ResponseTypeForSetType;
  conditions: ConditionWithSetType[];
  minValue?: number;
  maxValue?: number;
  sliderRows?: SliderRowsItemResponseValues[];
};
