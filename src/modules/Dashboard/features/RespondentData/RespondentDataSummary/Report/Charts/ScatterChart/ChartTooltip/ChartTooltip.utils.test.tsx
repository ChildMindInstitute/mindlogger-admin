import { t } from 'i18next';

import { getReviewOption } from './ChartTooltip.utils';

describe('getReviewOption', () => {
  test.each([
    // [mine, other, expected]
    [0, 0, null, 'returns null when both mine and other are 0'],
    [
      1,
      0,
      t('reviewOnlyI', { count: 1 }),
      'returns correct translation for only mine reviews when other is 0',
    ],
    [
      0,
      1,
      t('reviewOnlyOthers', { count: 1 }),
      'returns correct translation for only other reviews when mine is 0',
    ],
    [
      1,
      2,
      t('reviewIAndOthers', { other: 2, reviews: 3 }),
      'returns correct translation for both mine and other reviews',
    ],
  ])('correctly processes mine: %i, other: %i', (mine, other, expected) => {
    expect(getReviewOption(mine, other)).toBe(expected);
  });
});
