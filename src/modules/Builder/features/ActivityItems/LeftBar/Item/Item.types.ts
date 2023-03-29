import { APIItem } from 'modules/Builder/api';

import { LeftBarProps } from '../LeftBar.types';

export type ItemProps = APIItem & Omit<LeftBarProps, 'items' | 'onAddItem'>;

export type ActionsType = {
  onRemoveItem: LeftBarProps['onRemoveItem'];
};

export type ItemContextType = {
  id: string;
};
