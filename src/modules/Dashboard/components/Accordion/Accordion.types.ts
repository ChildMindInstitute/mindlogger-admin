export enum AccordionUiType {
  Primary,
  Secondary,
}

export type AccordionProps = {
  children: JSX.Element;
  uiType?: AccordionUiType;
  title?: JSX.Element | string;
  'data-testid'?: string;
};
