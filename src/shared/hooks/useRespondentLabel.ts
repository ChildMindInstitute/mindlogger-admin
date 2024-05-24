import { useTranslation } from 'react-i18next';

import { users } from 'redux/modules';
import { getRespondentName } from 'shared/utils';

export const useRespondentLabel = () => {
  const { t } = useTranslation('app');
  const { result } = users.useRespondent() || {};
  const secretId = result?.secretUserId;
  const nickname = result?.nickname;

  if (!secretId) return '';

  const respondentName = getRespondentName(secretId || '', nickname);

  return `${t('respondent')}: ${respondentName}`;
};
