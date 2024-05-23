import { MenuItem } from '../Menu';

export type ActionsMenuProps<T> = {
  menuItems: MenuItem<T>[];
  'data-testid'?: string;
};
