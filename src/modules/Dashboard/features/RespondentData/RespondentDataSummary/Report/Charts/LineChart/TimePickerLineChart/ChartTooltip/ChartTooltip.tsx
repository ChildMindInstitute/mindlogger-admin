import { forwardRef } from 'react';
import { format } from 'date-fns';
import { Box } from '@mui/material';

import { StyledBodyMedium, StyledLabelMedium, theme, variables } from 'shared/styles';
import { DateFormats } from 'shared/consts';

import { StyledTooltip } from './ChartTooltip.styles';
import { ChartTooltipProps } from './ChartTooltip.types';

export const ChartTooltip = forwardRef<HTMLDivElement, ChartTooltipProps>(
  ({ data, onMouseEnter, onMouseLeave }, tooltipRef) => (
    <StyledTooltip ref={tooltipRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {data && (
        <>
          {data.map(({ x, y }, index) => (
            <Box key={`${x}_${y}`} sx={{ p: theme.spacing(index ? 0.6 : 0.4, 1.2) }}>
              <StyledBodyMedium
                sx={{ padding: theme.spacing(0.4, 0) }}
                color={variables.palette.white}
              >
                {format(y, DateFormats.Time)}
              </StyledBodyMedium>
              <StyledLabelMedium sx={{ p: theme.spacing(0.2, 0) }} color={variables.palette.white}>
                {format(x, DateFormats.MonthDayTime)}
              </StyledLabelMedium>
            </Box>
          ))}
        </>
      )}
    </StyledTooltip>
  ),
);
