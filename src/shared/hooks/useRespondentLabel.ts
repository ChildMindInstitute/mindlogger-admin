import { useTranslation } from 'react-i18next';

import { RespondentDetails } from 'modules/Dashboard/types';
import { users } from 'redux/modules';
import { getRespondentName } from 'shared/utils';

type Parameters = {
  isSubject?: boolean;
  hideNickname?: boolean;
  hideLabel?: boolean;
  sourceSubject?: RespondentDetails | null;
};

export const useRespondentLabel = (
  parameters: Parameters = {
    isSubject: false,
    hideNickname: false,
    hideLabel: false,
    sourceSubject: null,
  },
) => {
  const { t } = useTranslation('app');
  const { useRespondent, useSubject } = users;
  const subjectResult = useSubject();
  const respondentResult = useRespondent()?.result ?? parameters.sourceSubject;

  const result = parameters.isSubject ? subjectResult?.result : respondentResult;

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
