import { format } from 'date-fns';
import { Box } from '@mui/material';

import { StyledBodyMedium, StyledLabelMedium, theme, variables } from 'shared/styles';
import { DateFormats } from 'shared/consts';

import { StyledIndent } from '../../../Chart.styles';
import { StyledTooltip } from './ChartTooltip.styles';
import { ChartTooltipProps } from './ChartTooltip.types';

export const ChartTooltip = ({ data, 'data-testid': dataTestid }: ChartTooltipProps) => (
  <>
    {data && (
      <>
        <StyledIndent />
        <StyledTooltip data-testid={`${dataTestid}-tooltip`}>
          {data.map(({ x, y }, index) => (
            <Box
              key={`${x}_${y}`}
              sx={{ p: theme.spacing(index ? 0.6 : 0.4, 1.2) }}
              data-testid={`${dataTestid}-tooltip-item-${index}`}
            >
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
        </StyledTooltip>
      </>
    )}
  </>
);
