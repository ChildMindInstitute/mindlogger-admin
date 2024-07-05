import { Box } from '@mui/material';

import { StyledFlexColumn, StyledTitleMedium, theme } from 'shared/styles';
import { ItemOption } from 'modules/Dashboard/features/RespondentData/RespondentData.types';

import { SelectionPerRowProps } from './SelectionPerRow.types';
import { TICK_HEIGHT } from '../../Charts/Charts.const';
import { MultiScatterChart } from '../../Charts/MultiScatterChart';

export const SelectionPerRow = ({
  color,
  minDate,
  maxDate,
  activityItem,
  versions,
  answers = {},
  isStaticActive,
  'data-testid': dataTestid,
}: SelectionPerRowProps) => {
  const height = (activityItem?.responseValues.options?.length + 1) * TICK_HEIGHT;

  return (
    <StyledFlexColumn>
      {activityItem?.responseValues?.rows?.map(({ rowName }, index) => (
        <Box
          key={rowName}
          data-testid={`${dataTestid}-row-${index}`}
          sx={{ mb: theme.spacing(4.8) }}
        >
          <StyledTitleMedium>{rowName}</StyledTitleMedium>
          <MultiScatterChart
            color={color}
            minDate={minDate}
            maxDate={maxDate}
            minY={0}
            maxY={activityItem.responseValues.options.length - 1}
            height={height}
            options={activityItem?.responseValues.options as ItemOption[]}
            responseType={activityItem.responseType}
            answers={answers[rowName]}
            versions={versions}
            useCategory
            isStaticActive={isStaticActive}
            data-testid={`${dataTestid}-select-per-row-${index}-multi-scatter-chart`}
          />
        </Box>
      ))}
    </StyledFlexColumn>
  );
};
