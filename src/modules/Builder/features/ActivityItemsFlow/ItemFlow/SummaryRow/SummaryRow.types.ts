import { ItemFormValues } from 'modules/Builder/types';

export type SummaryRowProps = {
  name: string;
  activityName?: string;
  'data-testid'?: string;
};

export type GetItemsOptionsProps = {
  items: ItemFormValues[];
  itemsInUsage: Set<unknown>;
};
