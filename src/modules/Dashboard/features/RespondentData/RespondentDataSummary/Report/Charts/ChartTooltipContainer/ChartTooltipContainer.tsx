import { forwardRef } from 'react';

import { StyledTooltip } from './ChartTooltipContainer.styles';
import { ChartTooltipContainerProps } from './ChartTooltipContainerProps.types';

export const ChartTooltipContainer = forwardRef<HTMLDivElement, ChartTooltipContainerProps>(
  ({ onMouseEnter, onMouseLeave, 'data-testid': dataTestid, children }, tooltipRef) => (
    <StyledTooltip
      ref={tooltipRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-testid={`${dataTestid}-tooltip-wrapper`}>
      {children}
    </StyledTooltip>
  ),
);
