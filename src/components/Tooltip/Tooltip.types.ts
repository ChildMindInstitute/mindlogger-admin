export enum TooltipUiType {
  Primary = 'primary',
  Secondary = 'secondary',
}

export type TooltipProps = {
  tooltipTitle?: string;
  uiType?: TooltipUiType;
  className?: string;
  children: JSX.Element;
};
