import { t } from 'i18next';

import { ItemResponseType } from 'shared/consts';

import { RespondentDetail } from 'redux/modules';
import { UNSUPPORTED_ITEMS } from './RespondentsData.consts';

export const isItemUnsupported = (type: ItemResponseType) => UNSUPPORTED_ITEMS.includes(type);

export const getRespondentLabel = (details?: RespondentDetail[]) => {
  const secretId = details?.[0].respondentSecretId;
  const nickname = details?.[0].respondentNickname;

  if (!secretId) return '';

  return `${t('user')}: ${secretId}${nickname ? ` (${nickname})` : ''}`;
};
