import { APIItem } from 'modules/Builder/api';
import { ActionsProps } from 'shared/components/Actions/Actions.types';

import { ItemContextType } from './Item/Item.types';

export type LeftBarProps = {
  items: APIItem[];
  activeItemId: string;
  onSetActiveItem: (id: string) => void;
  onAddItem: () => void;
  onRemoveItem: (context: ActionsProps<ItemContextType>['context']) => void;
};
