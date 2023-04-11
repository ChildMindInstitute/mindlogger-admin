import i18n from 'i18n';

const { t } = i18n;

export const getDictionaryText = (description?: string | Record<string, string>) => {
  if (!description) return '';

  const { language } = i18n;

  return (typeof description === 'object' ? description[language] : description) ?? '';
};

export const getDictionaryObject = (description?: string | Record<string, string>) => {
  if (typeof description === 'object') return description;

  const { language } = i18n;

  return {
    [language]: description ?? '',
  };
};

export const getMaxLengthValidationError = ({ max }: { max: number }) =>
  t('visibilityDecreasesOverMaxCharacters', { max });
