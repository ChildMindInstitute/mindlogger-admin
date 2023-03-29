import { ActivityItemApi } from 'modules/Builder/api';

import { LeftBarProps } from '../LeftBar.types';

export type ItemProps = ActivityItemApi & Omit<LeftBarProps, 'items' | 'onAddItem'>;

export type ActionsType = {
  onRemoveItem: LeftBarProps['onRemoveItem'];
};
