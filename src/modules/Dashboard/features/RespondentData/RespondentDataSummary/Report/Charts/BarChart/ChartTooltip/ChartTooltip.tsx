import { forwardRef } from 'react';

import { StyledFlexTopCenter, StyledLabelMedium, theme, variables } from 'shared/styles';

import { StyledBackground, StyledTooltip } from './ChartTooltip.styles';
import { ChartTooltipProps } from './ChartTooltip.types';

export const ChartTooltip = forwardRef<HTMLDivElement, ChartTooltipProps>(
  ({ data, onMouseEnter, onMouseLeave, 'data-testid': dataTestid }, tooltipRef) => (
    <StyledTooltip
      ref={tooltipRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-testid={`${dataTestid}-tooltip`}
    >
      {data && (
        <>
          <StyledFlexTopCenter sx={{ padding: theme.spacing(0.4, 0.8) }}>
            <StyledBackground
              data-testid={`${dataTestid}-tooltip-background`}
              sx={{ backgroundColor: data.backgroundColor }}
            />
            <StyledLabelMedium sx={{ ml: theme.spacing(0.8) }} color={variables.palette.white}>
              {data.label}: {data.value}
            </StyledLabelMedium>
          </StyledFlexTopCenter>
        </>
      )}
    </StyledTooltip>
  ),
);
