import { useFormContext } from 'react-hook-form';
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
import {
  RespondentsDataFormValues,
  FormattedResponses,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';

import { useDatavizFilters } from '../../hooks/useDatavizFilters';
import { COLORS } from '../Charts/Charts.const';
import { ResponseOptionsProps } from './ResponseOptions.types';
import { getResponseItem } from './ResponseOptions.utils';

export const ResponseOptions = ({ responseOptions, versions = [] }: ResponseOptionsProps) => {
  const { t } = useTranslation();
  const { watch } = useFormContext<RespondentsDataFormValues>();

  const { minDate, maxDate, filteredVersions } = useDatavizFilters(watch, versions);

  const renderResponseOption = (activityItemAnswer: FormattedResponses, index: number) => {
    if (UNSUPPORTED_ITEMS.includes(activityItemAnswer.activityItem.responseType))
      return <UnsupportedItemResponse itemType={activityItemAnswer.activityItem.responseType} />;

    const color = COLORS[index % COLORS.length];

    return getResponseItem({
      color,
      minDate,
      maxDate,
      activityItemAnswer,
      versions: filteredVersions,
    });
  };

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
          const dataTestid = `response-option-${responseOptionIndex}-${index}`;

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
