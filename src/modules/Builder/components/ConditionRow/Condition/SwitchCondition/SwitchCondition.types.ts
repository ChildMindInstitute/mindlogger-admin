import { ReactNode } from 'react';

import { ConditionItemType } from '../Condition.const';
import { ConditionItem, ConditionProps } from '../Condition.types';

export type SwitchConditionProps = {
  selectedItem?: ConditionItem;
  itemType?: ConditionItemType;
  dataTestid: ConditionProps['data-testid'];
  isValueSelectDisabled: boolean;
  children: ReactNode;
} & Pick<ConditionProps, 'payloadName' | 'state'>;
