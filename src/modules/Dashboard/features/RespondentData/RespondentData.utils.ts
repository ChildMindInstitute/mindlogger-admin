import { t } from 'i18next';

import { RespondentDetail } from 'modules/Dashboard/types';
import { createArray } from 'shared/utils';

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
