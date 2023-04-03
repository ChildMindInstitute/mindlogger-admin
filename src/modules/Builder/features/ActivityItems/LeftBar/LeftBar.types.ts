import { ActivityItem } from 'shared/types';

export type LeftBarProps = {
  items: ActivityItem[];
  activeItemId: string;
  onSetActiveItem: (id: string) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
};
