import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import download from 'downloadjs';
import { useWatch, useFormContext } from 'react-hook-form';

import { Spinner, Svg } from 'shared/components';
import { useAsync } from 'shared/hooks';
import { StyledTitleLarge, theme, variables } from 'shared/styles';
import { DatavizActivity, getLatestReportApi, Version } from 'api';
import { getErrorMessage } from 'shared/utils';
import { applet } from 'shared/state';

import {
  ActivityCompletion,
  FormattedResponse,
  Identifier,
  RespondentsDataFormValues,
} from '../../RespondentData.types';
import { getFormattedResponses } from '../../RespondentData.utils';
import { ReportFilters } from './ReportFilters';
import { StyledEmptyState, StyledReport } from './Report.styles';
import { Subscales } from './Subscales';
import { CurrentActivityCompletionData } from './Report.types';
import { ActivityCompleted } from './ActivityCompleted';
import { ResponseOptions } from './ResponseOptions';
import { getLatestReportUrl } from './Report.utils';
import { ReportContext } from './Report.context';
import {
  LATEST_REPORT_DEFAULT_NAME,
  LATEST_REPORT_REGEX,
  LATEST_REPORT_TYPE,
} from './Report.const';
import { ReportHeader } from './ReportHeader';

export const Report = () => {
  const { t } = useTranslation('app');
  const { appletId, respondentId } = useParams();
  const containerRef = useRef<HTMLElement | null>(null);
  const { result: appletData } = applet.useAppletData() ?? {};

  const { setValue } = useFormContext<RespondentsDataFormValues>();
  const [
    answers,
    responseOptions,
    subscalesFrequency,
    selectedActivity,
    identifiers,
    apiVersions,
  ]: [
    ActivityCompletion[],
    Record<string, FormattedResponse[]> | null,
    number,
    DatavizActivity,
    Identifier[],
    Version[],
  ] = useWatch({
    name: [
      'answers',
      'responseOptions',
      'subscalesFrequency',
      'selectedActivity',
      'identifiers',
      'apiVersions',
    ],
  });

  const currentActivity = appletData?.activities.find(({ id }) => id === selectedActivity.id);
  const disabledLatestReport =
    !currentActivity?.scoresAndReports?.generateReport || !appletData?.reportPublicKey;

  const [isLoading, setIsLoading] = useState(false);
  const [currentActivityCompletionData, setCurrentActivityCompletionData] =
    useState<CurrentActivityCompletionData>(null);

  const {
    execute: getLatestReport,
    isLoading: latestReportLoading,
    error: latestReportError,
  } = useAsync(getLatestReportApi, (response) => {
    const data = response?.data;
    const headers = response?.headers;

    if (data) {
      const contentDisposition = headers?.['content-disposition'];
      const fileName =
        (contentDisposition && LATEST_REPORT_REGEX.exec(contentDisposition)?.groups?.filename) ??
        LATEST_REPORT_DEFAULT_NAME;
      const base64Str = Buffer.from(data).toString('base64');
      const linkSource = getLatestReportUrl(base64Str);

      download(linkSource, fileName, LATEST_REPORT_TYPE);
    }
  });

  const downloadLatestReportHandler = async () => {
    if (!appletId || !respondentId) return;

    getLatestReport({
      appletId,
      activityId: selectedActivity.id,
      respondentId,
    });
  };

  useEffect(() => {
    const responses = currentActivityCompletionData
      ? answers?.filter(({ answerId }) => answerId === currentActivityCompletionData.answerId)
      : answers;

    const { subscalesFrequency, formattedResponses } = getFormattedResponses(responses);

    setValue('subscalesFrequency', subscalesFrequency);
    setValue('responseOptions', formattedResponses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentActivityCompletionData]);

  return (
    <>
      {(latestReportLoading || isLoading) && <Spinner />}
      <StyledReport ref={containerRef} data-testid="respondents-summary-report">
        <ReportHeader
          containerRef={containerRef}
          onButtonClick={downloadLatestReportHandler}
          activityName={selectedActivity.name}
          isButtonDisabled={disabledLatestReport}
          error={latestReportError ? getErrorMessage(latestReportError) : null}
        />
        <Box sx={{ m: theme.spacing(4.8, 6.4) }}>
          <ReportContext.Provider
            value={{ currentActivityCompletionData, setCurrentActivityCompletionData }}
          >
            <ReportFilters
              identifiers={identifiers}
              versions={apiVersions}
              setIsLoading={setIsLoading}
            />
            {!isLoading && answers.length > 0 && (
              <>
                <ActivityCompleted answers={answers} versions={apiVersions} />
                {!!subscalesFrequency && (
                  <Subscales
                    answers={answers}
                    versions={apiVersions}
                    subscalesFrequency={subscalesFrequency}
                  />
                )}
                {responseOptions && !!Object.values(responseOptions).length && (
                  <ResponseOptions responseOptions={responseOptions} versions={apiVersions} />
                )}
              </>
            )}
            {!isLoading && !answers.length && (
              <StyledEmptyState data-testid="report-empty-state">
                <Svg id="chart" width="80" height="80" />
                <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
                  {t('noDataForActivityFilters')}
                </StyledTitleLarge>
              </StyledEmptyState>
            )}
          </ReportContext.Provider>
        </Box>
      </StyledReport>
    </>
  );
};
