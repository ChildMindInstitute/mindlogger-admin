import { MenuItem, MenuProps } from '../Menu';

export type ActionsMenuProps<T> = Pick<MenuProps<T>, 'anchorOrigin' | 'transformOrigin'> & {
  menuItems: MenuItem<T>[];
  'data-testid'?: string;
  buttonColor?: 'primary' | 'secondary';
};
