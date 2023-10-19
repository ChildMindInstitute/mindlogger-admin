import { ItemFormValues } from 'modules/Builder/types';

export type DeleteItemModalProps = {
  itemIdToDelete: string;
  activeItemIndex: number;
  onClose: () => void;
  onRemoveItem: (index: number) => void;
  onSetActiveItem: (item?: ItemFormValues) => void;
};
