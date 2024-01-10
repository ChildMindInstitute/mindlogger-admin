import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Tooltip } from 'shared/components/Tooltip';
import { StyledHeadline, StyledTitleTooltipIcon, theme, variables } from 'shared/styles';
import { UnsupportedItemResponse } from 'modules/Dashboard/features/RespondentData/UnsupportedItemResponse';
import { CollapsedMdText } from 'modules/Dashboard/features/RespondentData/CollapsedMdText';
import { getDictionaryText } from 'shared/utils';
import { useDatavizFilters } from 'modules/Dashboard/hooks';
import { SummaryFiltersForm } from 'modules/Dashboard/pages/RespondentData/RespondentData.types';
import { UNSUPPORTED_ITEMS } from 'modules/Dashboard/features/RespondentData/RespondentData.consts';

import { COLORS } from '../Charts/Charts.const';
import { FormattedResponse } from '../Report.types';
import { ResponseOptionsProps } from './ResponseOptions.types';
import { getResponseItem } from './ResponseOptions.utils';

export const ResponseOptions = ({ responseOptions, versions = [] }: ResponseOptionsProps) => {
  const { t } = useTranslation();
  const { watch } = useFormContext<SummaryFiltersForm>();

  const { minDate, maxDate, filteredVersions } = useDatavizFilters(watch, versions);

  const renderResponseOption = (
    { activityItem, answers, dataTestid }: FormattedResponse & { dataTestid: string },
    index: number,
  ) => {
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
      dataTestid,
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
          const dataTestid = `response-option-${index}`;

          return (
            <Box
              key={`${item.activityItem.id}-${index}`}
              data-testid={dataTestid}
              sx={{ mb: theme.spacing(6.4) }}
            >
              <CollapsedMdText
                text={getDictionaryText(item.activityItem.question)}
                maxHeight={120}
              />
              {renderResponseOption({ ...item, dataTestid }, responseOptionIndex)}
            </Box>
          );
        }),
      )}
    </>
  );
};
