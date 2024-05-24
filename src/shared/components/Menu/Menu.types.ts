import { PopoverOrigin } from '@mui/material';

import { MenuUiType } from './Menu.const';

export type MenuItem = {
  icon?: JSX.Element;
  title: string;
  action: (title?: string) => void;
  'data-testid'?: string;
};

export type MenuProps = {
  anchorEl: null | HTMLElement;
  onClose: () => void;
  menuItems: MenuItem[];
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  width?: string;
  uiType?: MenuUiType;
  'data-testid'?: string;
};
