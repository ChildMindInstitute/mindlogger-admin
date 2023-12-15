import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { addDays } from 'date-fns';
import download from 'downloadjs';

import { Spinner, Svg, Tooltip } from 'shared/components';
import { useAsync, useHeaderSticky } from 'shared/hooks';
import {
  StyledErrorText,
  StyledStickyHeadline,
  StyledTitleLarge,
  theme,
  variables,
} from 'shared/styles';
import { getAnswersApi, getLatestReportApi } from 'api';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { getErrorMessage } from 'shared/utils';
import { applet } from 'shared/state';
import { SummaryFiltersForm } from 'modules/Dashboard/pages/RespondentData/RespondentData.types';

import { StyledTextBtn } from '../../RespondentData.styles';
import { ReportFilters } from './ReportFilters';
import { StyledEmptyState, StyledHeader, StyledReport } from './Report.styles';
import { Subscales } from './Subscales';
import {
  ActivityCompletion,
  FormattedResponse,
  ReportProps,
  CurrentActivityCompletionData,
} from './Report.types';
import { ActivityCompleted } from './ActivityCompleted';
import { ResponseOptions } from './ResponseOptions';
import {
  getDateISO,
  getFormattedResponses,
  getIdentifiers,
  getLatestReportUrl,
} from './Report.utils';
import { ReportContext } from './Report.context';
import {
  LATEST_REPORT_DEFAULT_NAME,
  LATEST_REPORT_REGEX,
  LATEST_REPORT_TYPE,
} from './Report.const';

export const Report = ({ activity, identifiers = [], versions = [] }: ReportProps) => {
  const { t } = useTranslation('app');
  const { appletId, respondentId } = useParams();
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);
  const getDecryptedActivityData = useDecryptedActivityData();
  const { result: appletData } = applet.useAppletData() ?? {};
  const currentActivity = appletData?.activities.find(({ id }) => id === activity.id);
  const disabledLatestReport =
    !currentActivity?.scoresAndReports?.generateReport || !appletData?.reportPublicKey;

  const [latestReportError, setLatestReportError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<ActivityCompletion[]>([]);
  const [responseOptions, setResponseOptions] = useState<Record<string, FormattedResponse[]>>();
  const [subscalesFrequency, setSubscalesFrequency] = useState(0);
  const [currentActivityCompletionData, setCurrentActivityCompletionData] =
    useState<CurrentActivityCompletionData>(null);
  const { control, getValues } = useFormContext<SummaryFiltersForm>();

  const watchFilters = useWatch({
    control,
    name: [
      'startDate',
      'endDate',
      'startTime',
      'endTime',
      'versions',
      'filterByIdentifier',
      'identifier',
    ],
  });

  const { execute: getLatestReport, isLoading: latestReportLoading } = useAsync(
    getLatestReportApi,
    (response) => {
      try {
        const data = response?.data;
        const headers = response?.headers;

        if (data) {
          const contentDisposition = headers?.['content-disposition'];
          const fileName =
            (contentDisposition &&
              LATEST_REPORT_REGEX.exec(contentDisposition)?.groups?.filename) ??
            LATEST_REPORT_DEFAULT_NAME;
          const base64Str = Buffer.from(data).toString('base64');
          const linkSource = getLatestReportUrl(base64Str);

          download(linkSource, fileName, LATEST_REPORT_TYPE);
        }
      } catch (error) {
        setLatestReportError(getErrorMessage(error));
      }
    },
  );

  const downloadLatestReportHandler = async () => {
    if (!appletId || !respondentId) return;

    setLatestReportError(null);
    getLatestReport({
      appletId,
      activityId: activity.id,
      respondentId,
    });
  };

  useEffect(() => {
    const fetchAnswers = async () => {
      if (!appletId || !respondentId) return;
      try {
        setIsLoading(true);
        const { startDate, endDate, startTime, endTime, identifier, filterByIdentifier, versions } =
          getValues();
        const selectedIdentifiers = getIdentifiers(filterByIdentifier, identifier, identifiers);

        const result = await getAnswersApi({
          appletId,
          activityId: activity.id,
          params: {
            respondentId,
            fromDatetime: getDateISO(startDate, startTime),
            toDatetime: getDateISO(endDate || addDays(startDate, 1), endTime),
            emptyIdentifiers: !filterByIdentifier || !selectedIdentifiers?.length,
            identifiers: selectedIdentifiers,
            versions: versions.map(({ id }) => id),
          },
        });

        const decryptedAnswers = result.data.result.map((encryptedAnswer) => {
          const { userPublicKey, answer, items, itemIds, ...rest } = encryptedAnswer;
          const decryptedAnswer = getDecryptedActivityData({
            userPublicKey,
            answer,
            items,
            itemIds,
          }).decryptedAnswers;

          return {
            decryptedAnswer,
            ...rest,
          };
        });

        // TODO: remove when backend add sorting
        const sortedDecryptedAnswers = decryptedAnswers.sort((a, b) =>
          a.version.localeCompare(b.version),
        );

        setAnswers(sortedDecryptedAnswers);
        const { subscalesFrequency, formattedResponses } =
          getFormattedResponses(sortedDecryptedAnswers);

        setSubscalesFrequency(subscalesFrequency);
        setResponseOptions(formattedResponses);
      } catch (error) {
        console.warn(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnswers();
  }, [watchFilters, appletId, respondentId]);

  useEffect(() => {
    const responses = currentActivityCompletionData
      ? answers.filter(({ answerId }) => answerId === currentActivityCompletionData.answerId)
      : answers;

    const { subscalesFrequency, formattedResponses } = getFormattedResponses(responses);

    setSubscalesFrequency(subscalesFrequency);
    setResponseOptions(formattedResponses);
  }, [currentActivityCompletionData]);

  return (
    <>
      {(isLoading || latestReportLoading) && <Spinner />}
      <StyledReport ref={containerRef}>
        <StyledHeader isSticky={isHeaderSticky}>
          <StyledStickyHeadline isSticky={isHeaderSticky} color={variables.palette.on_surface}>
            {activity.name}
          </StyledStickyHeadline>
          <Box>
            <Tooltip tooltipTitle={t('configureServer')}>
              <span>
                <StyledTextBtn
                  onClick={downloadLatestReportHandler}
                  variant="text"
                  startIcon={<Svg id="export" width="18" height="18" />}
                  disabled={disabledLatestReport}
                  data-testid="respondents-summary-download-report"
                >
                  {t('downloadLatestReport')}
                </StyledTextBtn>
              </span>
            </Tooltip>
            {latestReportError && (
              <StyledErrorText sx={{ mt: theme.spacing(0.8) }}>{latestReportError}</StyledErrorText>
            )}
          </Box>
        </StyledHeader>
        <Box sx={{ m: theme.spacing(4.8, 6.4) }}>
          <ReportContext.Provider
            value={{ currentActivityCompletionData, setCurrentActivityCompletionData }}
          >
            <ReportFilters identifiers={identifiers} versions={versions} />
            {!isLoading && answers.length > 0 && (
              <>
                <ActivityCompleted answers={answers} versions={versions} />
                {!!subscalesFrequency && (
                  <Subscales
                    answers={answers}
                    versions={versions}
                    subscalesFrequency={subscalesFrequency}
                  />
                )}
                {responseOptions && !!Object.values(responseOptions).length && (
                  <ResponseOptions responseOptions={responseOptions} versions={versions} />
                )}
              </>
            )}
            {!isLoading && !answers.length && (
              <StyledEmptyState>
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
