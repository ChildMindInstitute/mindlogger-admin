import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { addDays } from 'date-fns';

import { Spinner, Svg, Tooltip } from 'shared/components';
import { useAsync, useHeaderSticky } from 'shared/hooks';
import { StyledHeadlineLarge, theme, variables } from 'shared/styles';
import { getAnswersApi } from 'api';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';

import { StyledTextBtn } from '../../RespondentData.styles';
import { ReportFilters } from './ReportFilters';
import { StyledHeader, StyledReport } from './Report.styles';
import { Subscales } from './Subscales';
import {
  ActivityCompletion,
  FilterFormValues,
  FormattedResponse,
  ReportProps,
  CurrentActivityCompletionData,
} from './Report.types';
import { ActivityCompleted } from './ActivityCompleted';
import { ResponseOptions } from './ResponseOptions';
import {
  getDateISO,
  getDefaultFilterValues,
  getFormattedResponses,
  getIdentifiers,
} from './Report.utils';
import { ReportContext } from './context';

export const Report = ({ activity, identifiers = [], versions = [] }: ReportProps) => {
  const { t } = useTranslation('app');
  const { appletId, respondentId } = useParams();
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);
  const getDecryptedActivityData = useDecryptedActivityData();

  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<ActivityCompletion[]>([]);
  const [responseOptions, setResponseOptions] = useState<Record<string, FormattedResponse[]>>();
  const [currentActivityCompletionData, setCurrentActivityCompletionData] =
    useState<CurrentActivityCompletionData>(null);

  const methods = useForm<FilterFormValues>({
    defaultValues: getDefaultFilterValues(versions),
  });

  const watchFilters = useWatch({
    control: methods.control,
    name: ['startDate', 'endDate', 'startTime', 'endTime', 'versions', 'identifier'],
  });

  const { execute: getAnswers } = useAsync(getAnswersApi);

  useEffect(() => {
    const fetchAnswers = async () => {
      if (!appletId || !respondentId) return;
      try {
        setIsLoading(true);
        const { startDate, endDate, startTime, endTime, identifier, filterByIdentifier, versions } =
          methods.getValues();

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
      {isLoading && <Spinner />}
      <StyledReport ref={containerRef}>
        <StyledHeader isSticky={isHeaderSticky}>
          <StyledHeadlineLarge color={variables.palette.on_surface}>
            {activity.name}
          </StyledHeadlineLarge>
          <Tooltip tooltipTitle={t('configureServer')}>
            <span>
              <StyledTextBtn variant="text" startIcon={<Svg id="export" width="18" height="18" />}>
                {t('downloadLatestReport')}
              </StyledTextBtn>
            </span>
          </Tooltip>
        </StyledHeader>
        <Box sx={{ m: theme.spacing(4.8, 6.4) }}>
          <ReportContext.Provider
            value={{ currentActivityCompletionData, setCurrentActivityCompletionData }}
          >
            <FormProvider {...methods}>
              <ReportFilters identifiers={identifiers} versions={versions} />
              <ActivityCompleted answers={answers} versions={versions} />
              {!isLoading && (
                <>
                  <Subscales answers={answers} versions={versions} />
                  {responseOptions && !!Object.values(responseOptions).length && (
                    <ResponseOptions responseOptions={responseOptions} versions={versions} />
                  )}
                </>
              )}
            </FormProvider>
          </ReportContext.Provider>
        </Box>
      </StyledReport>
    </>
  );
};
