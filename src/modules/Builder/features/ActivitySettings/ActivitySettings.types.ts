import { ReactNode } from 'react';
import { DefaultTFuncReturn } from 'i18next';

export type ActivitySettingsOptions = {
  name: string;
  title: string | DefaultTFuncReturn | JSX.Element;
  component: ReactNode;
  icon: ReactNode;
  path: string;
};
