import { TooltipProps } from './Tooltip.types';
import { StyledTooltip } from './Tooltip.styles';

export const Tooltip = ({ tooltipTitle = '', children, maxWidth, ...props }: TooltipProps) => (
  <StyledTooltip
    {...props}
    title={tooltipTitle}
    sx={{
      '.MuiTooltip-tooltip': {
        maxWidth: maxWidth ?? '24rem',
      },
    }}>
    {children}
  </StyledTooltip>
);
