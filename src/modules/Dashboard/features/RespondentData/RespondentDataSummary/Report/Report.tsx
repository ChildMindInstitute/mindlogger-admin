import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { addDays } from 'date-fns';

import { Spinner, Svg, Tooltip } from 'shared/components';
import { useAsync, useHeaderSticky } from 'shared/hooks';
import { StyledHeadlineLarge, theme, variables } from 'shared/styles';
import { DatavizAnswer, getAnswersApi } from 'api';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';

import { StyledTextBtn } from '../../RespondentData.styles';
import { ReportFilters } from './ReportFilters';
import { StyledHeader, StyledReport } from './Report.styles';
import { Subscales } from './Subscales';
import { FilterFormValues, ReportProps } from './Report.types';
import { ActivityCompleted } from './ActivityCompleted';
import { activityReport } from './mock';
import { ResponseOptions } from './ResponseOptions';
import { getDateISO, getDefaultFilterValues, getIdentifiers } from './Report.utils';

export const Report = ({ activity, identifiers, versions }: ReportProps) => {
  const { t } = useTranslation();
  const { appletId, respondentId } = useParams();
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);
  const getDecryptedActivityData = useDecryptedActivityData();

  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<DatavizAnswer[]>([]);

  const methods = useForm<FilterFormValues>({
    defaultValues: getDefaultFilterValues(versions),
  });

  const watchFilters = useWatch({
    control: methods.control,
    name: ['startDateEndDate', 'startTime', 'endTime', 'versions', 'identifier'],
  });

  const { execute: getAnswers } = useAsync(getAnswersApi);

  useEffect(() => {
    const fetchAnswers = async () => {
      if (!appletId || !respondentId) return;
      try {
        setIsLoading(true);
        const {
          startDateEndDate: [startDate, endDate],
          startTime,
          endTime,
          identifier,
          filterByIdentifier,
          versions,
        } = methods.getValues();

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
          });

          return {
            answer: decryptedAnswer,
            items,
            ...rest,
          };
        });
        setAnswers(decryptedAnswers as unknown as DatavizAnswer[]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnswers();
  }, [watchFilters, appletId, respondentId]);

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
        <Box sx={{ margin: theme.spacing(4.8, 6.4) }}>
          <FormProvider {...methods}>
            <ReportFilters identifiers={identifiers} versions={versions} />
            <ActivityCompleted answers={answers} versions={versions} />
            {/* TODO: hide subscales until the module for counting is ready */}
            {/* <Subscales />  */}
            {activityReport.responseOptions && (
              <ResponseOptions
                responseOptions={activityReport.responseOptions}
                versions={versions}
              />
            )}
          </FormProvider>
        </Box>
      </StyledReport>
    </>
  );
};
