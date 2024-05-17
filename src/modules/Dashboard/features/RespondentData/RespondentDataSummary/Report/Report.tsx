import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { useWatch, useFormContext } from 'react-hook-form';

import { Spinner, Svg } from 'shared/components';
import {
  headerFullHeight,
  StyledFlexAllCenter,
  StyledTitleLarge,
  theme,
  variables,
} from 'shared/styles';
import { Version } from 'modules/Dashboard/api';
import { AutocompleteOption } from 'shared/components/FormComponents';

import {
  ActivityCompletion,
  ActivityOrFlow,
  FlowSubmission,
  FlowResponses,
  FormattedResponses,
  Identifier,
  RespondentsDataFormValues,
} from '../../RespondentData.types';
import { getFormattedResponses } from '../utils/getFormattedResponses';
import { ReportFilters } from './ReportFilters';
import { StyledReport } from './Report.styles';
import { CurrentActivityCompletionData } from './Report.types';
import { CompletedChart } from './CompletedChart';
import { getCompletions } from './Report.utils';
import { ReportContext } from './Report.context';
import { StyledEmptyReview } from '../RespondentDataSummary.styles';
import { ReportHeader } from './ReportHeader';
import { NoData } from './NoData';
import { EntityResponses } from './EntitiyResponses';

export const Report = () => {
  const { t } = useTranslation('app');
  const containerRef = useRef<HTMLElement | null>(null);

  const { setValue } = useFormContext<RespondentsDataFormValues>();
  const [
    answers,
    responseOptions,
    subscalesFrequency,
    selectedEntity,
    identifiers,
    apiVersions,
    versions,
    flowSubmissions,
    flowResponses,
  ]: [
    ActivityCompletion[],
    Record<string, FormattedResponses[]> | null,
    number,
    ActivityOrFlow,
    Identifier[],
    Version[],
    AutocompleteOption[],
    FlowSubmission[],
    FlowResponses[],
  ] = useWatch({
    name: [
      'answers',
      'responseOptions',
      'subscalesFrequency',
      'selectedEntity',
      'identifiers',
      'apiVersions',
      'versions',
      'flowSubmissions',
      'flowResponses',
    ],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [currentActivityCompletionData, setCurrentActivityCompletionData] =
    useState<CurrentActivityCompletionData>(null);

  const { isFlow, hasAnswer } = selectedEntity;

  // TODO: check subscales display for Flows, add reviewCount for Flows when back-end is ready
  const completions = getCompletions({ isFlow, flowSubmissions, answers });

  const showNoDataForFilters =
    !isLoading &&
    !!versions.length &&
    ((isFlow && !flowResponses.length) || (!isFlow && !answers.length));

  const showNoDataForEmptyVersions =
    !isLoading &&
    !versions.length &&
    ((isFlow && !flowResponses.length) || (!isFlow && !answers.length));

  const commonProps = {
    isFlow,
    versions: apiVersions,
  };

  const dataTestId = 'respondents-summary-report';

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
      {isLoading && <Spinner />}
      <StyledReport ref={containerRef} data-testid={dataTestId}>
        <ReportHeader
          containerRef={containerRef}
          selectedEntity={selectedEntity}
          data-testid={`${dataTestId}-header`}
        />
        {hasAnswer ? (
          <Box sx={{ m: theme.spacing(4.8, 6.4) }}>
            <ReportContext.Provider
              value={{ currentActivityCompletionData, setCurrentActivityCompletionData }}
            >
              <ReportFilters
                identifiers={identifiers}
                versions={apiVersions}
                setIsLoading={setIsLoading}
              />
              {!isLoading && (!!answers.length || !!flowSubmissions.length) && (
                <>
                  <CompletedChart
                    {...commonProps}
                    completions={completions}
                    data-testid={`${dataTestId}-completions`}
                  />
                  <EntityResponses
                    {...commonProps}
                    flowResponses={flowResponses}
                    answers={answers}
                    responseOptions={responseOptions}
                    subscalesFrequency={subscalesFrequency}
                    data-testid={`${dataTestId}-entity-responses`}
                  />
                </>
              )}
              <NoData
                showNoDataForFilters={showNoDataForFilters}
                showNoDataForEmptyVersions={showNoDataForEmptyVersions}
              />
            </ReportContext.Provider>
          </Box>
        ) : (
          <StyledFlexAllCenter sx={{ height: `calc(100% - ${headerFullHeight})` }}>
            <StyledEmptyReview data-testid="summary-empty-state">
              <Svg id="chart" width="80" height="80" />
              <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
                {t('noAvailableData')}
              </StyledTitleLarge>
            </StyledEmptyReview>
          </StyledFlexAllCenter>
        )}
      </StyledReport>
    </>
  );
};
