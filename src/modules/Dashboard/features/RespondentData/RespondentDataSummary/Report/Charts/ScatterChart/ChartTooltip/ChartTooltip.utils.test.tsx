import { t } from 'i18next';

import { getReviewOption } from './ChartTooltip.utils';

describe('getReviewOption', () => {
  test.each([
    // [mine, other, expected]
    [0, 0, t('leaveReview')],
    [1, 0, t('reviewOnlyI', { count: 1 })],
    [0, 1, t('reviewOnlyOthers', { count: 1 })],
    [1, 2, t('reviewIAndOthers', { count: 2, reviews: 3 })],
  ])('correctly processes mine: %i, other: %i', (mine, other, expected) => {
    expect(getReviewOption(mine, other)).toBe(expected);
  });
});
