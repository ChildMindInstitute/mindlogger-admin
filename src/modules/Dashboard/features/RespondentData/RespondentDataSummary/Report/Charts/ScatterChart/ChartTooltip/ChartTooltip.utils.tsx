import i18n from 'i18n';

const { t } = i18n;

export const getReviewOption = (mine?: number, other?: number) => {
  if (!mine && !other) return null;
  if (mine && !other) {
    return t('reviewOnlyI', { count: mine });
  } else if (!mine && other) {
    return t('reviewOnlyOthers', { count: other });
  } else if (mine && other) {
    return t('reviewIAndOthers', { other, reviews: mine + other });
  }
};
