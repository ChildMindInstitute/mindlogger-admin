import { Item, NavigationItem } from 'shared/components';

export type AppletSetting = {
  label: string;
  component: JSX.Element;
  param: string;
};

export type NavigationSetting = {
  label: string;
  items: NavigationItem[];
};

export type AppletSettingsProps = {
  settings: Item[];
  isBuilder?: boolean;
  'data-testid'?: string;
};
