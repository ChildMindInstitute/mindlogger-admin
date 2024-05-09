import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { StyledContainer } from 'shared/styles';
import { DatavizActivity, getSummaryActivitiesApi } from 'api';
import { useAsync } from 'shared/hooks';

import { useDatavizSummaryRequests } from '../../RespondentData/RespondentDataSummary/hooks/useDatavizSummaryRequests';
import { useRespondentAnswers } from '../../RespondentData/RespondentDataSummary/hooks/useRespondentAnswers';
import { RespondentsDataFormValues } from '../../RespondentData';
import { setDateRangeFormValues } from '../../RespondentData/RespondentDataSummary/utils/setDateRangeValues';
import { StyledReportContainer } from '../../RespondentData/RespondentDataSummary/RespondentDataSummary.styles';
import { ReportContent } from '../../RespondentData/RespondentDataSummary/ReportContent';

export const ParticipantActivitySummary = () => {
  const { appletId, subjectId, activityId } = useParams();
  const [activities, setActivities] = useState<DatavizActivity[]>();
  const [activity, setActivity] = useState<DatavizActivity | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { setValue } = useFormContext<RespondentsDataFormValues>();
  const { getIdentifiersVersions } = useDatavizSummaryRequests();
  const { fetchAnswers } = useRespondentAnswers();

  const { execute: getSummaryActivities } = useAsync(getSummaryActivitiesApi, async (result) => {
    const summaryActivities = result?.data?.result || [];
    setActivities(summaryActivities);
    setValue('summaryActivities', summaryActivities);
    if (activity) return;

    const selectedActivityByDefault = summaryActivities?.find((e) => e.id === activityId);

    if (!selectedActivityByDefault) return;

    setActivity(selectedActivityByDefault);
    setValue('selectedActivity', selectedActivityByDefault);
    setDateRangeFormValues(setValue, selectedActivityByDefault.lastAnswerDate);

    setIsLoading(true);
    await getIdentifiersVersions({ activity: selectedActivityByDefault });
    await fetchAnswers({ activity: selectedActivityByDefault });
    setIsLoading(false);
  });

  useEffect(() => {
    if (!appletId || !subjectId || !!activities?.length) return;

    getSummaryActivities({
      appletId,
      targetSubjectId: subjectId,
    });
  }, [appletId, subjectId, activities, getSummaryActivities]);

  return activity ? (
    <StyledContainer>
      <StyledReportContainer>
        <ReportContent selectedActivity={activity} isLoading={isLoading} />
      </StyledReportContainer>
    </StyledContainer>
  ) : (
    <div data-testid="participant-activity-summary">Summary tab</div>
  );
};

export default ParticipantActivitySummary;
