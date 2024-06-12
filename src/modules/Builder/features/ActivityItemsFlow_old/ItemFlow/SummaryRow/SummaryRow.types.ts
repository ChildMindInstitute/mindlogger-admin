import { ItemFormValues } from 'modules/Builder/types';
import { ConditionalLogic } from 'shared/state/Applet';

export type SummaryRowProps = {
  name: string;
  activityName?: string;
  'data-testid'?: string;
};

export type GetItemsOptionsProps = {
  items: ItemFormValues[];
  itemsInUsage: Set<unknown>;
};

export type GetItemsInUsageProps = {
  conditionalLogic?: ConditionalLogic[];
  itemKey: string;
};
