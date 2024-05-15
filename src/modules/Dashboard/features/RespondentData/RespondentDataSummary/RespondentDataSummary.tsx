import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { StyledContainer } from 'shared/styles';
import { DatavizActivity, getSummaryActivitiesApi } from 'api';
import { useAsync } from 'shared/hooks';

import { useDatavizSummaryRequests } from './hooks/useDatavizSummaryRequests';
import { useRespondentAnswers } from './hooks/useRespondentAnswers';
import { setDateRangeFormValues } from './utils/setDateRangeValues';
import { RespondentsDataFormValues } from '../RespondentData.types';
import { getActivityWithLatestAnswer } from '../RespondentData.utils';
import { ReportMenu } from './ReportMenu';
import { StyledReportContainer } from './RespondentDataSummary.styles';
import { ReportContent } from './ReportContent';

export const RespondentDataSummary = () => {
  const { appletId, subjectId, activityId } = useParams();
  const viewSingleActivity = !!activityId;

  const [selectedActivity, summaryActivities]: [DatavizActivity | null, DatavizActivity[]] =
    useWatch({
      name: ['selectedActivity', 'summaryActivities'],
    });
  const [isLoading, setIsLoading] = useState(false);
  const { setValue } = useFormContext<RespondentsDataFormValues>();
  const { getIdentifiersVersions } = useDatavizSummaryRequests();
  const { fetchAnswers } = useRespondentAnswers();

  const { execute: getSummaryActivities } = useAsync(getSummaryActivitiesApi, async (result) => {
    const summaryActivities = result?.data?.result || [];
    setValue('summaryActivities', summaryActivities);
    if (selectedActivity) return;

    const selectedActivityByDefault = viewSingleActivity
      ? summaryActivities?.find((e) => e.id === activityId)
      : getActivityWithLatestAnswer(summaryActivities) || summaryActivities?.[0];

    if (!selectedActivityByDefault) return;

    setValue('selectedActivity', selectedActivityByDefault);
    setDateRangeFormValues(setValue, selectedActivityByDefault.lastAnswerDate);

    setIsLoading(true);
    await getIdentifiersVersions({ activity: selectedActivityByDefault });
    await fetchAnswers({ activity: selectedActivityByDefault });
    setIsLoading(false);
  });

  useEffect(() => {
    if (!appletId || !subjectId || !!summaryActivities?.length) return;

    getSummaryActivities({
      appletId,
      targetSubjectId: subjectId,
    });
  }, [appletId, subjectId, summaryActivities, getSummaryActivities]);

  return (
    <StyledContainer>
      {!!summaryActivities?.length && (
        <>
          {!viewSingleActivity && (
            <ReportMenu
              activities={summaryActivities}
              getIdentifiersVersions={getIdentifiersVersions}
              fetchAnswers={fetchAnswers}
              setIsLoading={setIsLoading}
            />
          )}
          <StyledReportContainer>
            <ReportContent selectedActivity={selectedActivity} isLoading={isLoading} />
          </StyledReportContainer>
        </>
      )}
    </StyledContainer>
  );
};
