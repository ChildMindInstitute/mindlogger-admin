import { ItemFormValues } from 'modules/Builder/types';
import { ItemResponseType } from 'shared/consts';
import { ConditionalLogic, Condition } from 'shared/state/Applet';

export type SummaryRowProps = {
  name: string;
  activityName?: string;
  'data-testid'?: string;
};

export type GetMatchOptionsProps = {
  items: ItemFormValues[];
  conditions: ConditionalLogic['conditions'];
};

export type GetItemsOptionsProps = {
  items: ItemFormValues[];
  itemsInUsage: Set<unknown>;
  conditions: ConditionalLogic['conditions'];
};

export type GetItemsInUsageProps = {
  conditionalLogic?: ConditionalLogic[];
  itemKey: string;
};

export type ConditionWithResponseType = Condition & { responseType: ItemResponseType };
