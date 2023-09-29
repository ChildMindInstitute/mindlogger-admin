import { ReactNode } from 'react';

export type ActivitySettingsOptions = {
  name: string;
  title: string | JSX.Element;
  component: ReactNode;
  icon: ReactNode;
  path: string;
};
