import { ReactNode } from 'react';

import { TooltipProps as MuiTooltipProps } from '@mui/material';

export type TooltipProps = Partial<MuiTooltipProps> & {
  tooltipTitle?: string | ReactNode | null;
  className?: string;
  children: JSX.Element;
  maxWidth?: string;
};
