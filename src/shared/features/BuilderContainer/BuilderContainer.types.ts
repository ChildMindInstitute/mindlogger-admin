import { ReactNode, FC } from 'react';
import { DefaultTFuncReturn } from 'i18next';

export type BuilderContainerProps = {
  title: string | DefaultTFuncReturn;
  Header?: FC<{ isSticky: boolean; children: ReactNode }>;
  children?: ReactNode;
};
