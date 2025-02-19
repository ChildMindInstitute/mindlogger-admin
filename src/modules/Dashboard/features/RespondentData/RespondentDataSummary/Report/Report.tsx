import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { useWatch } from 'react-hook-form';

import { Spinner, Svg } from 'shared/components';
import {
  headerFullHeight,
  StyledFlexAllCenter,
  StyledTitleLarge,
  theme,
  variables,
} from 'shared/styles';
import { AutocompleteOption } from 'shared/components/FormComponents';

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
import { useRespondentDataContext } from '../../RespondentDataContext';
import { useDatavizSkippedFilter } from '../hooks/useDatavizSkippedFilter';

export const Report = () => {
  const { t } = useTranslation('app');
  const containerRef = useRef<HTMLElement | null>(null);
  const {
    selectedEntity,
    answers,
    responseOptions,
    setResponseOptions,
    subscalesFrequency,
    setSubscalesFrequency,
    flowSubmissions,
    flowResponses,
    identifiers,
    apiVersions,
  } = useRespondentDataContext();

  const versions: AutocompleteOption[] = useWatch({
    name: 'versions',
  });
  const { hideSkipped } = useDatavizSkippedFilter();

  const [isLoading, setIsLoading] = useState(false);
  const [currentActivityCompletionData, setCurrentActivityCompletionData] =
    useState<CurrentActivityCompletionData>(null);

  const { isFlow = false, hasAnswer = false } = selectedEntity ?? {};

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

    const filtered = !hideSkipped
      ? responses
      : responses
          .map((response) => {
            const answerItems = response.decryptedAnswer.filter(({ answer }) => answer);

            return { ...response, decryptedAnswer: answerItems };
          })
          .filter(Boolean);

    const { subscalesFrequency, formattedResponses } = getFormattedResponses(filtered);

    setResponseOptions(formattedResponses);
    setSubscalesFrequency(subscalesFrequency);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentActivityCompletionData, hideSkipped, answers]);

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
