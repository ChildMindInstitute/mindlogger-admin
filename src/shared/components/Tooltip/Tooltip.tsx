import { TooltipProps } from './Tooltip.types';
import { StyledTooltip } from './Tooltip.styles';

export const Tooltip = ({ tooltipTitle = '', children, ...props }: TooltipProps) => (
  <StyledTooltip {...props} title={tooltipTitle}>
    {children}
  </StyledTooltip>
);
