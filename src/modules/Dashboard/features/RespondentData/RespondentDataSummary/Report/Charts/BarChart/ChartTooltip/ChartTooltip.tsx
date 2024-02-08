import { StyledLabelMedium, theme, variables } from 'shared/styles';

import { StyledTooltip, StyledBackground } from './ChartTooltip.styles';
import { ChartTooltipProps } from './ChartTooltip.types';

export const ChartTooltip = ({ data, 'data-testid': dataTestid }: ChartTooltipProps) => (
  <>
    {data && (
      <StyledTooltip sx={{ padding: theme.spacing(0.4, 0.8) }} data-testid={`${dataTestid}-tooltip`}>
        <StyledBackground
          data-testid={`${dataTestid}-tooltip-background`}
          sx={{ backgroundColor: data.backgroundColor }}
        />
        <StyledLabelMedium sx={{ ml: theme.spacing(0.8) }} color={variables.palette.white}>
          {data.label}: {data.value}
        </StyledLabelMedium>
      </StyledTooltip>
    )}
  </>
);
