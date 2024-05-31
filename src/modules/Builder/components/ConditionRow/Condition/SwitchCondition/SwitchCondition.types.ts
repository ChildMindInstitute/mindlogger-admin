import { ConditionItemType } from '../Condition.const';
import { ConditionItem, ConditionProps } from '../Condition.types';

export type SwitchConditionProps = {
  selectedItem?: ConditionItem;
  itemType?: ConditionItemType;
  dataTestid: ConditionProps['data-testid'];
  isValueSelectDisabled: boolean;
} & Pick<ConditionProps, 'payloadName' | 'state'>;
