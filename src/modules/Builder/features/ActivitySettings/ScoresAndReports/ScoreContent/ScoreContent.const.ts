import i18n from 'i18n';
import { CalculationType } from 'shared/consts';

const { t } = i18n;

export const getScoreItemsColumns = () => [
  {
    key: 'name',
    label: t('availableItems'),
  },
];

export const getSelectedItemsColumns = () => [
  {
    key: 'name',
    label: t('selectedItems'),
  },
];

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

export const ForbiddenScoreIdSymbols = /[\s$-/:-?{-~!"@#^_“[\]]/g;
