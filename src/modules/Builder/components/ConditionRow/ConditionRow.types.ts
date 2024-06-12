import { ConditionType } from 'shared/consts';
import { ConditionRowType, ItemFormValues } from 'modules/Builder/types';
import { Condition } from 'redux/modules';

import { ConditionItemType } from './Condition';

export type OnChangeConditionType = {
  (args: {
    conditionType: ConditionType;
    conditionPayload: Condition['payload'];
    conditionPayloadName: string;
    selectedItem: ItemFormValues;
  }): void;
};

export type ConditionRowProps = {
  name: string;
  activityName?: string;
  index: number;
  onRemove: () => void;
  onChangeConditionType?: OnChangeConditionType;
  type?: ConditionRowType;
  scoreKey?: string;
  autoTrigger?: boolean;
  showError?: boolean;
  'data-testid'?: string;
  isItemFlow?: boolean;
};

export type OptionListItem = { labelKey: string; value: string; type: ConditionItemType };

export type GetPayload = {
  conditionType: ConditionType;
  conditionPayload?: Condition<unknown>['payload'];
  selectedItem?: ItemFormValues;
};
