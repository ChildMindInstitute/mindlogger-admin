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
