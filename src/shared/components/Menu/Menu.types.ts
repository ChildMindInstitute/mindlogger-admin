import { PopoverOrigin } from '@mui/material';

export type MenuItem = {
  icon?: JSX.Element;
  title: string;
  action: (title?: string) => void;
};

export type MenuProps = {
  anchorEl: null | HTMLElement;
  onClose: () => void;
  menuItems: MenuItem[];
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  width?: string;
};
