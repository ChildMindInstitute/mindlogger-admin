import i18n from 'i18n';

import { CalculationType } from 'shared/consts';

const { t } = i18n;

export const columns = [
  {
    key: t('name'),
    label: t('itemName'),
  },
  {
    key: t('question'),
    label: t('itemBody'),
  },
];

export const scoreItemsColumns = [
  {
    key: t('name'),
    label: t('availableItems'),
  },
];

export const selectedItemsColumns = [
  {
    key: t('name'),
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
