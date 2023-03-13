import { TooltipProps, TooltipUiType } from './Tooltip.types';
import { StyledTooltip } from './Tooltip.styles';

export const Tooltip = ({
  tooltipTitle = '',
  uiType = TooltipUiType.Primary,
  children,
  ...props
}: TooltipProps) => (
  <StyledTooltip {...props} className={uiType} title={tooltipTitle}>
    {children}
  </StyledTooltip>
);
