import { ActivityItemApi } from 'modules/Builder/api';

export type LeftBarProps = {
  items: ActivityItemApi[];
  activeItemId: string;
  onSetActiveItem: (id: string) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
};
