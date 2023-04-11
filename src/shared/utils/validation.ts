import i18n from 'i18n';

const { t } = i18n;

export const getMaxLengthValidationError = ({ max }: { max: number }) =>
  t('visibilityDecreasesOverMaxCharacters', { max });
