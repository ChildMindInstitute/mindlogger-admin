import { ApiItem } from 'modules/Builder/api';

export type LeftBarProps = {
  items: ApiItem[];
  activeItemId: string;
  onSetActiveItem: (id: string) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
};
