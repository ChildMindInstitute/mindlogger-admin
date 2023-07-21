import { DefaultTFuncReturn } from 'i18next';

export enum AccordionUiType {
  Primary,
  Secondary,
}

export type AccordionProps = {
  children: JSX.Element;
  uiType?: AccordionUiType;
  title?: JSX.Element | DefaultTFuncReturn;
};
