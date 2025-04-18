import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import { DateFormats } from 'shared/consts';
import { getRespondentName } from 'shared/utils';

import { ResponsesSummaryProps } from './ResponsesSummary.types';
import { EMPTY_IDENTIFIER } from './ResponsesSummary.const';

export const useResponsesSummary = ({
  endDatetime,
  createdAt,
  identifier,
  sourceSubject,
  version,
}: Omit<ResponsesSummaryProps, 'data-testid'>) => {
  const { t } = useTranslation();
  const submittedDateTime = format(
    new Date(endDatetime ?? createdAt),
    DateFormats.MonthDayYearTimeSeconds,
  );

  const respondent =
    sourceSubject && getRespondentName(sourceSubject.secretUserId, sourceSubject.nickname, 'comma');

  return [
    {
      id: 'review-desc-1',
      title: t('viewingResponsesSubmitted'),
      content: submittedDateTime,
    },
    {
      id: 'review-desc-2',
      title: t('respondentIdentifierWithColon'),
      content: respondent,
    },
    {
      id: 'review-desc-3',
      title: t('responseIdentifierWithColon'),
      content: identifier ?? EMPTY_IDENTIFIER,
    },
    {
      id: 'review-desc-4',
      title: t('versionWithColon'),
      content: version,
    },
  ];
};
