import { CalculationType } from 'shared/consts';

export const calculationTypes = [
  {
    value: CalculationType.Sum,
    labelKey: 'calculationTypeSum',
  },
  {
    value: CalculationType.Average,
    labelKey: 'calculationTypeAverage',
  },
  {
    value: CalculationType.Percentage,
    labelKey: 'calculationTypePercentage',
  },
];

export const scoreIdBase = {
  [CalculationType.Sum]: 'sumScore',
  [CalculationType.Average]: 'averageScore',
  [CalculationType.Percentage]: 'percentScore',
};

export const ForbiddenScoreIdSymbols = /[\s$-/:-?{-~!"@#^_“[\]]+/g;

export const EMPTY_SCORE_RANGE_LABEL = '-';
