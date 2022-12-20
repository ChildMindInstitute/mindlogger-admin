import { Tooltip as MuiTooltip } from '@mui/material';

import { TooltipProps } from './Tooltip.types';

export const Tooltip = ({ tooltipTitle = '', children }: TooltipProps) => (
  <MuiTooltip title={tooltipTitle}>{children}</MuiTooltip>
);
