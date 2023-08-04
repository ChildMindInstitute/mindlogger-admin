import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { addDays, format } from 'date-fns';
import download from 'downloadjs';

import { Spinner, Svg, Tooltip } from 'shared/components';
import { useAsync, useHeaderSticky } from 'shared/hooks';
import {
  StyledErrorText,
  StyledHeadlineLarge,
  StyledTitleLarge,
  theme,
  variables,
} from 'shared/styles';
import { getAnswersApi, getLatestReportApi } from 'api';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { getErrorMessage } from 'shared/utils';
import { applet } from 'shared/state';
import { DateFormats } from 'shared/consts';
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
import { ReportContext } from './context';
import { LATEST_REPORT_TYPE } from './Report.const';

export const Report = ({ activity, identifiers = [], versions = [] }: ReportProps) => {
  const { t } = useTranslation('app');
  const { appletId, respondentId } = useParams();
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);
  const getDecryptedActivityData = useDecryptedActivityData();
  const { result: appletData } = applet.useAppletData() ?? {};
  const currentActivity = appletData?.activities.find(({ id }) => id === activity.id);
  const disabledLatestReport = !currentActivity?.scoresAndReports?.generateReport;

  const [latestReportError, setLatestReportError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<ActivityCompletion[]>([]);
  const [responseOptions, setResponseOptions] = useState<Record<string, FormattedResponse[]>>();
  const [currentActivityCompletionData, setCurrentActivityCompletionData] =
    useState<CurrentActivityCompletionData>(null);

  const { control, getValues } = useFormContext<SummaryFiltersForm>();

  const watchFilters = useWatch({
    control,
    name: ['startDate', 'endDate', 'startTime', 'endTime', 'versions', 'identifier'],
  });

  const { execute: getAnswers } = useAsync(getAnswersApi);
  const { execute: getLatestReport, isLoading: latestReportLoading } = useAsync(getLatestReportApi);

  const downloadLatestReportHandler = async () => {
    if (!appletId || !respondentId) return;

    setLatestReportError(null);
    try {
      const { data } = await getLatestReport({
        appletId,
        activityId: activity.id,
        respondentId,
      });
      if (data) {
        const base64Str = Buffer.from(data).toString('base64');
        const linkSource = getLatestReportUrl(base64Str);
        const curDate = format(new Date(), DateFormats.YearMonthDayHoursMinutesSeconds);

        download(
          linkSource,
          `REPORT_${appletData?.displayName}_${activity.name}_${respondentId}_${curDate}.pdf`,
          LATEST_REPORT_TYPE,
        );
      }
    } catch (error) {
      setLatestReportError(getErrorMessage(error));
    }
  };

  useEffect(() => {
    const fetchAnswers = async () => {
      if (!appletId || !respondentId) return;
      try {
        setIsLoading(true);
        const { startDate, endDate, startTime, endTime, identifier, filterByIdentifier, versions } =
          getValues();

        const result = await getAnswers({
          appletId,
          activityId: activity.id,
          params: {
            respondentId,
            fromDatetime: getDateISO(startDate, startTime),
            toDatetime: getDateISO(endDate || addDays(startDate, 1), endTime),
            identifiers: getIdentifiers(filterByIdentifier, identifier, identifiers),
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
        const formattedResponses = getFormattedResponses(sortedDecryptedAnswers);

        setResponseOptions(formattedResponses);
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

    const formattedResponses = getFormattedResponses(responses);

    setResponseOptions(formattedResponses);
  }, [answers, currentActivityCompletionData]);

  return (
    <>
      {(isLoading || latestReportLoading) && <Spinner />}
      <StyledReport ref={containerRef}>
        <StyledHeader isSticky={isHeaderSticky}>
          <StyledHeadlineLarge color={variables.palette.on_surface}>
            {activity.name}
          </StyledHeadlineLarge>
          <Box>
            <Tooltip tooltipTitle={t('configureServer')}>
              <span>
                <StyledTextBtn
                  onClick={downloadLatestReportHandler}
                  variant="text"
                  startIcon={<Svg id="export" width="18" height="18" />}
                  disabled={disabledLatestReport}
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
                <Subscales answers={answers} versions={versions} />
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
