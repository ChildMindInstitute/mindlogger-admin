import { useTranslation } from 'react-i18next';

import { users } from 'redux/modules';
import { getRespondentName } from 'shared/utils';

type Parameters = {
  isSubject?: boolean;
  hiddeNickname?: boolean;
};

export const useRespondentLabel = (
  parameters: Parameters = {
    isSubject: false,
    hiddeNickname: false,
  },
) => {
  const { t } = useTranslation('app');
  const { useRespondent, useSubject } = users;
  const subjectResult = useSubject();
  const respondentResult = useRespondent();

  const result = parameters.isSubject ? subjectResult?.result : respondentResult?.result;
  const { secretUserId, nickname } = result || {};

  if (!secretUserId) return '';
  if (parameters.hiddeNickname) return secretUserId;

  return `${t('user')}: ${getRespondentName(secretUserId, nickname)}`;
};
