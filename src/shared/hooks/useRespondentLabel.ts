import { useTranslation } from 'react-i18next';

import { users } from 'redux/modules';
import { getRespondentName } from 'shared/utils';

type Parameters = {
  isSubject?: boolean;
  hideNickname?: boolean;
  hideLabel?: boolean;
};

export const useRespondentLabel = (
  parameters: Parameters = {
    isSubject: false,
    hideNickname: false,
    hideLabel: false,
  },
) => {
  const { t } = useTranslation('app');
  const { useRespondent, useSubject } = users;
  const subjectResult = useSubject();
  const respondentResult = useRespondent();

  const result = parameters.isSubject ? subjectResult?.result : respondentResult?.result;
  const { secretUserId, nickname } = result || {};

  if (!secretUserId) return '';
  if (parameters.hideNickname) return secretUserId;

  const label = !parameters.hideLabel
    ? `${t(
        parameters.isSubject ? 'subjectIdentifierWithColon' : 'respondentIdentifierWithColon',
      )}${' '}`
    : '';

  return `${label}${getRespondentName(secretUserId, nickname)}`;
};
