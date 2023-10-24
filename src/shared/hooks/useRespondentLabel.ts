import { useParams } from 'react-router-dom';
import { t } from 'i18next';

import { users } from 'redux/modules';
import { getRespondentName } from 'shared/utils';

export const useRespondentLabel = () => {
  const { respondentId } = useParams();
  const { details } = users.useRespondent(respondentId || '') || {};

  const secretId = details?.[0].respondentSecretId;
  const nickname = details?.[0].respondentNickname;

  if (!secretId) return '';

  const respondentName = getRespondentName(secretId || '', nickname);

  return `${t('user')}: ${respondentName}`;
};
