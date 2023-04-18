import { ItemFormValues } from 'modules/Builder/pages/BuilderApplet';

import { LeftBarProps } from '../LeftBar.types';

export type ItemProps = { item: ItemFormValues; name: string; index: number } & Omit<
  LeftBarProps,
  'items' | 'onAddItem' | 'onInsertItem'
>;

export type ActionsType = {
  onRemoveItem: LeftBarProps['onRemoveItem'];
  onDuplicateItem: () => void;
  onChangeVisibility: () => void;
};
