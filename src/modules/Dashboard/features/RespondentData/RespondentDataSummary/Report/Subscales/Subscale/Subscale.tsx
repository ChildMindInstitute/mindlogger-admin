import { Fragment } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box } from '@mui/material';
import uniqueId from 'lodash.uniqueid';
import { useTranslation } from 'react-i18next';

import { useDatavizFilters } from 'modules/Dashboard/hooks';
import { getDictionaryText } from 'shared/utils';
import { Accordion } from 'modules/Dashboard/components';
import { CollapsedMdText } from 'modules/Dashboard/features/RespondentData/CollapsedMdText';
import { FormattedResponse } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Report.types';
import { UnsupportedItemResponse } from 'modules/Dashboard/features/RespondentData/UnsupportedItemResponse';
import { getResponseItem } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/ResponseOptions/ResponseOptions.utils';
import { StyledBodyMedium, StyledTitleBoldMedium, theme, variables } from 'shared/styles';
import { SummaryFiltersForm } from 'modules/Dashboard/pages/RespondentData/RespondentData.types';
import { UNSUPPORTED_ITEMS } from 'modules/Dashboard/features/RespondentData/RespondentData.consts';

import { COLORS } from '../../Charts/Charts.const';
import { AdditionalInformation } from '../AdditionalInformation';
import { SubscaleProps } from './Subscale.types';
import { StyledSubscaleContainer } from './Subscale.styles';

export const Subscale = ({
  isNested = false,
  name,
  subscale,
  versions,
  'data-testid': dataTestid,
}: SubscaleProps) => {
  const { t } = useTranslation('app');

  const { watch } = useFormContext<SummaryFiltersForm>();

  const { minDate, maxDate, filteredVersions } = useDatavizFilters(watch, versions);

  const renderChart = ({ activityItem, answers }: FormattedResponse, index: number) => {
    if (UNSUPPORTED_ITEMS.includes(activityItem.responseType))
      return <UnsupportedItemResponse itemType={activityItem.responseType} />;

    const color = COLORS[index % COLORS.length];

    return getResponseItem({
      color,
      minDate,
      maxDate,
      activityItem,
      versions: filteredVersions,
      answers,
    });
  };

  return (
    <StyledSubscaleContainer isNested={isNested} data-testid={dataTestid}>
      <Accordion
        title={
          <>
            <StyledTitleBoldMedium color={variables.palette.on_surface_variant}>
              {name}
            </StyledTitleBoldMedium>
            {subscale.score !== undefined && (
              <StyledBodyMedium color={variables.palette.on_surface_variant}>
                {t('score')}: {subscale.score}
              </StyledBodyMedium>
            )}
          </>
        }
      >
        <Box sx={{ mt: theme.spacing(4.8) }}>
          {subscale.optionText && (
            <Box sx={{ m: theme.spacing(4.8, 0) }}>
              <AdditionalInformation
                data-testid={`${dataTestid}-additional-information`}
                optionText={subscale.optionText}
              />
            </Box>
          )}
          {!!subscale?.items?.length &&
            subscale?.items?.map((item, index: number) => (
              <Box key={`${item.activityItem.id}-${index}`} sx={{ m: theme.spacing(2.4, 0) }}>
                <CollapsedMdText
                  text={getDictionaryText(item.activityItem.question)}
                  maxHeight={120}
                  data-testid={`${dataTestid}-question-${index}`}
                />
                {renderChart(item, index)}
              </Box>
            ))}
          {!!subscale?.restScores && (
            <Box sx={{ mt: theme.spacing(4.8) }}>
              {Object.keys(subscale?.restScores)?.map((restScore, index) => (
                <Fragment key={uniqueId()}>
                  <Subscale
                    isNested
                    subscale={subscale?.restScores[restScore]}
                    name={restScore}
                    versions={versions}
                    data-testid={`${dataTestid}-nested-${index}`}
                  />
                </Fragment>
              ))}
            </Box>
          )}
        </Box>
      </Accordion>
    </StyledSubscaleContainer>
  );
};
