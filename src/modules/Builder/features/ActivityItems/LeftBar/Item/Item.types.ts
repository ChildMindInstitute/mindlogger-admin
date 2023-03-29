import { ApiItem } from 'modules/Builder/api';

import { LeftBarProps } from '../LeftBar.types';

export type ItemProps = ApiItem & Omit<LeftBarProps, 'items' | 'onAddItem'>;

export type ActionsType = {
  onRemoveItem: LeftBarProps['onRemoveItem'];
};
