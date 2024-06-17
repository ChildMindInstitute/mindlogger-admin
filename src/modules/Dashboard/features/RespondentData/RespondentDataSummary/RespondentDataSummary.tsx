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
import { getConcatenatedEntities, getEntityWithLatestAnswer } from '../RespondentData.utils';
import { ReportMenu } from './ReportMenu';
import { StyledReportContainer } from './RespondentDataSummary.styles';
import { ReportContent } from './ReportContent';
import { useRespondentDataContext } from '../RespondentDataContext';

export const RespondentDataSummary = () => {
  const { appletId, respondentId } = useParams();
  const {
    summaryActivities,
    setSummaryActivities,
    summaryFlows,
    setSummaryFlows,
    selectedEntity,
    setSelectedEntity,
  } = useRespondentDataContext();
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

  useEffect(() => {
    (async () => {
      if (selectedEntity || !summaryActivitiesLength || !summaryFlowsLength) return;

      const summaryEntities = getConcatenatedEntities({
        activities: summaryActivities,
        flows: summaryFlows,
      });

      const selectedEntityByDefault = {
        ...(getEntityWithLatestAnswer(summaryEntities) || summaryEntities?.[0]),
      };

      if (!selectedEntityByDefault) return;

      setSelectedEntity(selectedEntityByDefault);
      setDateRangeFormValues(setValue, selectedEntityByDefault.lastAnswerDate);

      setIsLoading(true);
      await getIdentifiersVersions({ entity: selectedEntityByDefault });
      await fetchAnswers({ entity: selectedEntityByDefault });
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEntity, summaryActivitiesLength, summaryFlowsLength]);

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
