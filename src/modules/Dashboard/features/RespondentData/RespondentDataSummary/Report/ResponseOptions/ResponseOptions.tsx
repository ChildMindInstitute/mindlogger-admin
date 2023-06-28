import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Tooltip } from 'shared/components';
import { StyledHeadline, StyledTitleTooltipIcon, theme, variables } from 'shared/styles';
import { isItemUnsupported } from 'modules/Dashboard/features/RespondentData/RespondentData.utils';
import { UnsupportedItemResponse } from 'modules/Dashboard/features/RespondentData/UnsupportedItemResponse';
import { CollapsedMdText } from 'modules/Dashboard/features/RespondentData/CollapsedMdText';
import { getDictionaryText } from 'shared/utils';
import { useDatavizFilters } from 'modules/Dashboard/hooks';

import { ResponseOption, FilterFormValues } from '../Report.types';
import { ResponseOptionsProps } from './ResponseOptions.types';
import { getResponseItem } from './ResponseOptions.utils';
import { COLORS } from './ResponseOptions.const';

export const ResponseOptions = ({ responseOptions, versions = [] }: ResponseOptionsProps) => {
  const { t } = useTranslation();
  const { watch } = useFormContext<FilterFormValues>();

  const { minDate, maxDate, filteredVersions } = useDatavizFilters(watch, versions);

  const renderResponseOption = ({ activityItem, answers }: ResponseOption, index: number) => {
    if (isItemUnsupported(activityItem.responseType))
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
    <>
      <StyledHeadline sx={{ mb: theme.spacing(2), color: variables.palette.on_surface }}>
        {t('responseOptions')}
        <Tooltip tooltipTitle={t('responseOptions')}>
          <span>
            <StyledTitleTooltipIcon id="more-info-outlined" width={16} height={16} />
          </span>
        </Tooltip>
      </StyledHeadline>
      {responseOptions.map((responseOption, index) => (
        <Box key={responseOption.activityItem.id} sx={{ mb: theme.spacing(6.4) }}>
          <CollapsedMdText
            text={getDictionaryText(responseOption.activityItem.question)}
            maxHeight={120}
          />
          {renderResponseOption(responseOption, index)}
        </Box>
      ))}
    </>
  );
};
