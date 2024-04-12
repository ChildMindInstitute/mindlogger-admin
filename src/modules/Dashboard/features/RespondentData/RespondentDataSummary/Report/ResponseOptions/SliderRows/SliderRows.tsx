import { Box } from '@mui/material';

import { StyledFlexColumn, StyledTitleMedium, theme } from 'shared/styles';
import { SliderItemResponseValues } from 'shared/state';
import { getSliderOptions } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/utils/getSliderOptions';

import { TICK_HEIGHT } from '../../Charts/Charts.const';
import { MultiScatterChart } from '../../Charts/MultiScatterChart';
import { SliderRowsProps } from './SliderRows.types';

export const SliderRows = ({
  color,
  minDate,
  maxDate,
  activityItem,
  versions,
  answers = {},
  dataTestid,
}: SliderRowsProps) => (
  <StyledFlexColumn>
    {activityItem?.responseValues?.rows?.map((row, index) => {
      const options = getSliderOptions(row as SliderItemResponseValues, row.id);
      const height = (options?.length + 1) * TICK_HEIGHT;
      const values = options.map(({ value }) => value);
      const minY = Math.min(...values);
      const maxY = Math.max(...values);

      return (
        <Box
          key={row.label}
          data-testid={`${dataTestid}-row-${index}`}
          sx={{ mb: theme.spacing(4.8) }}
        >
          <StyledTitleMedium>{row.label}</StyledTitleMedium>
          <MultiScatterChart
            color={color}
            minDate={minDate}
            maxDate={maxDate}
            minY={minY}
            maxY={maxY}
            height={height}
            options={options}
            responseType={activityItem.responseType}
            answers={answers[row.id]}
            versions={versions}
            data-testid={`${dataTestid}-row-${index}-multi-scatter-chart`}
          />
        </Box>
      );
    })}
  </StyledFlexColumn>
);
