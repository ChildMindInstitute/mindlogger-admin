import i18n from 'i18n';

const { t } = i18n;

export const getDictionaryText = (
  description?: string | Record<string, string>,
  search?: string,
) => {
  if (!description) return '';

  const { language } = i18n;

  const dictionaryText =
    (typeof description === 'object' ? description[language] : description) ?? '';

  if (search) {
    const searchPattern = new RegExp(`(${search})`, 'gi');

    return dictionaryText.replace(searchPattern, '<mark class="marked">$1</mark>');
  }

  return dictionaryText;
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

export const getIsRequiredValidateMessage = (field: string, props?: Record<string, string>) =>
  t('validationMessages.isRequired', { field: t(field), ...props });
