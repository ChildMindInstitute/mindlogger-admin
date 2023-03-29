import { APIItem } from 'modules/Builder/api';

export type LeftBarProps = {
  items: APIItem[];
  activeItemId: string;
  onSetActiveItem: (id: string) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
};
