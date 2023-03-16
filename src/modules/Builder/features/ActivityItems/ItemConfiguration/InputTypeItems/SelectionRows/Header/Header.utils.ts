import i18n from 'i18n';
import { createArray } from 'shared/utils';

const { t } = i18n;

export const getMultipleSelectionRowsOptions = (isSingle?: boolean) =>
  createArray(isSingle ? 2 : 3, (index) => ({
    value: `${index + (isSingle ? 2 : 1)}`,
    labelKey: t('selectionRowsOption', { count: index + (isSingle ? 2 : 1) }),
  }));
