import i18n from 'i18n';
import { createArray } from 'shared/utils';

const { t } = i18n;

export const getMultipleSelectionRowsOptions = () =>
  createArray(3, index => ({
    value: `${index + 1}`,
    labelKey: t('selectionRowsOption', { count: index + 1 }),
  }));
