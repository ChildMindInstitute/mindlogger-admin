import { ConditionType } from 'shared/consts';

export const enum ConditionItemType {
  Slider = 'slider',
  SingleSelection = 'singleSelection',
  MultiSelection = 'multiSelection',
  Score = 'score',
}

export const DEFAULT_NUMBER_MIN_VALUE = 0;
export const DEFAULT_NUMBER_MAX_VALUE = 10;

export const CONDITION_TYPES_TO_HAVE_RANGE_VALUE = [ConditionType.Between, ConditionType.OutsideOf];
