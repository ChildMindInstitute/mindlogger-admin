import { TFunction } from 'i18next';

import { createArray } from 'shared/utils/array';

export const getMonthsArr = (t: TFunction) => [
  t('jan'),
  t('feb'),
  t('mar'),
  t('apr'),
  t('may'),
  t('june'),
  t('july'),
  t('aug'),
  t('sept'),
  t('oct'),
  t('nov'),
  t('dec'),
];

export const getRange = (start: number, end: number) =>
  createArray(end - start, (index) => String(index + start));
