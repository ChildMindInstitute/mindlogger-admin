import { useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { StyledContainer } from 'shared/styles';
import { DatavizEntity, getSummaryActivitiesApi, getSummaryFlowsApi } from 'api';
import { useAsync } from 'shared/hooks';

import { useDatavizSummaryRequests } from './hooks/useDatavizSummaryRequests';
import { useRespondentAnswers } from './hooks/useRespondentAnswers';
import { setDateRangeFormValues } from './utils/setDateRangeValues';
import { ActivityOrFlow, RespondentsDataFormValues } from '../RespondentData.types';
import { getActivityWithLatestAnswer } from '../RespondentData.utils';
import { ReportMenu } from './ReportMenu';
import { StyledReportContainer } from './RespondentDataSummary.styles';
import { ReportContent } from './ReportContent';

export const RespondentDataSummary = () => {
  const { appletId, respondentId } = useParams();
  const requestBody = useMemo(() => {
    if (!appletId || !respondentId) return null;

    return {
      appletId,
      respondentId,
    };
  }, [appletId, respondentId]);
  const [selectedEntity, summaryActivities, summaryFlows]: [
    ActivityOrFlow | null,
    DatavizEntity[],
    DatavizEntity[],
  ] = useWatch({
    name: ['selectedEntity', 'summaryActivities', 'summaryFlows'],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { setValue } = useFormContext<RespondentsDataFormValues>();
  const { getIdentifiersVersions } = useDatavizSummaryRequests();
  const { fetchAnswers } = useRespondentAnswers();

  const summaryActivitiesLength = summaryActivities.length;
  const summaryFlowsLength = summaryFlows.length;

  const { execute: getSummaryActivities } = useAsync(getSummaryActivitiesApi, async (result) => {
    const summaryActivities = result?.data?.result || [];
    setValue('summaryActivities', summaryActivities);
    if (selectedEntity) return;

    const selectedActivityByDefault = {
      ...(getActivityWithLatestAnswer(summaryActivities) || summaryActivities?.[0]),
      isFlow: false,
    };

    if (!selectedActivityByDefault) return;

    setValue('selectedEntity', selectedActivityByDefault);
    setDateRangeFormValues(setValue, selectedActivityByDefault.lastAnswerDate);

    setIsLoading(true);
    await getIdentifiersVersions({ entity: selectedActivityByDefault });
    await fetchAnswers({ entity: selectedActivityByDefault });
    setIsLoading(false);
  });

  const { execute: getSummaryFlows } = useAsync(getSummaryFlowsApi, async (result) => {
    const summaryFlows = result?.data?.result || [];
    setValue('summaryFlows', summaryFlows);
  });

  useEffect(() => {
    if (!requestBody || summaryFlowsLength) return;

    getSummaryFlows(requestBody);
  }, [requestBody, summaryFlowsLength, getSummaryFlows]);

  useEffect(() => {
    if (!requestBody || summaryActivitiesLength) return;

    getSummaryActivities(requestBody);
  }, [requestBody, summaryActivitiesLength, getSummaryActivities]);

  return (
    <StyledContainer>
      {(!!summaryActivitiesLength || !!summaryFlowsLength) && (
        <>
          <ReportMenu
            activities={summaryActivities}
            flows={summaryFlows}
            getIdentifiersVersions={getIdentifiersVersions}
            fetchAnswers={fetchAnswers}
            setIsLoading={setIsLoading}
          />
          <StyledReportContainer>
            <ReportContent selectedEntity={selectedEntity} isLoading={isLoading} />
          </StyledReportContainer>
        </>
      )}
    </StyledContainer>
  );
};
