import { PopoverOrigin } from '@mui/material';

import { MenuUiType } from './Menu.const';

export type MenuActionProps<T = unknown> = { title?: string; context?: T };

export enum MenuItemType {
  Normal,
  Divider,
  Info,
}

export type MenuItem<T = unknown> = {
  type?: MenuItemType;
  icon?: JSX.Element;
  title?: string;
  action?: ({ title, context }: MenuActionProps<T>) => void;
  context?: T;
  isDisplayed?: boolean;
  disabled?: boolean;
  tooltip?: React.ReactNode;
  customItemColor?: string;
  'data-testid'?: string;
};

export type MenuProps<T> = {
  anchorEl: null | HTMLElement;
  onClose: (event?: object) => void;
  menuItems: MenuItem<T>[];
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  width?: string;
  uiType?: MenuUiType;
  'data-testid'?: string;
};
