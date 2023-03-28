import { APIItem } from 'modules/Builder/api';

export type LeftBarProps = {
  items: APIItem[];
  activeItemId: string;
  handleSetActiveItem: (val: string) => void;
  handleAddItem: () => void;
};
