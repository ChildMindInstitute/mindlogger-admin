import { ItemFormValues } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.types';

export type LeftBarProps = {
  items: ItemFormValues[];
  activeItemId: string;
  onSetActiveItem: (id: string) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
};
