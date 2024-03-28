import { useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { Spinner } from 'shared/components';
import { StyledContainer, StyledFlexAllCenter } from 'shared/styles';
import { DatavizActivity, getSummaryActivitiesApi } from 'api';
import { useAsync } from 'shared/hooks';

import { useRespondentAnswers } from './hooks/useRespondentAnswers';
import { useDatavizSummaryRequests } from './hooks/useDatavizSummaryRequests';
import { RespondentsDataFormValues } from '../RespondentData.types';
import { ReportMenu } from './ReportMenu';
import { Report } from './Report';
import { StyledReportContainer, StyledEmptyReview } from './RespondentDataSummary.styles';
import { getEmptyState } from './RespondentDataSummary.utils';

export const RespondentDataSummary = () => {
  const { appletId, respondentId } = useParams();
  const [selectedActivity, summaryActivities]: [DatavizActivity | null, DatavizActivity[]] =
    useWatch({
      name: ['selectedActivity', 'summaryActivities'],
    });
  const [isLoading, setIsLoading] = useState(false);
  const { setValue } = useFormContext<RespondentsDataFormValues>();
  const { getIdentifiersVersions } = useDatavizSummaryRequests();
  const { fetchAnswers } = useRespondentAnswers();

  const { execute: getSummaryActivities } = useAsync(getSummaryActivitiesApi, async (result) => {
    const summaryActivities = result?.data?.result;
    setValue('summaryActivities', summaryActivities || []);
    if (selectedActivity) return;

    const firstActivityWithAnswers = summaryActivities?.find((activity) => activity.hasAnswer);
    if (!firstActivityWithAnswers) return;

    setValue('selectedActivity', firstActivityWithAnswers);
    setIsLoading(true);
    await getIdentifiersVersions({ activity: firstActivityWithAnswers });
    await fetchAnswers({ activity: firstActivityWithAnswers });
    setIsLoading(false);
  });

  const reportContent = useMemo(() => {
    if (selectedActivity && isLoading) return <Spinner />;
    if (!selectedActivity || !selectedActivity.hasAnswer || selectedActivity.isPerformanceTask) {
      return (
        <StyledFlexAllCenter sx={{ height: '100%' }}>
          <StyledEmptyReview data-testid="summary-empty-state">
            {getEmptyState(selectedActivity)}
          </StyledEmptyReview>
        </StyledFlexAllCenter>
      );
    }

    return <Report />;
  }, [isLoading, selectedActivity]);

  useEffect(() => {
    if (!appletId || !respondentId || !!summaryActivities?.length) return;

    getSummaryActivities({
      appletId,
      respondentId,
    });
  }, [appletId, respondentId, summaryActivities, getSummaryActivities]);

  return (
    <StyledContainer>
      {!!summaryActivities?.length && (
        <>
          <ReportMenu
            activities={summaryActivities}
            getIdentifiersVersions={getIdentifiersVersions}
            fetchAnswers={fetchAnswers}
            setIsLoading={setIsLoading}
          />
          <StyledReportContainer>{reportContent}</StyledReportContainer>
        </>
      )}
    </StyledContainer>
  );
};
