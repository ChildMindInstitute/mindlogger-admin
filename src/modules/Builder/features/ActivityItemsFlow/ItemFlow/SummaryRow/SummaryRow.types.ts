import { ItemFormValues } from 'modules/Builder/types';
import { ItemResponseType } from 'shared/consts';
import {
  ConditionalLogic,
  Condition,
  ResponseValues,
  SingleValueCondition,
  RangeValueCondition,
  SliderRowsCondition,
  TimeRangeConditionType,
  SliderRowsItemResponseValues,
  TimeSingleValueCondition,
  DateRangeValueCondition,
  TimeIntervalValueCondition,
  TimeRangeIntervalValueCondition,
  DateSingleValueCondition,
} from 'shared/state/Applet';

export type SummaryRowProps = {
  name: string;
  activityName?: string;
  'data-testid'?: string;
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

export type ConditionWithResponseValues = Condition & {
  responseValues?: ResponseValues;
};

export type ConditionWithSetType =
  | SingleValueCondition
  | SingleValueCondition<string>
  | DateSingleValueCondition<Date>
  | RangeValueCondition
  | DateRangeValueCondition<Date>
  | RangeValueCondition<string>
  | TimeSingleValueCondition
  | TimeIntervalValueCondition
  | TimeRangeIntervalValueCondition
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

export type GetCombinedConditionsByType = {
  responseType: ResponseTypeForSetType;
  conditions: ConditionWithSetType[];
  minValue?: number;
  maxValue?: number;
  sliderRows?: SliderRowsItemResponseValues[];
};
