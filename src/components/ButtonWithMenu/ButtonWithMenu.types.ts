import { MenuItem } from 'components/Menu/Menu.types';

export type ButtonWithMenuProps = {
  menuItems: MenuItem[];
  anchorEl: null | HTMLElement;
  setAnchorEl: (el: null | HTMLElement) => void;
  label: string;
  startIcon?: JSX.Element;
  variant?: 'text' | 'outlined';
  disabled?: boolean;
};
