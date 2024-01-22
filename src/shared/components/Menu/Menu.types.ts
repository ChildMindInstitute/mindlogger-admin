import { PopoverOrigin } from '@mui/material';

import { MenuUiType } from './Menu.const';

export type MenuActionProps<T = unknown> = { title?: string; context?: T };

export type MenuItem<T = unknown> = {
  icon?: JSX.Element;
  title: string;
  action: ({ title, context }: MenuActionProps<T>) => void;
  context?: T;
  isDisplayed?: boolean;
  disabled?: boolean;
  tooltip?: string;
  customItemColor?: string;
  'data-testid'?: string;
};

export type MenuProps<T> = {
  anchorEl: null | HTMLElement;
  onClose: () => void;
  menuItems: MenuItem<T>[];
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  width?: string;
  uiType?: MenuUiType;
  'data-testid'?: string;
};
