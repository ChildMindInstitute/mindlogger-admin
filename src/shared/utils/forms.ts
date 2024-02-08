import DOMPurify from 'dompurify';
import * as linkify from 'linkifyjs';

import i18n from 'i18n';
import { URL_REGEX } from 'shared/consts';

const { t } = i18n;

// function to remove Cross-site scripting (XSS), HTML injection, and URL
export const getSanitizedContent = (content: string, sanitizeFromLink?: boolean, sanitizeFromUrl?: boolean) => {
  const getContentToSanitize = () => {
    const urls = linkify.find(content, 'url');
    if (!urls?.length) return content;

    return urls.reduce(
      (sanitizedContent, url) =>
        sanitizedContent.replace(new RegExp(url.value, 'g'), url.value.replace(URL_REGEX, '').replace(/\./g, '')),
      content,
    );
  };

  return DOMPurify.sanitize(
    sanitizeFromUrl ? getContentToSanitize() : content,
    sanitizeFromLink
      ? {
          FORBID_TAGS: ['a'],
          FORBID_ATTR: ['href'],
        }
      : {
          ADD_ATTR: ['target'],
        },
  )
    .replace(/&lt;/g, '<') // fix because DOMPurify replaces <,> symbols
    .replace(/&gt;/g, '>');
};

export const getDictionaryText = (description?: string | Record<string, string>) => {
  if (!description) return '';

  const { language } = i18n;

  return (typeof description === 'object' ? description[language] : description) ?? '';
};

export const getDictionaryObject = (description?: string | Record<string, string>) => {
  if (typeof description === 'object') return description;

  const sanitizedDescription = getSanitizedContent(description ?? '', true);
  const { language } = i18n;

  return {
    [language]: sanitizedDescription,
  };
};

export const getMaxLengthValidationError = ({ max }: { max: number }) =>
  t('visibilityDecreasesOverMaxCharacters', { max });

export const getIsRequiredValidateMessage = (field: string, props?: Record<string, string>) =>
  t('validationMessages.isRequired', { field: t(field), ...props });
