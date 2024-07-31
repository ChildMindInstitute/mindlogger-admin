import { ConditionType } from 'shared/consts';

export type Range = {
  min: number;
  max: number;
};

export type CheckGreaterLessNotEqual = {
  compareValue: number;
  notEqualArray: number[];
  validRange: Range;
  comparisonType: ConditionType.LessThan | ConditionType.GreaterThan;
};

export type CheckGreaterLessOutside = {
  compareValue: number;
  outsideRange: Range;
  validRange: Range;
  comparisonType: ConditionType.LessThan | ConditionType.GreaterThan;
};

export type CheckNotEqualBetween = {
  betweenUnion: number[];
  notEqualSetUnion: number[];
};

export type CheckNotEqualOutside = {
  outsideOfUnion: number[];
  notEqualSetUnion: number[];
  minValue: number;
  maxValue: number;
};

export type CheckBetweenOutside = {
  betweenUnion: number[];
  outsideOfUnion: number[];
};
