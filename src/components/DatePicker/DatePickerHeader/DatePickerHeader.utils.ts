import { TFunction } from 'i18next';

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
  new Array(end - start).fill(0).map((_, i) => String(i + start));
