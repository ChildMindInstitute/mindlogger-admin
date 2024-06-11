import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { StyledContainer } from 'shared/styles';
import { getSummaryActivitiesApi, getSummaryFlowsApi } from 'modules/Dashboard/api';
import { useAsync } from 'shared/hooks';

import { useDatavizSummaryRequests } from './hooks/useDatavizSummaryRequests';
import { useRespondentAnswers } from './hooks/useRespondentAnswers';
import { setDateRangeFormValues } from './utils/setDateRangeValues';
import { RespondentsDataFormValues } from '../RespondentData.types';
import { getActivityWithLatestAnswer } from '../RespondentData.utils';
import { ReportMenu } from './ReportMenu';
import { StyledReportContainer } from './RespondentDataSummary.styles';
import { ReportContent } from './ReportContent';
import { DataSummaryContextProvider, useDataSummaryContext } from './DataSummaryContext';

export const InnerRespondentDataSummary = () => {
  const { appletId, respondentId } = useParams();
  const {
    summaryActivities,
    setSummaryActivities,
    summaryFlows,
    setSummaryFlows,
    selectedEntity,
    setSelectedEntity,
  } = useDataSummaryContext();
  const requestBody = useMemo(() => {
    if (!appletId || !respondentId) return null;

    return {
      appletId,
      targetSubjectId: respondentId,
    };
  }, [appletId, respondentId]);
  const [isLoading, setIsLoading] = useState(false);
  const { setValue } = useFormContext<RespondentsDataFormValues>();
  const { getIdentifiersVersions } = useDatavizSummaryRequests();
  const { fetchAnswers } = useRespondentAnswers();

  const summaryActivitiesLength = summaryActivities.length;
  const summaryFlowsLength = summaryFlows.length;

  const { execute: getSummaryActivities } = useAsync(getSummaryActivitiesApi, async (result) => {
    const summaryActivities = result?.data?.result || [];
    setSummaryActivities(summaryActivities);
    if (selectedEntity) return;

    const selectedActivityByDefault = {
      ...(getActivityWithLatestAnswer(summaryActivities) || summaryActivities?.[0]),
      isFlow: false,
    };

    if (!selectedActivityByDefault) return;

    setSelectedEntity(selectedActivityByDefault);
    setDateRangeFormValues(setValue, selectedActivityByDefault.lastAnswerDate);

    setIsLoading(true);
    await getIdentifiersVersions({ entity: selectedActivityByDefault });
    await fetchAnswers({ entity: selectedActivityByDefault });
    setIsLoading(false);
  });

  const { execute: getSummaryFlows } = useAsync(getSummaryFlowsApi, async (result) => {
    const summaryFlows = result?.data?.result || [];
    setSummaryFlows(summaryFlows);
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

export const RespondentDataSummary = () => (
  <DataSummaryContextProvider>
    <InnerRespondentDataSummary />
  </DataSummaryContextProvider>
);
