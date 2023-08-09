import { NavigationItem } from '../../NavigationMenu.types';

export type ItemProps = {
  item: NavigationItem;
  isCompact: boolean;
  onClick: (item: NavigationItem) => void;
};
