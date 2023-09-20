import { ReactNode, FC } from 'react';
import { DefaultTFuncReturn } from 'i18next';

export type HeaderProps = {
  isSticky: boolean;
  children: ReactNode;
  headerProps?: Record<string, unknown>;
};

export type BuilderContainerProps = {
  title: string | DefaultTFuncReturn;
  Header?: FC<HeaderProps>;
  headerProps?: Record<string, unknown>;
  children?: ReactNode;
  hasMaxWidth?: boolean;
};
