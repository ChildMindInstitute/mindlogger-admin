import { TooltipProps as MuiTooltipProps } from '@mui/material';

export enum TooltipUiType {
  Primary = 'primary',
  Secondary = 'secondary',
}

export type TooltipProps = Partial<MuiTooltipProps> & {
  tooltipTitle?: string | JSX.Element | null;
  uiType?: TooltipUiType;
  className?: string;
  children: JSX.Element;
};
