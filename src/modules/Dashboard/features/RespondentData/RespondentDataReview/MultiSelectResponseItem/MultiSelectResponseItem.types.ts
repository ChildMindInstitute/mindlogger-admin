import { MultiSelectItem } from 'shared/state';

export type MultiSelectResponseItemProps = {
  item: MultiSelectItem;
  response: Record<string, string | number>;
};
