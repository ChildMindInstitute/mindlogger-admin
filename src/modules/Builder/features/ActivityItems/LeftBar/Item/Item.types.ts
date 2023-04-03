import { ActivityItem } from 'shared/types';

import { LeftBarProps } from '../LeftBar.types';

export type ItemProps = { item: ActivityItem; name: string } & Omit<
  LeftBarProps,
  'items' | 'onAddItem'
>;

export type ActionsType = {
  onRemoveItem: LeftBarProps['onRemoveItem'];
  onChangeVisibility: () => void;
};
