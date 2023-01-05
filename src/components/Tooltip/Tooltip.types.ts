export enum TooltipUiType {
  primary = 'primary',
  secondary = 'secondary',
}

export type TooltipProps = {
  tooltipTitle?: string;
  uiType?: TooltipUiType;
  className?: string;
  children: JSX.Element;
};
