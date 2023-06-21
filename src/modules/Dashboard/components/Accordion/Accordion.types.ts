export enum AccordionUiType {
  Primary,
  Secondary,
}

export type AccordionProps = {
  children: JSX.Element;
  uiType?: AccordionUiType;
  title?: string;
};
