import { TooltipProps, TooltipUiType } from './Tooltip.types';
import { StyledTooltip } from './Tooltip.styles';

export const Tooltip = ({
  tooltipTitle = '',
  uiType = TooltipUiType.Primary,
  children,
}: TooltipProps) => (
  <StyledTooltip className={uiType} title={tooltipTitle}>
    {children}
  </StyledTooltip>
);
