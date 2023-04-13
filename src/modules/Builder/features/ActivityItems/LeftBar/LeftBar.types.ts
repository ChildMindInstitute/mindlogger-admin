import { ItemFormValues } from 'modules/Builder/pages/BuilderApplet';

export type LeftBarProps = {
  items: ItemFormValues[];
  activeItemId: string;
  onSetActiveItem: (id: string) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
};
