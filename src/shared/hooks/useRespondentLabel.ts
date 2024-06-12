import { useTranslation } from 'react-i18next';

import { users } from 'redux/modules';
import { getRespondentName } from 'shared/utils';

export const useRespondentLabel = (isSubject?: boolean) => {
  const { t } = useTranslation('app');
  const { useRespondent, useSubject } = users;
  const subjectResult = useSubject();
  const respondentResult = useRespondent();

  const result = isSubject ? subjectResult?.result : respondentResult?.result;
  const { secretUserId, nickname } = result || {};

  if (!secretUserId) return '';

  return `${t('respondent')}: ${getRespondentName(secretUserId, nickname)}`;
};
