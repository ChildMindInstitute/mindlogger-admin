import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Tooltip } from 'shared/components/Tooltip';
import { StyledHeadline, StyledTitleTooltipIcon, theme, variables } from 'shared/styles';
import { UnsupportedItemResponse } from 'modules/Dashboard/features/RespondentData/UnsupportedItemResponse';
import { CollapsedMdText } from 'modules/Dashboard/features/RespondentData/CollapsedMdText';
import { getDictionaryText } from 'shared/utils';
import {
  UNSUPPORTED_ITEMS,
  SHOW_MORE_HEIGHT,
} from 'modules/Dashboard/features/RespondentData/RespondentData.const';
import { FormattedResponses } from 'modules/Dashboard/features/RespondentData/RespondentData.types';

import { SUMMARY_ITEMS_COUNT_TO_ACTIVATE_STATIC } from '../../RespondentDataSummary.const';
import { useDatavizFilters } from '../../hooks/useDatavizFilters';
import { COLORS } from '../Charts/Charts.const';
import { ResponseOptionsProps } from './ResponseOptions.types';
import { getResponseItem } from './ResponseOptions.utils';
import { useDataSummaryContext } from '../../DataSummaryContext';

export const ResponseOptions = ({
  responseOptions,
  versions = [],
  flowResponsesIndex,
}: ResponseOptionsProps) => {
  const { t } = useTranslation();
  const { flowResponseOptionsCount } = useDataSummaryContext();
  const { minDate, maxDate, filteredVersions } = useDatavizFilters(versions);
  const isStaticActive =
    Object.values(responseOptions).length > SUMMARY_ITEMS_COUNT_TO_ACTIVATE_STATIC ||
    flowResponseOptionsCount > SUMMARY_ITEMS_COUNT_TO_ACTIVATE_STATIC;

  const renderResponseOption = useCallback(
    (activityItemAnswer: FormattedResponses, index: number) => {
      if (UNSUPPORTED_ITEMS.includes(activityItemAnswer.activityItem.responseType))
        return <UnsupportedItemResponse itemType={activityItemAnswer.activityItem.responseType} />;

      const color = COLORS[index % COLORS.length];

      return getResponseItem({
        color,
        minDate,
        maxDate,
        activityItemAnswer,
        versions: filteredVersions,
        isStaticActive,
      });
    },
    [filteredVersions, minDate, maxDate, isStaticActive],
  );

  return (
    <>
      <StyledHeadline sx={{ mb: theme.spacing(2), color: variables.palette.on_surface }}>
        {t('responseOptions')}
        <Tooltip tooltipTitle={t('responseOptionsTooltip')}>
          <span>
            <StyledTitleTooltipIcon id="more-info-outlined" width={16} height={16} />
          </span>
        </Tooltip>
      </StyledHeadline>
      {Object.values(responseOptions).map((responseOption, responseOptionIndex) =>
        responseOption.map((item, index) => {
          const dataTestid = `response-option-${
            flowResponsesIndex ? `${flowResponsesIndex}-` : ''
          }${responseOptionIndex}-${index}`;

          return (
            <Box
              key={`${item.activityItem.id}-${responseOptionIndex}-${index}`}
              data-testid={dataTestid}
              sx={{ mb: theme.spacing(6.4) }}
            >
              <CollapsedMdText
                text={getDictionaryText(item.activityItem.question)}
                maxHeight={SHOW_MORE_HEIGHT}
                data-testid={`${dataTestid}-question`}
              />
              {renderResponseOption({ ...item, dataTestid }, responseOptionIndex)}
            </Box>
          );
        }),
      )}
    </>
  );
};
