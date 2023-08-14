import { TooltipProps as MuiTooltipProps } from '@mui/material';

export type TooltipProps = Partial<MuiTooltipProps> & {
  tooltipTitle?: string | JSX.Element | null;
  className?: string;
  children: JSX.Element;
};
