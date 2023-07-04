import { t } from 'i18next';

import { ItemResponseType } from 'shared/consts';
import { createArray } from 'shared/utils';
import { RespondentDetail } from 'redux/modules';

import { UNSUPPORTED_ITEMS } from './RespondentData.consts';

export const isItemUnsupported = (type: ItemResponseType) => UNSUPPORTED_ITEMS.includes(type);

export const getRespondentLabel = (details?: RespondentDetail[]) => {
  const secretId = details?.[0].respondentSecretId;
  const nickname = details?.[0].respondentNickname;

  if (!secretId) return '';

  return `${t('user')}: ${secretId}${nickname ? ` (${nickname})` : ''}`;
};

export const createArrayForSlider = ({
  maxValue,
  minValue,
}: {
  maxValue: number;
  minValue: number;
}) =>
  createArray(maxValue - minValue + 1, (index) => ({
    value: minValue + index,
    label: minValue + index,
  }));
